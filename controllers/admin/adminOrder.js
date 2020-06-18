const OrderModel = require('../../models/OrderModel')
const AdminModel = require('../../models/AdminModel')
const UserModel = require('../../models/UserModel')
const PetModel = require('../../models/PetModel')
const AddressModel = require('../../models/AddressModel')
const ProvinceModel = require('../../models/ProvinceModel')
const CityModel = require('../../models/CityModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// 查看订单信息
exports.getOrder = async (ctx, next) => {
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
      let petName = ctx.query.petName
      let orderName = ctx.query.orderName
      let orderMobile = ctx.query.orderMobile
      let status = ctx.query.status
      let time1 = ctx.query.time1
      let time2 = ctx.query.time2
      let time3 = ctx.query.time3
      let time4 = ctx.query.time4
      let where1 = {}
      let where2 = {}
      let where3 = {}
      let where4 = {}
      if (userMobile) {
        where2['mobile'] = {[Op.like]: `%${userMobile}%`}
        if (petName) {
          where3['name'] = {[Op.like]: `%${petName}%`}
        }
      } else {
        if (petName) {
          where3['name'] = {[Op.like]: `%${petName}%`}
        }
      }
      if (orderName) {
        where4['name'] = {[Op.like]: `%${orderName}%`}
        if (orderMobile) {
          where4['mobile'] = {[Op.like]: `%${orderMobile}%`}
        }
      } else {
        if (orderMobile) {
          where4['mobile'] = {[Op.like]: `%${orderMobile}%`}
        }
      }
      if (status) {
        where1['status'] = status
      }
      if(time1 && time2) {
        time1 = time1 + ' 00:00:00'
        time2 = time2 + ' 23:59:59'
        where1['gmt_create'] = {[Op.gt]: `${time1}`, [Op.lt]: `${time2}`}
      }
      if(time3 && time4) {
        time3 = time3 + ' 00:00:00'
        time4 = time4 + ' 23:59:59'
        where1['gmt_transaction'] = {[Op.gt]: `${time3}`, [Op.lt]: `${time4}`}
      }
      let order = []
      if (ctx.query.sort === 'asc') {
        order = [['id', 'asc']]
      } else {
        order = [['id', 'desc']]
      }
      const orderInfo = await OrderModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'adopId', 'shipping', 'status', 'gmt_create', 'gmt_transaction'],
        where: where1,
        order: order,
        include: [
          {
            model: UserModel,
            attributes: ['mobile'],
            where: where2,
            as: 'orderUser'
          },
          {
            model: PetModel,
            attributes: ['name'],
            where: where3,
            as: 'orderPet'
          },
          {
            model: AddressModel,
            attributes: ['name', 'mobile'],
            where: where4,
            as: 'orderAddress'
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

// 根据id查看某个订单信息并修改
exports.getOneOrder = async (ctx, next) => {
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
      const orderInfo = await OrderModel.findOne({
        attributes: ['shipping', 'freight', 'remark'],
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
                as: 'addressProvince',
              },
              {
                model: CityModel,
                attributes: ['name'],
                as: 'addressCity',
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

