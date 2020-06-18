const Sequelize = require('sequelize')
const db = require('../config/db')
const PetModel = require('./PetModel')
const ProvinceModel = require('./ProvinceModel')
const CityModel = require('./CityModel')

const OrganizationModel = db.define('t_organization', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'org_id'
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    field: 'user_id'
  },
  provinceCode: {
    type: Sequelize.STRING(6),
    allowNull: false,
    field: 'province_code'
  },
  cityCode: {
    type: Sequelize.STRING(6),
    allowNull: false,
    field: 'city_code'
  },
  detail: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: 'org_detail'
  },
  desc: {
    type: Sequelize.TEXT,
    allowNull: false,
    field: 'org_desc'
  },
  status: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0,
    field: 'org_status'
  },
}, {
  timestamps: true,
  freezeTableName: true,
  createdAt: 'gmt_create',
  updatedAt: 'gmt_modified'
})

PetModel.belongsTo(OrganizationModel, {
  foreignKey: 'orgId',
  as: 'organization'
})
OrganizationModel.hasMany(PetModel, {
  foreignKey: 'orgId',
  as: 'organization'
})

OrganizationModel.belongsTo(ProvinceModel, {
  // 创建外键 OrganizationModel.provinceCode -> ProvinceModel.code
  foreignKey: 'provinceCode',
  targetKey: 'code',
  as: 'orgProvince'
})
ProvinceModel.hasMany(OrganizationModel, {
  foreignKey: 'provinceCode',
  targetKey: 'code',
  as: 'orgProvince'
})

OrganizationModel.belongsTo(CityModel, {
  // 创建外键 OrganizationModel.cityCode -> ProvinceModel.code
  foreignKey: 'cityCode',
  targetKey: 'code',
  as: 'orgCity'
})
CityModel.hasMany(OrganizationModel, {
  foreignKey: 'cityCode',
  targetKey: 'code',
  as: 'orgCity'
})

// 自动创建表
// OrganizationModel.sync({force: false})

module.exports = OrganizationModel
