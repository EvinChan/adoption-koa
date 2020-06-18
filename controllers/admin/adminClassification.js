const AdminModel = require('../../models/AdminModel')
const ClassificationModel = require('../../models/ClassificationModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')

// 分类选择器
exports.getClassificationList = async (ctx, next) => {
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
      const classificationInfo = await ClassificationModel.findAll({
        attributes: ['id', 'name'],
        order: [
          ['id', 'asc']
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          classificationInfo
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

// 查看宠物分类
exports.getClassification = async (ctx, next) => {
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
      let name = ctx.query.name
      let where = {}
      if(name) {
        where['name'] = name
      }
      let order = []
      if (ctx.query.sort === 'desc') {
        order = [['id', 'desc']]
      } else {
        order = [['id', 'asc']]
      }
      const classificationInfo = await ClassificationModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'name'],
        order: order,
        where: where
      })
      ctx.body = {
        code: 200,
        data: {
          classificationInfo
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

// 根据id查看某个分类的信息
exports.getOneClassification = async (ctx, next) => {
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
      const classificationInfo = await ClassificationModel.findOne({
        attributes: ['name'],
        where: {
          id: ctx.query.id
        }
      })
      ctx.body = {
        code: 200,
        data: {
          classificationInfo
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

// 新增宠物分类
exports.createClassification = async (ctx, next) => {
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
      // 验证分类名唯一性
      const nameUniq = await ClassificationModel.findOne({
        attributes: ['id'],
        where: {
          name: req.name
        }
      })
      if (nameUniq) {
        ctx.body = {
          code: 400,
          message: '该分类已存在',
          data: {}
        }
        return false
      }
      const res = await ClassificationModel.create({
        name: req.name
      })
      ctx.body = {
        code: 200,
        message: '新增分类成功'
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

// 修改宠物分类
exports.updateClassification = async (ctx, next) => {
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
      // 验证分类名唯一性
      const nameUniq = await ClassificationModel.findOne({
        attributes: ['id'],
        where: {
          name: req.name
        }
      })
      if (nameUniq) {
        ctx.body = {
          code: 400,
          message: '该分类已存在',
          data: {}
        }
        return false
      }
      const res = await ClassificationModel.update({
        name: req.name
      }, {
        where: {
          id: req.id
        }
      })
      ctx.body = {
        code: 200,
        message: '修改分类成功'
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
