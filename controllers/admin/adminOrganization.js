const AdminModel = require('../../models/AdminModel')
const UserModel = require('../../models/UserModel')
const OrganizationModel = require('../../models/OrganizationModel')
const ProvinceModel = require('../../models/ProvinceModel')
const CityModel = require('../../models/CityModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// 机构选择器
exports.getOrganizationList = async (ctx, next) => {
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
      const organizationInfo = await OrganizationModel.findAll({
        attributes: ['id', 'userId'],
        where: {
          status: 2
        },
        order: [
          ['id', 'asc']
        ],
        include: [
          {
            model: UserModel,
            attributes: ['name'],
            as: 'organizationName'
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

// 查看宠物机构
exports.getOrganization = async (ctx, next) => {
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
      let page = parseInt(ctx.params.page)
      let limit = parseInt(ctx.params.limit)
      let offset = (page - 1) * limit
      let userMobile = ctx.query.userMobile
      let userName = ctx.query.userName
      let provinceName = ctx.query.provinceName
      let status = ctx.query.status
      let time1 = ctx.query.time1
      let time2 = ctx.query.time2
      let where1 = {}
      let where2 = {}
      if (userMobile) {
        where2['mobile'] = {[Op.like]: `%${userMobile}%`}
        if (userName) {
          where2['name'] = {[Op.like]: `%${userName}%`}
        }
      } else {
        if (userName) {
          where2['name'] = {[Op.like]: `%${userName}%`}
        }
      }
      if (provinceName) {
        where1['provinceCode'] = provinceName
        if(status) {
          where1['status'] = status
        }
      } else {
        if(status) {
          where1['status'] = status
        }
      }
      if(time1 && time2) {
        time1 = time1 + ' 00:00:00'
        time2 = time2 + ' 23:59:59'
        where1['gmt_create'] = {[Op.gt]: `${time1}`, [Op.lt]: `${time2}`}
      }
      let order = []
      if (ctx.query.sort === 'asc') {
        order = [['id', 'asc']]
      } else {
        order = [['id', 'desc']]
      }
      const organizationInfo = await OrganizationModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'status', 'gmt_create', 'gmt_modified'],
        where: where1,
        order: order,
        include: [
          {
            model: UserModel,
            attributes: ['name', 'mobile'],
            where: where2,
            as: 'organizationName'
          },
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

// 根据id查看某个机构的信息
exports.getOneOrganization = async (ctx, next) => {
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
      const organizationInfo = await OrganizationModel.findOne({
        attributes: ['id', 'detail', 'desc'],
        where: {
          id: ctx.query.id
        },
        include: [
          {
            model: UserModel,
            attributes: ['name', 'mobile'],
            as: 'organizationName'
          },
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

// 修改宠物机构信息
exports.updateOrganizationInfo = async (ctx, next) => {
  const req = ctx.request.body
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
          name: req.orgProvince.name
        }
      })
      const cityInfo = await CityModel.findOne({
        attributes: ['code'],
        where: {
          name: req.orgCity.name,
          provinceCode: provinceInfo.code
        }
      })
      const res = await OrganizationModel.update({
        provinceCode: provinceInfo.code,
        cityCode: cityInfo.code,
        detail: req.detail,
        desc: req.desc
      }, {
        where: {
          id: req.id
        }
      })
      ctx.body = {
        code: 200,
        data: {},
        message: '修改信息成功'
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

// 审核宠物机构信息
exports.updateOrganization = async (ctx, next) => {
  const req = ctx.request.body
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
      const res1 = await OrganizationModel.update({
        status: req.status
      }, {
        where: {
          id: req.id
        }
      })
      if(req.status === 2) {
        const organizationInfo = await OrganizationModel.findOne({
          attributes: ['userId'],
          where: {
            id: req.id
          }
        })
        const res2 = await UserModel.update({
          isOrg: '1',
        }, {
          where: {
            id: organizationInfo.userId
          }
        })
      }
      ctx.body = {
        code: 200,
        data: {},
        message: '修改信息成功'
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
