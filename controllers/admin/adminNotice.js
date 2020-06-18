const NoticeModel = require('../../models/NoticeModel')
const AdminModel = require('../../models/AdminModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// 查看公告信息
exports.getNotice = async (ctx, next) => {
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
      let title = ctx.query.title
      let adminMobile = ctx.query.adminMobile
      let status = ctx.query.status
      let time1 = ctx.query.time1
      let time2 = ctx.query.time2
      let time3 = ctx.query.time3
      let time4 = ctx.query.time4
      let where1 = {}
      let where2 = {}
      if (title) {
        where1['title'] = {[Op.like]: `%${title}%`}
        if (status) {
          where1['status'] = status
        }
      } else {
        if (status) {
          where1['status'] = status
        }
      }
      if (adminMobile) {
        where2['mobile'] = {[Op.like]: `%${adminMobile}%`}
      }
      if(time1 && time2) {
        time1 = time1 + ' 00:00:00'
        time2 = time2 + ' 23:59:59'
        where1['gmt_create'] = {[Op.gt]: `${time1}`, [Op.lt]: `${time2}`}
      }
      if(time3 && time4) {
        time3 = time3 + ' 00:00:00'
        time4 = time4 + ' 23:59:59'
        where1['gmt_modified'] = {[Op.gt]: `${time3}`, [Op.lt]: `${time4}`}
      }
      let order = []
      if (ctx.query.sort === 'asc') {
        order = [['id', 'asc']]
      } else {
        order = [['id', 'desc']]
      }
      const noticeInfo = await NoticeModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'title', 'status', 'gmt_create', 'gmt_modified'],
        where: where1,
        order: order,
        include: [
          {
            model: AdminModel,
            attributes: ['mobile'],
            where: where2,
            as: 'noticeAdmin'
          }
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          noticeInfo
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

// 根据id查看某个公告信息
exports.getOneNotice = async (ctx, next) => {
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
      const noticeInfo = await NoticeModel.findOne({
        attributes: ['title', 'content', 'status'],
        where: {
          id: ctx.query.id
        }
      })
      ctx.body = {
        code: 200,
        data: {
          noticeInfo
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

// 修改公告信息
exports.updateNotice = async (ctx, next) => {
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
      const res = await NoticeModel.update({
        title: req.title,
        content: req.content,
        status: req.status,
      }, {
        where: {
          id: req.id
        }
      })
      ctx.body = {
        code: 200,
        message: '修改公告成功'
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

// 新增公告信息
exports.createNotice = async (ctx, next) => {
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
      const res = await NoticeModel.create({
        title: req.title,
        content: req.content,
        status: req.status,
        admin: admin.id
      })
      ctx.body = {
        code: 200,
        message: '新增公告成功'
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
