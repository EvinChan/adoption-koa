const UserModel = require('../../models/UserModel')
const AdoptionModel = require('../../models/AdoptionModel')
const PetModel = require('../../models/PetModel')
const OrganizationModel = require('../../models/OrganizationModel')
const CategoryModel = require('../../models/CategoryModel')
const ClassificationModel = require('../../models/ClassificationModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// 查看领养申请表信息
exports.getAdoption = async (ctx, next) => {
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
      where1['org'] = organization.id
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

// 修改领养申请表信息
exports.updateAdoption = async (ctx, next) => {
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
      if (req.status === 2) {
        const adopInfo = await AdoptionModel.findOne({
          attributes: ['petId'],
          where: {
            id: req.id
          }
        })
        // 先设置其他领养申请表状态为审核失败
        const res2 = await AdoptionModel.update({
          status: 1
        }, {
          where: {
            petId: adopInfo.petId
          }
        })
      }
      // 再设置该申请表的状态为审核成功
      const res = await AdoptionModel.update({
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
