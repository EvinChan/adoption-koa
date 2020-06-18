const UserModel = require('../../models/UserModel')
const ClassificationModel = require('../../models/ClassificationModel')
const CategoryModel = require('../../models/CategoryModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')

// id 品种选择器
exports.getCategoryList = async (ctx, next) => {
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
