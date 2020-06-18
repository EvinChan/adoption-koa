const AdminModel = require('../../models/AdminModel')
const ProvinceModel = require('../../models/ProvinceModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')

// 省份选择器
exports.getProvinceList = async (ctx, next) => {
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
      const provinceInfo = await ProvinceModel.findAll({
        attributes: ['code', 'name'],
        order: [
          ['code', 'asc']
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          provinceInfo
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
