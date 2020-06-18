const Sequelize = require('sequelize')
const moment = require('moment')
const db = require('../config/db')
const PetInformationModel = require('./PetInformationModel')
const ProvinceModel = require('./ProvinceModel')

const PetModel = db.define('t_pet', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'pet_id'
  },
  name: {
    type: Sequelize.STRING(10),
    allowNull: false,
    field: 'pet_name'
  },
  categoryId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'category_id'
  },
  sex: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: 'pet_sex'
  },
  age: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: 'pet_age'
  },
  weight: {
    type: Sequelize.DECIMAL(4, 1),
    allowNull: false,
    field: 'pet_weight'
  },
  province: {
    type: Sequelize.CHAR(6),
    allowNull: false,
    field: 'pet_province'
  },
  isVaccine: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0,
    field: 'is_vaccine'
  },
  isRepellant: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0,
    field: 'is_repellant'
  },
  isSterilization: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0,
    field: 'is_sterilization'
  },
  status: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: 'pet_status'
  },
  orgId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'org_id'
  },
  gmtCreate: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'gmt_create',
    get() {
      return moment(this.getDataValue('gmtCreate')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  gmtModified: {
    type: Sequelize.DATE,
    allowNull: true,
    field: 'gmt_modified',
    get() {
      return moment(this.getDataValue('gmtModified')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}, {
  timestamps: false,
  freezeTableName: true
})

// 外键关联
PetInformationModel.belongsTo(PetModel, {
  // 创建外键 PetInformationModel.petId -> PetModel.id
  foreignKey: 'petId',
  as: 'petInformation'
})
PetModel.hasOne(PetInformationModel, {
  // 创建外键 PetInformationModel.petId -> PetModel.id
  foreignKey: 'petId',
  as: 'petInformation'
})

PetModel.belongsTo(ProvinceModel, {
  // 创建外键 PetModel.province -> ProvinceModel.code
  foreignKey: 'province',
  targetKey: 'code',
  as: 'provinceName'
})
ProvinceModel.hasMany(PetModel, {
  foreignKey: 'province',
  targetKey: 'code',
  as: 'provinceName'
})

// 自动创建表
// PetModel.sync({force: false})

module.exports = PetModel
