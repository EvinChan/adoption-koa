const ProvinceModel = require('../../models/ProvinceModel')

// 省份选择器
exports.getProvinceList = async (ctx, next) => {
  try {
    const ProvinceInfo = await ProvinceModel.findAll({
      attributes: ['code', 'name'],
      order: [
        ['code', 'asc']
      ]
    })
    ctx.body = {
      code: 200,
      data: {
        ProvinceInfo
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}
