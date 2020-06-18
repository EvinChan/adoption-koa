const UserModel = require('../../models/UserModel')
const OrganizationModel = require('../../models/OrganizationModel')
const ProvinceModel = require('../../models/ProvinceModel')
const CityModel = require('../../models/CityModel')
const jwt = require('jsonwebtoken')
// bcrypt 第三方密码加密库
const bcrypt = require('bcryptjs')
const {SECRET} = require('../../config/constants')

// 机构登录
exports.login = async (ctx, next) => {
  const req = ctx.request.body
  try {
    const mobileSigned = await UserModel.findOne({
      attributes: ['id', 'password', 'mobile', 'name', 'heading', 'status'],
      where: {
        mobile: req.mobile,
        isOrg: 1
      }
    })
    // 若账号不存在
    if (!mobileSigned) {
      ctx.body = {
        code: 400,
        message: '该账号不存在'
      }
      return false
    } else if (mobileSigned.status === 1) {
      // 若机构状态为禁止登陆
      ctx.body = {
        code: 400,
        message: '该账号禁止登陆',
        data: {}
      }
    } else {
      // 若密码不正确
      if (!bcrypt.compareSync(req.password, mobileSigned.password)) {
        ctx.body = {
          code: 400,
          message: '密码错误'
        }
        return false
      } else {
        const organizationInfo = {
          id: mobileSigned.id,
          mobile: mobileSigned.mobile,
          name: mobileSigned.name,
          heading: mobileSigned.heading
        }
        const token = jwt.sign(organizationInfo, SECRET, {expiresIn:  60 * 60 * 6})
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

// 根据token获取机构信息
exports.getData = async (ctx, next) => {
  const token = ctx.header['org-token']
  let organizationInfo = {}
  await jwt.verify(token, SECRET, (err, data) => {
    if (err) {
      ctx.body = {
        code: 400,
        message: '用户验证失败',
        data: {}
      }
    } else {
      organizationInfo = data
    }
  })
  ctx.body = {
    code: 200,
    data: {
      id: organizationInfo.id,
      mobile: organizationInfo.mobile,
      name: organizationInfo.name,
      heading: organizationInfo.heading
    }
  }
}

// 查看机构个人信息
exports.getOneOrganization = async (ctx, next) => {
  const token = ctx.header['org-token']
  const organizationInfo = jwt.verify(token, SECRET)
  try {
    const user = await UserModel.findOne({
      attributes: ['id'],
      where: {
        mobile: organizationInfo.mobile,
        isOrg: 1
      }
    })
    if (user) {
      const organization = await OrganizationModel.findOne({
        attributes: ['provinceCode', 'cityCode', 'detail', 'desc'],
        where: {
          userId: user.id
        },
        include: [
          {
            model: ProvinceModel,
            attributes: ['name'],
            as: 'orgProvince'
          },
          {
            model: CityModel,
            attributes: ['name'],
            as: 'orgCity'
          }
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          organization
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

