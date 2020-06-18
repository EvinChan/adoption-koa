const UserModel = require('../../models/UserModel')
const ClassificationModel = require('../../models/ClassificationModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')

// 分类选择器
exports.getClassificationList = async (ctx, next) => {
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
