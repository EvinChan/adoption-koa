const AdminModel = require('../../models/AdminModel')
const CategoryModel = require('../../models/CategoryModel')
const ClassificationModel = require('../../models/ClassificationModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')

// id 品种选择器
exports.getCategoryList = async (ctx, next) => {
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
      const categoryInfo = await CategoryModel.findAll({
        attributes: ['id', 'name'],
        where: {
          classifId: ctx.query.id
        },
        order: [
          ['id', 'asc']
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          categoryInfo
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

// name 品种选择器
exports.getCategoryList2 = async (ctx, next) => {
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
        attributes: ['id'],
        where: {
          name: ctx.query.id
        }
      })
      const categoryInfo = await CategoryModel.findAll({
        attributes: ['id', 'name'],
        where: {
          classifId: classificationInfo.id
        },
        order: [
          ['id', 'asc']
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          categoryInfo
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

// 查看宠物品种
exports.getCategory = async (ctx, next) => {
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
      let categoryName = ctx.query.categoryName
      let classificationName = ctx.query.classificationName
      let where = {}
      if (classificationName) {
        where['classifId'] = classificationName
        if (categoryName) {
          where['id'] = categoryName
        }
      } else {
        if (categoryName) {
          where['id'] = categoryName
        }
      }
      let order = []
      if (ctx.query.sort === 'desc') {
        order = [['id', 'desc']]
      } else {
        order = [['id', 'asc']]
      }
      const categoryInfo = await CategoryModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'name'],
        where: where,
        order: order,
        include: [
          {
            model: ClassificationModel,
            attributes: ['name'],
            as: 'classification'
          }
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          categoryInfo
        }
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

// 根据id查看某个品种的信息
exports.getOneCategory = async (ctx, next) => {
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
      const categoryInfo = await CategoryModel.findOne({
        attributes: ['name'],
        where: {
          id: ctx.query.id
        },
        include: [
          {
            model: ClassificationModel,
            attributes: ['name'],
            as: 'classification',
          }
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          categoryInfo
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

// 新增宠物品种
exports.createCategory = async (ctx, next) => {
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
      const classificationInfo = await ClassificationModel.findOne({
        attributes: ['id'],
        where: {
          name: req.classificationName
        }
      })
      // 验证品种名唯一性
      const nameUniq = await CategoryModel.findOne({
        attributes: ['id'],
        where: {
          name: req.name,
          classifId: classificationInfo.id
        }
      })
      if (nameUniq) {
        ctx.body = {
          code: 400,
          message: '该品种已存在',
          data: {}
        }
        return false
      }
      const res = await CategoryModel.create({
        name: req.name,
        classifId: classificationInfo.id
      })
      ctx.body = {
        code: 200,
        message: '新增品种成功'
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

// 修改宠物品种
exports.updateCategory = async (ctx, next) => {
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
      const classificationInfo = await ClassificationModel.findOne({
        attributes: ['id'],
        where: {
          name: req.classification.name
        }
      })
      // 验证品种名唯一性
      const nameUniq = await CategoryModel.findOne({
        attributes: ['id'],
        where: {
          name: req.name,
          classifId: classificationInfo.id
        }
      })
      if (nameUniq) {
        ctx.body = {
          code: 400,
          message: '该品种已存在',
          data: {}
        }
        return false
      }
      const res = await CategoryModel.update({
        name: req.name,
        classifId: classificationInfo.id
      }, {
        where: {
          id: req.id
        }
      })
      ctx.body = {
        code: 200,
        message: '修改品种成功'
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
