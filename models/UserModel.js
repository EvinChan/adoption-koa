const Sequelize = require('sequelize')
const db = require('../config/db')
const OrganizationModel = require('../models/OrganizationModel')

const UserModel = db.define('t_user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'user_id'
  },
  mobile: {
    type: Sequelize.CHAR(11),
    allowNull: false,
    unique: true,
    field: 'user_mobile'
  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    field: 'user_password'
  },
  name: {
    type: Sequelize.STRING(20),
    allowNull: false,
    unique: true,
    field: 'user_name'
  },
  sex: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: 'user_sex'
  },
  heading: {
    type: Sequelize.STRING(200),
    allowNull: false,
    field: 'user_heading'
  },
  realName: {
    type: Sequelize.STRING(6),
    allowNull: true,
    unique: true,
    field: 'user_realName'
  },
  idcard: {
    type: Sequelize.CHAR(18),
    allowNull: true,
    unique: true,
    field: 'user_idcard'
  },
  status: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0,
    field: 'user_status'
  },
  isOrg: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0,
    field: 'is_org'
  }
}, {
  timestamps: true,
  freezeTableName: true,
  createdAt: 'gmt_create',
  updatedAt: 'gmt_modified'
})

OrganizationModel.belongsTo(UserModel, {
  // 创建外键 OrganizationModel.userId -> UserModel.id
  foreignKey: 'userId',
  as: 'organizationName'
})
UserModel.hasOne(OrganizationModel, {
  // 创建外键 OrganizationModel.userId -> UserModel.id
  foreignKey: 'userId',
  as: 'organizationName'
})

// 自动创建表
// UserModel.sync({force: false})

module.exports = UserModel
