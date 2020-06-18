const Sequelize = require('sequelize')
const db = require('../config/db')

const ProvinceModel = db.define('t_province', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'province_id'
  },
  code: {
    type: Sequelize.CHAR(6),
    allowNull: false,
    unique: true,
    field: 'province_code'
  },
  name: {
    type: Sequelize.STRING(8),
    allowNull: false,
    field: 'province_name'
  }
}, {
  timestamps: false,
  freezeTableName: true
})

// 自动创建表
// ProvinceModel.sync({force: false})

module.exports = ProvinceModel
