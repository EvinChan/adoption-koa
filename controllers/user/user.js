const UserModel = require('../../models/UserModel')
const jwt = require('jsonwebtoken')
// bcrypt 第三方密码加密库
const bcrypt = require('bcryptjs')
const {SECRET} = require('../../config/constants')
// 发送请求
const request = require('request')
// redis
const redis = require('../../db/redis')

// 检验手机号是否注册 200 未注册
exports.checkMobileFalse = async (ctx, next) => {
  try {
    // 验证用户账号唯一性
    const mobileUniq = await UserModel.findOne({
      attributes: ['id'],
      where: {
        mobile: ctx.params.mobile
      }
    })
    if (mobileUniq) {
      ctx.body = {
        code: 400,
        message: '该账号已被注册'
      }
      return false
    } else {
      ctx.body = {
        code: 200,
        message: 'ok'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 发送短信验证码
exports.getUserSms = async (ctx, next) => {
  // 生成随机6位数字做验证码
  let code = ''
  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * 10);
    code += random;
  }
  //发送验证码
  let data = {
    "mobile": ctx.params.mobile,
    //签名模板
    "sign_id": '12097',
    //短信模板
    "temp_id": '1',
    //短信参数
    "temp_para": {"code": code}
  }
  // 发送post请求
  await new Promise((resolve, reject) => {
    request({
      url: 'https://api.sms.jpush.cn/v1/messages',
      method: 'POST',
      json: true,
      headers: {
        // 数据类型为json，加上使用 HTTP Basic Authentication 的方式做访问授权
        // 授权码是短信服务商提供的appKey和masterSecret拼装起来的字符串，再做base64转换
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZmFiNmIzZGQxYTZmZDNhYzliY2M3YTczOmQ3MTNkZjdiYjE3NjA4OTdjMTZmMTVjZA=='
      },
      body: data
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // 请求成功的处理逻辑
        // 将验证码和手机号存入redis K-V
        redis.set(ctx.params.mobile, code)
        // 300秒自动过期
        redis.expire(ctx.params.mobile, 60 * 5);
        resolve()
      } else {
        // 请求失败的处理逻辑
        reject()
      }
    });
  }).then(result => {
    ctx.body = {
      code: 200,
      message: '发送验证码成功'
    }
  }).catch(error => {
    ctx.body = {
      code: 400,
      message: '发送验证码失败'
    }
  })
}

// 检验手机号验证码是否正确
exports.checkCode = async (ctx, next) => {
  await new Promise((resolve, reject) => {
    //从redis中取出对应手机号的验证码
    redis.get(ctx.params.mobile).then(result => {
      //成功取出验证码，与前端发送过来的验证码作对比
      if (result === ctx.params.code) {
        //验证码一致
        resolve()
      } else {
        //验证码不一致
        reject()
      }
    }).catch(error => {
      //该手机号对应没有验证码
      reject()
    })
  }).then(async result => {
    ctx.body = {
      code: 200,
      message: '验证码正确'
    }
  }).catch(error => {
    ctx.body = {
      code: 400,
      message: '验证码错误',
    }
  })
}

// 用户注册
exports.register = async (ctx, next) => {
  const req = ctx.request.body
  try {
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
        message: '该昵称已被注册',
      }
      return
    }
    let heading = ''
    if (req.sex === 0) {
      heading = 'http://localhost:5000/system/用户0.png'
    } else {
      heading = 'http://localhost:5000/system/用户1.png'
    }
    // 随机生成盐值
    const salt = bcrypt.genSaltSync(10)
    // 用盐值对密码加密
    const hashPassword = bcrypt.hashSync(req.pwd, salt)
    const res = await UserModel.create({
      mobile: req.mobile,
      password: hashPassword,
      name: req.name,
      sex: req.sex,
      heading: heading,
      status: 0,
      isOrg: 0
    })
    ctx.body = {
      code: 200,
      message: '注册成功',
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 用户登录
exports.login = async (ctx, next) => {
  const req = ctx.request.body
  try {
    const mobileSigned = await UserModel.findOne({
      attributes: ['id', 'password', 'mobile', 'name', 'heading', 'status'],
      where: {
        mobile: req.mobile,
      }
    })
    // 若账号不存在
    if (!mobileSigned) {
      ctx.body = {
        code: 400,
        message: '该账号还未注册，请前往注册',
      }
      return false
    } else if (mobileSigned.status === 1) {
      // 若用户状态为禁止登陆
      ctx.body = {
        code: 400,
        message: '该账号禁止登陆',
      }
    } else {
      // 若密码不正确
      if (!bcrypt.compareSync(req.pwd, mobileSigned.password)) {
        ctx.body = {
          code: 400,
          message: '密码错误',
        }
        return false
      } else {
        const userInfo = {
          id: mobileSigned.id,
          mobile: mobileSigned.mobile,
          name: mobileSigned.name,
          heading: mobileSigned.heading
        }
        const token = jwt.sign(userInfo, SECRET, {expiresIn: 60 * 60 * 6})
        ctx.body = {
          code: 200,
          message: '登录成功',
          data: {
            token
          }
        }
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 根据token获取用户信息
exports.getData = async (ctx, next) => {
  const token = ctx.header['pet-token']
  let userInfo = {}
  await jwt.verify(token, SECRET, (err, data) => {
    if (err) {
      ctx.body = {
        code: 400,
        message: '用户验证失败',
      }
    } else {
      userInfo = data
    }
  })
  ctx.body = {
    code: 200,
    data: {
      id: userInfo.id,
      mobile: userInfo.mobile,
      name: userInfo.name,
      heading: userInfo.heading
    }
  }
}

// 检验手机号是否注册 200 已注册
exports.checkMobileTrue = async (ctx, next) => {
  try {
    // 验证用户账号唯一性
    const mobileUniq = await UserModel.findOne({
      attributes: ['id'],
      where: {
        mobile: ctx.params.mobile
      }
    })
    if (mobileUniq) {
      ctx.body = {
        code: 200,
        message: 'ok'
      }
      return false
    } else {
      ctx.body = {
        code: 400,
        message: '该账号尚未注册'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 找回密码
exports.resetPassword = async (ctx, next) => {
  const req = ctx.request.body
  try {
    // 随机生成盐值
    const salt = bcrypt.genSaltSync(10)
    // 用盐值对密码加密
    const hashPassword = bcrypt.hashSync(req.pwd, salt)
    const res = await UserModel.update({
      password: hashPassword
    }, {
      where: {
        mobile: req.mobile,
      }
    })
    ctx.body = {
      code: 200,
      message: '重新设置密码成功',
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

