const OrganizationModel = require('../../models/OrganizationModel')
const ProvinceModel = require('../../models/ProvinceModel')
const CityModel = require('../../models/CityModel')
const UserModel = require('../../models/UserModel')

// 查看宠物机构
exports.getOrganization = async (ctx, next) => {
  try {
    const organizationInfo = await OrganizationModel.findAll({
      attributes: ['detail'],
      order: [
        ['id', 'asc']
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
        },
        {
          model: UserModel,
          attributes: ['id', 'name'],
          as: 'organizationName',
          where: {
            status: 0,
            isOrg: 1
          }
        }
      ]
    })
    ctx.body = {
      code: 200,
      data: {
        organizationInfo
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}
