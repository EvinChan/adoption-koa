const NoticeModel = require('../../models/NoticeModel')

// 查看公告信息
exports.getNotice = async (ctx, next) => {
  try {
    const noticeInfo = await NoticeModel.findAll({
      attributes: ['id', 'title', 'gmt_create'],
      where: {
        status: 0
      },
      order: [
        ['id', 'desc']
      ]
    })
    ctx.body = {
      code: 200,
      data: {
        noticeInfo
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 查看某个系统公告
exports.getNoticeDetail = async (ctx, next) => {
  try {
    const noticeInfo = await NoticeModel.findAll({
      attributes: ['title', 'content'],
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
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}
