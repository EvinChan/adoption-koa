const router = require('koa-router')()

const {
  getDashBoardData,
  getDashBoardNoData,
  getDashBoardChart,
  getStatementChart1Data,
  getStatementChart2Data
} = require('../controllers/organization/organizationChart')

const UserModel = require('../models/UserModel')
const {SECRET} = require('../config/constants')
const jwt = require('jsonwebtoken')

router.prefix('/organizationChart')

// 首页dashboard
router.get('/getDashBoard/:id', async (ctx, next) => {
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
      let id = ctx.params.id
      const pet = await getDashBoardData('t_pet', id)
      const adoption = await getDashBoardData('t_adoption', id)
      const order = await getDashBoardData('t_order', id)
      ctx.body = {
        code: 200,
        data: {
          pet,
          adoption,
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

// 首页dashboard No
router.get('/getDashBoardNo/:id', async (ctx, next) => {
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
      let id = ctx.params.id
      const noAdoption = await getDashBoardNoData('t_adoption', id)
      const noOrder = await getDashBoardNoData('t_order', id)
      ctx.body = {
        code: 200,
        data: {
          noAdoption,
          noOrder
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
router.get('/getDashBoardChart/:id', async (ctx, next) => {
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
      let id = ctx.params.id
      const data1 = await getDashBoardChart('t_pet', id)
      const data2 = await getDashBoardChart('t_order', id)
      let dateInfo = []
      let petInfo = []
      let orderInfo = []
      for (let i = 0; i < data1.length; i++) {
        dateInfo[i] = data1[i].date
        petInfo[i] = data1[i].count
        orderInfo[i] = data2[i].count
      }
      ctx.body = {
        code: 200,
        data: {
          dateInfo,
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

// 数据报表 最近6个月的订单数
router.get('/getStatementChart1/:id', async (ctx, next) => {
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
      let id = ctx.params.id
      const data = await getStatementChart1Data(id)
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

// 数据报表 查询某月订单数量
router.get('/getStatementChart2/:id', async (ctx, next) => {
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
      let id = ctx.params.id
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
      const data = await getStatementChart2Data(id, value1)
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
