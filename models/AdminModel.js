const Sequelize = require('sequelize')
const db = require('../config/db')

const AdminModel = db.define('t_admin', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'admin_id'
  },
  mobile: {
    type: Sequelize.CHAR(11),
    allowNull: false,
    unique: true,
    field: 'admin_mobile'
  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    field: 'admin_password'
  },
  heading: {
    type: Sequelize.STRING(200),
    allowNull: false,
    field: 'admin_heading'
  }
}, {
  timestamps: true,
  freezeTableName: true,
  createdAt: 'gmt_create',
  updatedAt: 'gmt_modified'
})

// 自动创建表
// AdminModel.sync({force: false})

module.exports = AdminModel
