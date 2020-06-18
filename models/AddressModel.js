const Sequelize = require('sequelize')
const db = require('../config/db')
const UserModel = require('../models/UserModel')
const ProvinceModel = require('../models/ProvinceModel')
const CityModel = require('../models/CityModel')

const AddressModel = db.define('t_address', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'address_id'
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  name: {
    type: Sequelize.STRING(20),
    allowNull: false,
    field: 'address_name'
  },
  mobile: {
    type: Sequelize.CHAR(11),
    allowNull: false,
    field: 'address_mobile'
  },
  provinceCode: {
    type: Sequelize.CHAR(6),
    allowNull: false,
    field: 'province_code'
  },
  cityCode: {
    type: Sequelize.CHAR(6),
    allowNull: false,
    field: 'city_code'
  },
  detail: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: 'address_detail'
  },
  isDefault: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: 'is_default'
  }
}, {
  timestamps: false,
  freezeTableName: true
})

AddressModel.belongsTo(UserModel, {
  // 创建外键 AddressModel.userId -> UserModel.id
  foreignKey: 'userId',
  as: 'addressUser'
})
UserModel.hasMany(AddressModel, {
  // 创建外键 AddressModel.userId -> UserModel.id
  foreignKey: 'userId',
  as: 'addressUser'
})

AddressModel.belongsTo(ProvinceModel, {
  // 创建外键 AddressModel.provinceCode -> ProvinceModel.code
  foreignKey: 'provinceCode',
  targetKey: 'code',
  as: 'addressProvince'
})
ProvinceModel.hasMany(AddressModel, {
  foreignKey: 'provinceCode',
  targetKey: 'code',
  as: 'addressProvince'
})

AddressModel.belongsTo(CityModel, {
  // 创建外键 AddressModel.cityCode -> CityModel.code
  foreignKey: 'cityCode',
  targetKey: 'code',
  as: 'addressCity'
})
CityModel.hasMany(AddressModel, {
  foreignKey: 'cityCode',
  targetKey: 'code',
  as: 'addressCity'
})

// 自动创建表
// AddressModel.sync({force: false})

module.exports = AddressModel
