const ProvinceModel = require('../../models/ProvinceModel')
const CityModel = require('../../models/CityModel')

// 市选择器
exports.getCityList = async (ctx, next) => {
  try {
    const cityInfo = await CityModel.findAll({
      attributes: ['code', 'name'],
      where: {
        provinceCode: ctx.query.code
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
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// address 市选择器
exports.getCityList2 = async (ctx, next) => {
  try {
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
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}
