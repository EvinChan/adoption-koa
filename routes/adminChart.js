const router = require('koa-router')()

const {
  getDashBoardData,
  getDashBoardChart,
  getStatementChart1Data,
  getStatementChart2Data
} = require('../controllers/admin/adminChart')

const AdminModel = require('../models/AdminModel')
const {SECRET} = require('../config/constants')
const jwt = require('jsonwebtoken')

router.prefix('/adminChart')

// 首页dashboard
router.get('/getDashBoard', async (ctx, next) => {
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
      const user = await getDashBoardData('t_user')
      const organization = await getDashBoardData('t_organization')
      const pet = await getDashBoardData('t_pet')
      const order = await getDashBoardData('t_order')
      ctx.body = {
        code: 200,
        data: {
          user,
          organization,
          pet,
          order
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
})

// 首页chart
router.get('/getDashBoardChart', async (ctx, next) => {
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
      const data1 = await getDashBoardChart('t_user')
      const data2 = await getDashBoardChart('t_organization')
      const data3 = await getDashBoardChart('t_pet')
      const data4 = await getDashBoardChart('t_order')
      let dateInfo = []
      let userInfo = []
      let organizationInfo = []
      let petInfo = []
      let orderInfo = []
      for (let i = 0; i < data1.length; i++) {
        dateInfo[i] = data1[i].date
        userInfo[i] = data1[i].count
        organizationInfo[i] = data2[i].count
        petInfo[i] = data3[i].count
        orderInfo[i] = data4[i].count
      }
      ctx.body = {
        code: 200,
        data: {
          dateInfo,
          userInfo,
          organizationInfo,
          petInfo,
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
})

// 数据报表 查询某月宠物新增数量
router.get('/getStatementChart1', async (ctx, next) => {
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
      let value1 = ctx.query.value1
      // value1为空时获取当前月查询
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (!value1) {
        value1 = year + '-' + month
      }
      const data = await getStatementChart1Data(value1)
      let dateInfo = []
      let petInfo = []
      for (let i = 0; i < data.length; i++) {
        dateInfo[i] = data[i].date
        petInfo[i] = data[i].count
      }
      ctx.body = {
        code: 200,
        data: {
          dateInfo,
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
})

// 数据报表 查询某月订单数量
router.get('/getStatementChart2', async (ctx, next) => {
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
      let value2 = ctx.query.value2
      // value1为空时获取当前月查询
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (!value2) {
        value2 = year + '-' + month
      }
      const data = await getStatementChart2Data(value2)
      let dateInfo = []
      let orderInfo = []
      for (let i = 0; i < data.length; i++) {
        dateInfo[i] = data[i].date
        orderInfo[i] = data[i].count
      }
      ctx.body = {
        code: 200,
        data: {
          dateInfo,
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
})

module.exports = router
