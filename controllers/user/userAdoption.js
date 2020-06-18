const UserModel = require('../../models/UserModel')
const AdoptionModel = require('../../models/AdoptionModel')
const OrderModel = require('../../models/OrderModel')
const PetModel = require('../../models/PetModel')
const PetInformationModel = require('../../models/PetInformationModel')
const CategoryModel = require('../../models/CategoryModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')

// 用户提交领养申请表
exports.createAdoption = async (ctx, next) => {
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
      const petInfo = await PetModel.findOne({
        attributes: ['orgId'],
        where: {
          id: req.petId
        }
      })
      const res = await AdoptionModel.create({
        userId: req.userId,
        petId: req.petId,
        sex: req.sex,
        age: req.age,
        mobile: req.mobile,
        isExp: req.isExp,
        housing: req.housing,
        marital: req.marital,
        profession: req.profession,
        profile: req.profile,
        status: 0,
        org: petInfo.orgId
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

// 查看领养申请表
exports.getAdoption = async (ctx, next) => {
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
      const adoptionInfo = await AdoptionModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'petId', 'status'],
        where: {
          userId: ctx.query.id
        },
        order: [
          ['id', 'desc']
        ],
        include: [
          {
            model: PetModel,
            attributes: ['name', 'sex'],
            as: 'adoptionPet',
            include: [
              {
                model: PetInformationModel,
                attributes: ['imageSrc'],
                as: 'petInformation'
              },
              {
                model: CategoryModel,
                attributes: ['name'],
                as: 'category',
              }
            ]
          },
          {
            model: OrderModel,
            attributes: ['id'],
            as: 'orderAdoption',
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

// 根据id查看某领养申请表
exports.getOneAdoption = async (ctx, next) => {
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

// 取消领养申请
exports.cancelAdoption = async (ctx, next) => {
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
      const res = await AdoptionModel.update({
        status: 3
        }, {
        where: {
          id: ctx.params.id
        }
      })
      ctx.body = {
        code: 200,
        message: '取消成功'
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
