const AdminModel = require('../../models/AdminModel')
const UserModel = require('../../models/UserModel')
const AddressModel = require('../../models/AddressModel')
const ProvinceModel = require('../../models/ProvinceModel')
const CityModel = require('../../models/CityModel')
const AdoptionModel = require('../../models/AdoptionModel')
const PetModel = require('../../models/PetModel')
const OrganizationModel = require('../../models/OrganizationModel')
const CategoryModel = require('../../models/CategoryModel')
const ClassificationModel = require('../../models/ClassificationModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// 查看用户信息
exports.getUser = async (ctx, next) => {
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
      let mobile = ctx.query.mobile
      let name = ctx.query.name
      let idcard = ctx.query.idcard
      let status = ctx.query.status
      let isOrg = ctx.query.isOrg
      let time1 = ctx.query.time1
      let time2 = ctx.query.time2
      let where = {}
      if (mobile) {
        where['mobile'] = {[Op.like]: `%${mobile}%`}
        if (idcard) {
          where['idcard'] = {[Op.like]: `%${idcard}%`}
        }
      } else {
        if (idcard) {
          where['idcard'] = {[Op.like]: `%${idcard}%`}
        }
      }
      if (status) {
        where['status'] = status
        if (isOrg) {
          where['isOrg'] = isOrg
        }
      } else {
        if (isOrg) {
          where['isOrg'] = isOrg
        }
      }
      if(name) {
        where['name'] = {[Op.like]: `%${name}%`}
      }
      if(time1 && time2) {
        time1 = time1 + ' 00:00:00'
        time2 = time2 + ' 23:59:59'
        where['gmt_create'] = {[Op.gt]: `${time1}`, [Op.lt]: `${time2}`}
      }
      let order = []
      if (ctx.query.sort === 'asc') {
        order = [['id', 'asc']]
      } else {
        order = [['id', 'desc']]
      }
      const userInfo = await UserModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'mobile', 'name', 'idcard', 'sex', 'status', 'isOrg', 'gmt_create', 'gmt_modified'],
        where: where,
        order: order
      })
      ctx.body = {
        code: 200,
        data: {
          userInfo
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

// 根据id查看某个用户的信息
exports.getOneUser = async (ctx, next) => {
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
      const userInfo = await UserModel.findOne({
        attributes: ['mobile', 'name', 'idcard', 'sex', 'heading', 'status', 'isOrg'],
        where: {
          id: ctx.query.id
        }
      })
      ctx.body = {
        code: 200,
        data: {
          userInfo
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

// 修改用户信息
exports.updateUser = async (ctx, next) => {
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
      const res = await UserModel.update({
        status: req.status,
      }, {
        where: {
          id: req.id
        }
      })
      ctx.body = {
        code: 200,
        message: '修改成功'
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

// 查看地址信息
exports.getAddress = async (ctx, next) => {
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
      let addressName = ctx.query.addressName
      let addressMobile = ctx.query.addressMobile
      let provinceName = ctx.query.provinceName
      let where1 = {}
      let where2 = {}
      if (userMobile) {
        where2['mobile'] = {[Op.like]: `%${userMobile}%`}
        if(userName) {
          where2['name'] = {[Op.like]: `%${userName}%`}
        }
      } else {
        if(userName) {
          where2['name'] = {[Op.like]: `%${userName}%`}
        }
      }
      if (addressName) {
        where1['name'] = {[Op.like]: `%${addressName}%`}
        if (addressMobile) {
          where1['mobile'] = {[Op.like]: `%${addressMobile}%`}
        }
      } else {
        if (addressMobile) {
          where1['mobile'] = {[Op.like]: `%${addressMobile}%`}
        }
      }
      if (provinceName) {
        where1['provinceCode'] = {[Op.like]: `%${provinceName}%`}
      }
      let order = []
      if (ctx.query.sort === 'asc') {
        order = [['id', 'asc']]
      } else {
        order = [['id', 'desc']]
      }
      const addressInfo = await AddressModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'name', 'mobile', 'isDefault'],
        where: where1,
        order: order,
        include: [
          {
            model: UserModel,
            attributes: ['mobile', 'name'],
            where: where2,
            as: 'addressUser'
          },
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

// 根据id查看某个用户地址信息
exports.getOneAddress = async (ctx, next) => {
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
      const addressInfo = await AddressModel.findOne({
        attributes: ['name', 'mobile', 'detail'],
        where: {
          id: ctx.query.id
        },
        order: [
          ['id', 'asc']
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

// 查看领养申请表信息
exports.getAdoption = async (ctx, next) => {
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
      let petName = ctx.query.petName
      let userMobile = ctx.query.userMobile
      let status = ctx.query.status
      let orgName = ctx.query.orgName
      let where1 = {}
      let where2 = {}
      let where3 = {}
      if(petName) {
        where3['name'] = {[Op.like]: `%${petName}%`}
        if(userMobile) {
          where2['mobile'] = {[Op.like]: `%${userMobile}%`}
        }
      } else {
        if(userMobile) {
          where2['mobile'] = {[Op.like]: `%${userMobile}%`}
        }
      }
      if(status) {
        where1['status'] = status
        if(orgName) {
          where1['org'] = orgName
        }
      } else {
        if(orgName) {
          where1['org'] = orgName
        }
      }
      let order = []
      if (ctx.query.sort === 'asc') {
        order = [['id', 'asc']]
      } else {
        order = [['id', 'desc']]
      }
      const adoptionInfo = await AdoptionModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'sex', 'age', 'mobile', 'status'],
        where: where1,
        order: order,
        include: [
          {
            model: UserModel,
            attributes: ['mobile'],
            where: where2,
            as: 'adoptionUser'
          },
          {
            model: PetModel,
            attributes: ['name'],
            where: where3,
            as: 'adoptionPet'
          },
          {
            model: OrganizationModel,
            attributes: ['id'],
            as: 'adoptionOrg',
            include: [
              {
                model: UserModel,
                attributes: ['name'],
                as: 'organizationName'
              }
            ]
          }
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          adoptionInfo
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

// 根据id查看当前领养申请表的宠物信息
exports.getAdoptionPet = async (ctx, next) => {
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
      const petInfo = await AdoptionModel.findOne({
        attributes: ['petId'],
        where: {
          id: ctx.query.id
        },
        include: [
          {
            model: PetModel,
            attributes: ['name', 'sex', 'weight'],
            as: 'adoptionPet',
            include: [
              {
                model: CategoryModel,
                attributes: ['name'],
                as: 'category',
                include: [
                  {
                    model: ClassificationModel,
                    attributes: ['name'],
                    as: 'classification'
                  }
                ]
              }
            ]
          }
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          petInfo
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

// 根据id查看当前领养申请表的用户信息
exports.getAdoptionUser = async (ctx, next) => {
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
      const userInfo = await AdoptionModel.findOne({
        attributes: ['userId'],
        where: {
          id: ctx.query.id
        },
        include: [
          {
            model: UserModel,
            attributes: ['name', 'mobile', 'idcard', 'sex'],
            as: 'adoptionUser'
          }
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          userInfo
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

// 根据id查看某个领养申请表的信息
exports.getOneAdoption = async (ctx, next) => {
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
      const adoptionInfo = await AdoptionModel.findOne({
        attributes: ['sex', 'age', 'mobile', 'isExp', 'housing', 'marital', 'profession', 'profile'],
        where: {
          id: ctx.query.id
        }
      })
      ctx.body = {
        code: 200,
        data: {
          adoptionInfo
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

