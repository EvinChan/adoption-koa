const UserModel = require('../../models/UserModel')
const AdoptionModel = require('../../models/AdoptionModel')
const OrderModel = require('../../models/OrderModel')
const PetModel = require('../../models/PetModel')
const PetInformationModel = require('../../models/PetInformationModel')
const ProvinceModel = require('../../models/ProvinceModel')
const CityModel = require('../../models/CityModel')
const CategoryModel = require('../../models/CategoryModel')
const AddressModel = require('../../models/AddressModel')
const RevisitModel = require('../../models/RevisitModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// 提交订单时的宠物信息
exports.getOrderPet = async (ctx, next) => {
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
        attributes: ['petId'],
        where: {
          id: ctx.query.adopId
        },
      })
      const petInfo = await PetModel.findAll({
        attributes: ['id', 'name', 'sex', 'age', 'weight', 'province'],
        where: {
          id: adoptionInfo.petId
        },
        include: [
          {
            model: PetInformationModel,
            attributes: ['imageSrc'],
            as: 'petInformation',
          },
          {
            model: CategoryModel,
            attributes: ['name'],
            as: 'category',
          },
          {
            model: ProvinceModel,
            attributes: ['name'],
            as: 'provinceName'
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

// 提交订单时的地址信息
exports.getOrderAddress = async (ctx, next) => {
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
      let addressInfo = await AddressModel.findOne({
        attributes: ['name', 'mobile', 'detail'],
        where: {
          userId: user.id,
          isDefault: 1
        },
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
      if (!addressInfo) {
        addressInfo = {
          name: '',
          mobile: '',
          detail: '',
          addressProvince: {
            name: ''
          },
          addressCity: {
            name: ''
          }
        }
      }
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

// 提交订单时查找该订单是否已经生成
exports.selectOrder = async (ctx, next) => {
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
      const orderInfo = await OrderModel.findOne({
        attributes: ['id'],
        where: {
          adopId: ctx.query.id
        }
      })
      ctx.body = {
        code: 200,
        data: {
          orderInfo
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

// 用户提交订单
exports.createOrder = async (ctx, next) => {
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
      const adoptionInfo = await AdoptionModel.findOne({
        attributes: ['userId', 'petId'],
        where: {
          id: req.adopId
        }
      })
      const addressInfo = await AddressModel.findOne({
        attributes: ['id'],
        where: {
          userId: adoptionInfo.userId,
          isDefault: 1
        }
      })

      // 获取当前日期yyyy-MM-dd
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentDate = year + month + strDate;
      // console.log(currentDate);
      // 查询订单表中是否有当前日期的订单
      const orderInfo = await OrderModel.findAll({
        attributes: ['id'],
        where: {
          id: {[Op.like]: `%${currentDate}%`}
          // id: {[Op.like]: `%20200227%`}
        },
        order: [
          ['id', 'desc']
        ],
      })
      // console.log(orderInfo);
      let orderId = ''
      if (orderInfo.length !== 0) {
        // 获取最大订单id的后5位
        let t1 = orderInfo[0].id.substr(8, 5)
        // 转换为Number后自增一位
        let t2 = Number(t1) + 1
        // 转换为String后未满5位前面填充0
        let t3 = t2.toString().padStart(5, '0')
        // 最后拼接成新的订单号
        // orderId = '20200227' + t3
        orderId = currentDate + t3
      } else {
        // 无当前日期订单
        orderId = currentDate + '00001'
      }
      // console.log(orderId);

      // 生成订单
      const res1 = await OrderModel.create({
        id: orderId,
        adopId: req.adopId,
        userId: adoptionInfo.userId,
        petId: adoptionInfo.petId,
        addressId: addressInfo.id,
        shipping: req.shipping,
        freight: req.freight,
        remark: req.remark,
        status: req.status,
        gmtCreate: new Date()
      })
      // 设置宠物状态为已领养
      const res2 = await PetModel.update({
        status: 2
      }, {
        where: {
          id: adoptionInfo.petId
        }
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
  } catch
    (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 支付订单
exports.payOrder = async (ctx, next) => {
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
      const res = await OrderModel.update({
        status: 1
      }, {
        where: {
          adopId: ctx.params.adopId
        }
      })
      ctx.body = {
        code: 200,
        message: '支付成功'
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

// 查看用户订单
exports.getOrder = async (ctx, next) => {
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
      let id = ctx.query.id
      let init = ctx.query.init
      let where1 = {}
      if (id) {
        where1['userId'] = id
      }
      if (init === '1') {
        where1['status'] = 0
      } else if (init === '2') {
        where1['status'] = 1
      } else if (init === '3') {
        where1['status'] = 2
      }
      const orderInfo = await OrderModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'adopId', 'petId', 'shipping', 'freight', 'remark', 'gmt_create', 'status'],
        where: where1,
        order: [
          ['id', 'desc']
        ],
        include: [
          {
            model: PetModel,
            attributes: ['name', 'sex'],
            as: 'orderPet',
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
          }
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          orderInfo
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

// 根据id查看某订单
exports.getOneOrder = async (ctx, next) => {
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
      const orderInfo = await OrderModel.findOne({
        attributes: ['id'],
        where: {
          id: ctx.query.id
        },
        include: [
          {
            model: AddressModel,
            attributes: ['name', 'mobile', 'detail'],
            as: 'orderAddress',
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
          }
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          orderInfo
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

// 取消订单
exports.cancelOrder = async (ctx, next) => {
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
      const res = await OrderModel.update({
        status: 3,
        gmtTransaction: new Date()
      }, {
        where: {
          id: ctx.params.id
        }
      })
      ctx.body = {
        code: 200,
        message: '取消订单成功'
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

// 确认收货
exports.confirmOrder = async (ctx, next) => {
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
      const res = await OrderModel.update({
        status: 3,
        gmtTransaction: new Date()
      }, {
        where: {
          id: ctx.params.id
        }
      })
      ctx.body = {
        code: 200,
        message: '确认收货成功'
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

// 发布宠物回访
exports.createRevisit = async (ctx, next) => {
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
      const petInfo = await OrderModel.findOne({
        attributes: ['petId'],
        where: {
          id: req.orderId
        }
      })
      const res = await RevisitModel.create({
        content: req.content,
        orderId: req.orderId,
        userId: req.userId,
        petId: petInfo.petId,
        gmtCreate: new Date(),
        status: 0,
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
