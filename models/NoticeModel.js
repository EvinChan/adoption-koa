const Sequelize = require('sequelize')
const db = require('../config/db')
const AdminModel = require('../models/AdminModel')

const NoticeModel = db.define('t_notice', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'notice_id'
  },
  title: {
    type: Sequelize.STRING(50),
    allowNull: false,
    field: 'notice_title'
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    field: 'notice_content'
  },
  admin: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'notice_admin'
  },
  status: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: 'notice_status'
  },
}, {
  timestamps: true,
  freezeTableName: true,
  createdAt: 'gmt_create',
  updatedAt: 'gmt_modified'
})

NoticeModel.belongsTo(AdminModel, {
  // 创建外键 NoticeModel.admin -> AdminModel.id
  foreignKey: 'admin',
  as: 'noticeAdmin'
})
AdminModel.hasMany(NoticeModel, {
  // 创建外键 NoticeModel.admin -> AdminModel.id
  foreignKey: 'admin',
  as: 'noticeAdmin'
})

// 自动创建表
// NoticeModel.sync({force: false})

module.exports = NoticeModel
