const UserModel = require('../../models/UserModel')
// bcrypt 第三方密码加密库
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')
const fs = require('fs')
const path = require('path')
// 发送请求
const request = require('request')

const qs = require('qs')

// 检测用户是否填写身份证号
exports.checkUserIdcard = async (ctx, next) => {
  const token = ctx.header['pet-token']
  const userInfo = jwt.verify(token, SECRET)
  try {
    const user = await UserModel.findOne({
      attributes: ['id', 'idcard'],
      where: {
        mobile: userInfo.mobile
      }
    })
    if (user) {
      if (!user.idcard) {
        ctx.body = {
          code: 400,
          message: '请先前往个人中心填写身份证号'
        }
        return
      }
      ctx.body = {
        code: 200,
        message: 'ok'
      }
    } else {
      ctx.body = {
        code: 400,
        message: '请重新登录'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 查看用户个人信息
exports.getUserData = async (ctx, next) => {
  const token = ctx.header['pet-token']
  const user = jwt.verify(token, SECRET)
  try {
    const userMobile = await UserModel.findOne({
      attributes: ['id'],
      where: {
        mobile: user.mobile
      }
    })
    if (userMobile) {
      const userInfo = await UserModel.findOne({
        attributes: ['name', 'sex'],
        where: {
          id: user.id
        }
      })
      ctx.body = {
        code: 200,
        data: {
          userInfo
        }
      }
    } else {
      ctx.body = {
        code: 400,
        message: '请重新登录'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 修改用户信息
exports.updateUserData = async (ctx, next) => {
  const req = ctx.request.body
  const token = ctx.header['pet-token']
  const userInfo = jwt.verify(token, SECRET)
  try {
    const user = await UserModel.findOne({
      attributes: ['id', 'name'],
      where: {
        mobile: userInfo.mobile
      }
    })
    if (user) {
      // // idcard为空或者没有变化的情况
      // if (user.idcard === req.idcard) {
      //   // sex没有变化的情况
      //   if (user.sex === req.sex) {
      //     // 验证昵称唯一性
      //     const nameUniq = await UserModel.findOne({
      //       attributes: ['id'],
      //       where: {
      //         name: req.name
      //       }
      //     })
      //     if (nameUniq) {
      //       ctx.body = {
      //         code: 400,
      //         message: '该昵称已存在',
      //       }
      //       return false
      //     }
      //   }
      // } else {
      //   // 验证身份证号唯一性
      //   const idcardUniq = await UserModel.findOne({
      //     attributes: ['id'],
      //     where: {
      //       idcard: req.idcard
      //     }
      //   })
      //   if (idcardUniq) {
      //     ctx.body = {
      //       code: 400,
      //       message: '该身份证号已存在',
      //     }
      //     return false
      //   }
      // }
      // 昵称发生改变的情况
      if (user.name !== req.name) {
        // 验证昵称唯一性
        const nameUniq = await UserModel.findOne({
          attributes: ['id'],
          where: {
            name: req.name
          }
        })
        if (nameUniq) {
          ctx.body = {
            code: 400,
            message: '该昵称已存在',
          }
          return false
        }
      }
      const res = await UserModel.update({
        name: req.name,
        sex: req.sex,
      }, {
        where: {
          id: userInfo.id
        }
      })
      ctx.body = {
        code: 200,
        message: '修改成功'
      }
    } else {
      ctx.body = {
        code: 400,
        message: '请重新登录'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 查看用户认证信息
exports.getUserReal = async (ctx, next) => {
  const token = ctx.header['pet-token']
  const user = jwt.verify(token, SECRET)
  try {
    const userMobile = await UserModel.findOne({
      attributes: ['id'],
      where: {
        mobile: user.mobile
      }
    })
    if (userMobile) {
      const userInfo = await UserModel.findOne({
        attributes: ['realName', 'idcard'],
        where: {
          id: user.id
        }
      })
      ctx.body = {
        code: 200,
        data: {
          userInfo
        }
      }
    } else {
      ctx.body = {
        code: 400,
        message: '请重新登录'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 提交认证
exports.createVerification = async (ctx, next) => {
  const req = ctx.request.body
  const token = ctx.header['pet-token']
  const userInfo = jwt.verify(token, SECRET)
  try {
    const user = await UserModel.findOne({
      attributes: ['id', 'name'],
      where: {
        mobile: userInfo.mobile
      }
    })
    if (user) {
      let path = {
        cardNo: req.idcard,
        realName: req.realName
      }
      await new Promise((resolve, reject) => {
        request({
          url: 'https://lfeid.market.alicloudapi.com/idcheck/life?' + qs.stringify(path),
          method: 'GET',
          json: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'APPCODE 0030623c119447edbf7b6c15db7d99ea'
          }
        }, function (error, response, body) {
          // console.log(error); //null
          // console.log(response); //一大堆东西，包括返回的结果、类型、时间，状态码等等，response包含了body
          // console.log(body); //单纯的结果错误错误的话statusCode是多少？
          if (!error && body.error_code === 0 && body.result.isok === true) {
            // 请求成功 .then
            resolve()
          } else {
            // 请求失败 .catch
            reject()
          }
        })
      }).then(result => {
        const res = UserModel.update({
          idcard: req.idcard,
          realName: req.realName
        }, {
          where: {
            id: user.id
          }
        })
        ctx.body = {
          code: 200,
          message: '认证成功'
        }
      }).catch(error => {
        ctx.body = {
          code: 400,
          message: '认证失败'
        }
      })
    } else {
      ctx.body = {
        code: 400,
        message: '请重新登录'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 上传用户头像
exports.uploadHeading = async (ctx, next) => {
  const file = ctx.request.files.file
  // 生成头像的唯一识别码
  let name = uuid();
  // 获取图片类型
  let type = file.name.split('.')[1]
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, '../../../../../pet_pics/user/') + `${name}.${type}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  let fp = filePath.split("\\")
  // 新头像的访问路径
  let newHeading = "http://localhost:5000/" + fp[2] + "/" + fp[3]
  ctx.body = {
    code: 200,
    data: {
      newHeading
    }
  }
}

// 修改用户头像
exports.updateHeading = async (ctx, next) => {
  const req = ctx.request.body
  try {
    const res = await UserModel.update({
      heading: req.newHeading,
    }, {
      where: {
        id: req.id
      }
    })
    const userInfo = await UserModel.findOne({
      attributes: ['mobile', 'name', 'heading'],
      where: {
        id: req.id
      }
    })
    // 查询数据库，构建token所需参数
    const user = {
      id: req.id,
      mobile: userInfo.mobile,
      name: userInfo.name,
      heading: userInfo.heading
    }
    const token = jwt.sign(user, SECRET, {expiresIn: 60 * 60})
    // 返回一个token参数
    ctx.body = {
      code: 200,
      message: '修改成功',
      data: {
        token
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 修改用户密码
exports.updateUserPwd = async (ctx, next) => {
  const req = ctx.request.body
  const token = ctx.header['pet-token']
  const userInfo = jwt.verify(token, SECRET)
  try {
    const user = await UserModel.findOne({
      attributes: ['id', 'password'],
      where: {
        mobile: userInfo.mobile
      }
    })
    if (user) {
      if (!bcrypt.compareSync(req.oldPwd, user.password)) {
        ctx.body = {
          code: 400,
          message: '原密码错误',
        }
        return false
      } else if (bcrypt.compareSync(req.pwd, user.password)) {
        ctx.body = {
          code: 400,
          message: '新密码不能与原密码相同',
        }
        return false
      } else {
        const salt = bcrypt.genSaltSync(10)
        const hashPwd = bcrypt.hashSync(req.pwd, salt)
        const res = await UserModel.update({
          password: hashPwd
        }, {
          where: {
            id: user.id
          }
        })
        ctx.body = {
          code: 200,
          message: '修改密码成功'
        }
      }
    } else {
      ctx.body = {
        code: 400,
        message: '请重新登录'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 检验原手机号是否正确
exports.checkOldMobile = async (ctx, next) => {
  const token = ctx.header['pet-token']
  const userInfo = jwt.verify(token, SECRET)
  try {
    const user = await UserModel.findOne({
      attributes: ['id', 'mobile'],
      where: {
        mobile: userInfo.mobile
      }
    })
    if (user) {
      const mobile = ctx.params.mobile
      if (mobile !== user.mobile) {
        ctx.body = {
          code: 400,
          message: '原账号错误',
        }
        return false
      } else {
        ctx.body = {
          code: 200,
          message: '发送验证码',
        }
      }
    } else {
      ctx.body = {
        code: 400,
        message: '请重新登录'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 修改用户账号
exports.updateUserMobile = async (ctx, next) => {
  const req = ctx.request.body
  const token = ctx.header['pet-token']
  const userInfo = jwt.verify(token, SECRET)
  try {
    const user = await UserModel.findOne({
      attributes: ['id', 'mobile'],
      where: {
        mobile: userInfo.mobile
      }
    })
    if (user) {
      const res = await UserModel.update({
        mobile: req.mobile
      }, {
        where: {
          id: user.id
        }
      })
      ctx.body = {
        code: 200,
        message: '修改账号成功'
      }
    } else {
      ctx.body = {
        code: 400,
        message: '请重新登录'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

function uuid() {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  let uuid = s.join("");
  return uuid;
}

