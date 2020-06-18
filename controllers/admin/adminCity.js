const AdminModel = require('../../models/AdminModel')
const ProvinceModel = require('../../models/ProvinceModel')
const CityModel = require('../../models/CityModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')

// name 市选择器
exports.getCityList = async (ctx, next) => {
  const token = ctx.header['admin-token']
  const adminInfo = jwt.verify(token, SECRET)
  try {
    const admin = await AdminModel.findOne({
      attributes: ['id'],
      where: {
        mobile: adminInfo.mobile
      }
    })
    if (admin) {
      const provinceInfo = await ProvinceModel.findOne({
        attributes: ['code'],
        where: {
          name: ctx.query.name
        }
      })
      const cityInfo = await CityModel.findAll({
        attributes: ['code', 'name'],
        where: {
          provinceCode: provinceInfo.code
        },
        order: [
          ['code', 'asc']
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          cityInfo
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
