const Sequelize = require('sequelize')
const db = require('../config/db')
const ProvinceModel = require('./ProvinceModel')

const CityModel = db.define('t_city', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'city_id'
  },
  code: {
    type: Sequelize.CHAR(6),
    allowNull: false,
    unique: true,
    field: 'city_code'
  },
  name: {
    type: Sequelize.STRING(11),
    allowNull: false,
    field: 'city_name'
  },
  provinceCode: {
    type: Sequelize.STRING(6),
    allowNull: false,
    field: 'province_code'
  }
}, {
  timestamps: false,
  freezeTableName: true
})

CityModel.belongsTo(ProvinceModel, {
  // 创建外键 CityModel.provinceCode -> ProvinceModel.code
  foreignKey: 'provinceCode',
  targetKey: 'code',
  as: 'provinceCity'
})
ProvinceModel.hasMany(CityModel, {
  foreignKey: 'provinceCode',
  targetKey: 'code',
  as: 'provinceCity'
})

// 自动创建表
// CityModel.sync({force: false})

module.exports = CityModel
