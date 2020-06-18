const UserModel = require('../../models/UserModel')
const OrganizationModel = require('../../models/OrganizationModel')
const RevisitModel = require('../../models/RevisitModel')
const PetModel = require('../../models/PetModel')
const OrderModel = require('../../models/OrderModel')
const CategoryModel = require('../../models/CategoryModel')
const ClassificationModel = require('../../models/ClassificationModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// 查看回访信息
exports.getRevisit = async (ctx, next) => {
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
        attributes: ['id'],
        where: {
          userId: user.id
        }
      })
      let page = parseInt(ctx.params.page)
      let limit = parseInt(ctx.params.limit)
      let offset = (page - 1) * limit
      let petName = ctx.query.petName
      let userMobile = ctx.query.userMobile
      let status = ctx.query.status
      let where1 = {}
      let where2 = {}
      let where3 = {}
      where3['orgId'] = organization.id
      if (petName) {
        where3['name'] = {[Op.like]: `%${petName}%`}
        if (userMobile) {
          where2['mobile'] = {[Op.like]: `%${userMobile}%`}
        }
      } else {
        if (userMobile) {
          where2['mobile'] = {[Op.like]: `%${userMobile}%`}
        }
      }
      if (status) {
        where1['status'] = status
      }
      let order = []
      if (ctx.query.sort === 'asc') {
        order = [['id', 'asc']]
      } else {
        order = [['id', 'desc']]
      }
      const revisitInfo = await RevisitModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'orderId', 'gmt_create', 'status'],
        where: where1,
        order: order,
        include: [
          {
            model: UserModel,
            attributes: ['mobile'],
            where: where2,
            as: 'revisitUser'
          },
          {
            model: PetModel,
            attributes: ['name'],
            where: where3,
            as: 'revisitPet'
          },
          {
            model: OrderModel,
            attributes: ['id'],
            as: 'revisitOrder'
          }
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          revisitInfo
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
      message: e
    }
  }
}

// 根据id查看当前回访的用户信息
exports.getRevisitUser = async (ctx, next) => {
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
      const userInfo = await RevisitModel.findOne({
        attributes: ['userId'],
        where: {
          id: ctx.query.id
        },
        include: [
          {
            model: UserModel,
            attributes: ['name', 'mobile', 'idcard', 'sex'],
            as: 'revisitUser'
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

// 根据id查看当前回访的宠物信息
exports.getRevisitPet = async (ctx, next) => {
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
      const petInfo = await RevisitModel.findOne({
        attributes: ['petId'],
        where: {
          id: ctx.query.id
        },
        include: [
          {
            model: PetModel,
            attributes: ['name', 'sex', 'weight'],
            as: 'revisitPet',
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

// 根据id查看某个回访的信息
exports.getOneRevisit = async (ctx, next) => {
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
      const revisitInfo = await RevisitModel.findOne({
        attributes: ['id', 'content'],
        where: {
          id: ctx.query.id
        }
      })
      ctx.body = {
        code: 200,
        data: {
          revisitInfo
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

// 修改回访信息
exports.updateRevisit = async (ctx, next) => {
  const req = ctx.request.body
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
      const res = await RevisitModel.update({
        status: req.status
      }, {
        where: {
          id: req.id
        }
      })
      ctx.body = {
        code: 200,
        data: {},
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
