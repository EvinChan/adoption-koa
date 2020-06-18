const UserModel = require('../../models/UserModel')
const OrganizationModel = require('../../models/OrganizationModel')
const ProvinceModel = require('../../models/ProvinceModel')
const CityModel = require('../../models/CityModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')

// 是否显示 申请为机构 超链接
exports.getHeaderOrganization = async (ctx, next) => {
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
      const organizationInfo = await OrganizationModel.findOne({
        attributes: ['id'],
        where: {
          userId: userMobile.id,
          status: [0, 2]
        }
      })
      ctx.body = {
        code: 200,
        data: {
          organizationInfo
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

// 用户提交机构申请表
exports.createOrganization = async (ctx, next) => {
  const req = ctx.request.body
  const token = ctx.header['pet-token']
  const userInfo = jwt.verify(token, SECRET)
  try {
    const user = await UserModel.findOne({
      attributes: ['id'],
      where: {
        mobile: userInfo.mobile
      }
    })
    if (user) {
      const res = await OrganizationModel.create({
        userId: req.userId,
        provinceCode: req.provinceName,
        cityCode: req.cityName,
        detail: req.detail,
        desc: req.desc,
        status: 0,
      })
      ctx.body = {
        code: 200,
        message: '提交成功'
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

// 查看机构申请表
exports.getOrganization = async (ctx, next) => {
  const token = ctx.header['pet-token']
  const userInfo = jwt.verify(token, SECRET)
  try {
    const user = await UserModel.findOne({
      attributes: ['id'],
      where: {
        mobile: userInfo.mobile
      }
    })
    if (user) {
      let page = parseInt(ctx.params.page)
      let limit = parseInt(ctx.params.limit)
      let offset = (page - 1) * limit
      const organizationInfo = await OrganizationModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'detail', 'status'],
        where: {
          userId: ctx.query.id
        },
        order: [
          ['id', 'desc']
        ],
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
          organizationInfo
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

// 根据id查看某机构申请表
exports.getOneOrganization = async (ctx, next) => {
  const token = ctx.header['pet-token']
  const userInfo = jwt.verify(token, SECRET)
  try {
    const user = await UserModel.findOne({
      attributes: ['id'],
      where: {
        mobile: userInfo.mobile
      }
    })
    if (user) {
      const organizationInfo = await OrganizationModel.findOne({
        attributes: ['detail', 'desc'],
        where: {
          id: ctx.query.id
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
          organizationInfo
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

// 取消机构申请表
exports.cancelOrganization = async (ctx, next) => {
  const token = ctx.header['pet-token']
  const userInfo = jwt.verify(token, SECRET)
  try {
    const user = await UserModel.findOne({
      attributes: ['id'],
      where: {
        mobile: userInfo.mobile
      }
    })
    if (user) {
      const res = await OrganizationModel.update({
        status: 3
      }, {
        where: {
          id: ctx.params.id
        }
      })
      ctx.body = {
        code: 200,
        message: '取消成功'
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

// 富文本图片上传
exports.tinymceUpload = async (ctx,next) => {
  ctx.body = {
    code: 200,
    message: '图片上传成功'
  }
}
