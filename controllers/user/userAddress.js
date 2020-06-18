const UserModel = require('../../models/UserModel')
const AddressModel = require('../../models/AddressModel')
const ProvinceModel = require('../../models/ProvinceModel')
const CityModel = require('../../models/CityModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')

// 查看用户地址
exports.getAddress = async (ctx, next) => {
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
      const addressInfo = await AddressModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'name', 'mobile', 'detail', 'isDefault'],
        where: {
          userId: ctx.query.userId
        },
        order: [
          ['id', 'desc']
        ],
        include: [
          {
            model: ProvinceModel,
            attributes: ['name'],
            as: 'addressProvince'
          },
          {
            model: CityModel,
            attributes: ['name'],
            as: 'addressCity'
          },
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          addressInfo
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

// 根据id查看某地址信息
exports.getOneAddress = async (ctx, next) => {
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
      const addressInfo = await AddressModel.findOne({
        attributes: ['name', 'mobile', 'detail'],
        where: {
          id: ctx.query.id
        },
        include: [
          {
            model: ProvinceModel,
            attributes: ['name'],
            as: 'addressProvince'
          },
          {
            model: CityModel,
            attributes: ['name'],
            as: 'addressCity'
          },
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          addressInfo
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

// 修改用户地址
exports.updateAddress = async (ctx, next) => {
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
      const provinceInfo = await ProvinceModel.findOne({
        attributes: ['code'],
        where: {
          name: req.provinceName
        }
      })
      const cityInfo = await CityModel.findOne({
        attributes: ['code'],
        where: {
          name: req.cityName,
          provinceCode: provinceInfo.code
        }
      })
      const addressInfo = await AddressModel.findOne({
        attributes: ['id'],
        where: {
          userId: req.userId,
          name: req.name,
          mobile: req.mobile,
          provinceCode: provinceInfo.code,
          cityCode: cityInfo.code,
          detail: req.detail
        }
      })
      if (addressInfo) {
        ctx.body = {
          code: 400,
          message: '该地址已存在'
        }
        return false
      }
      const res = await AddressModel.update({
        name: req.name,
        mobile: req.mobile,
        provinceCode: provinceInfo.code,
        cityCode: cityInfo.code,
        detail: req.detail,
      }, {
        where: {
          id: req.id
        }
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

// 删除用户地址
exports.deleteAddress = async (ctx, next) => {
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
      const res = await AddressModel.destroy({
        where: {
          id: ctx.params.id
        }
      })
      ctx.body = {
        code: 200,
        message: '删除成功'
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

// 设置默认地址
exports.updateDefault = async (ctx, next) => {
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
      const defaultInfo = await AddressModel.findOne({
        attributes: ['id'],
        where: {
          userId: req.userId,
          isDefault: 1
        }
      })
      if (defaultInfo) {
        const res1 = await AddressModel.update({
          isDefault: 0
        }, {
          where: {
            id: defaultInfo.id
          }
        })
      }
      const res2 = await AddressModel.update({
        isDefault: 1
      }, {
        where: {
          id: req.id
        }
      })
      ctx.body = {
        code: 200,
        message: '设置默认地址成功'
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

// 新增用户地址
exports.createAddress = async (ctx, next) => {
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
      const addressInfo = await AddressModel.findOne({
        attributes: ['id'],
        where: {
          userId: req.userId,
          name: req.name,
          mobile: req.mobile,
          provinceCode: req.provinceName,
          cityCode: req.cityName,
          detail: req.detail
        }
      })
      if (addressInfo) {
        ctx.body = {
          code: 400,
          message: '该地址已存在'
        }
        return false
      }
      const res = await AddressModel.create({
        userId: req.userId,
        name: req.name,
        mobile: req.mobile,
        provinceCode: req.provinceName,
        cityCode: req.cityName,
        detail: req.detail,
        isDefault: 0
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
