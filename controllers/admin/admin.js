const AdminModel = require('../../models/AdminModel')
const jwt = require('jsonwebtoken')
// bcrypt 第三方密码加密库
const bcrypt = require('bcryptjs')
const {SECRET} = require('../../config/constants')

// 管理员注册
exports.register = async (ctx, next) => {
  const req = ctx.request.body
  try {
    // 验证用户账号唯一性
    const mobileUniq = await AdminModel.findOne({
      attributes: ['id'],
      where: {
        mobile: req.mobile
      }
    })
    if (mobileUniq) {
      ctx.body = {
        code: 400,
        message: '该账号已被注册',
        data: {}
      }
      return false
    }
    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(req.password, salt)
    const res = await AdminModel.create({
      mobile: req.mobile,
      password: hashPassword,
      heading: 'http://localhost:5000/system/管理员1.png'
    })
    ctx.body = {
      code: 200,
      message: '注册成功',
      data: {}
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 管理员登录
exports.login = async (ctx, next) => {
  const req = ctx.request.body
  try {
    const mobileSigned = await AdminModel.findOne({
      where: {
        mobile: req.mobile
      }
    })
    // 若账号不存在
    if (!mobileSigned) {
      ctx.body = {
        code: 400,
        message: '该账号不存在'
      }
      return false
    } else {
      // 若密码不正确
      if (!bcrypt.compareSync(req.password, mobileSigned.password)) {
        ctx.body = {
          code: 400,
          message: '密码错误'
        }
        return false
      } else {
        const adminInfo = {
          id: mobileSigned.id,
          mobile: mobileSigned.mobile,
          heading: mobileSigned.heading
        }
        const token = jwt.sign(adminInfo, SECRET, {expiresIn: 60 * 60 * 6})
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

// 根据token获取管理员信息
exports.getData = async (ctx, next) => {
  const token = ctx.header['admin-token']
  let adminInfo = {}
  await jwt.verify(token, SECRET, (err, data) => {
    if (err) {
      ctx.body = {
        code: 400,
        message: '用户验证失败',
        data: {}
      }
    } else {
      adminInfo = data
    }
  })
  ctx.body = {
    code: 200,
    data: {
      id: adminInfo.id,
      mobile: adminInfo.mobile,
      heading: adminInfo.heading
    }
  }
}
