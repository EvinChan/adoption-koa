const Sequelize = require('sequelize')
const db = require('../config/db')
const UserModel = require('./UserModel')
const PetModel = require('./PetModel')
const OrganizationModel = require('./OrganizationModel')

const AdoptionModel = db.define('t_adoption', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'adop_id'
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  petId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'pet_id'
  },
  sex: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: 'adop_sex'
  },
  age: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: 'adop_age'
  },
  mobile: {
    type: Sequelize.CHAR(11),
    allowNull: false,
    field: 'adop_mobile'
  },
  isExp: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: 'is_exp'
  },
  housing: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: 'adop_housing'
  },
  marital: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: 'adop_marital'
  },
  profession: {
    type: Sequelize.STRING(20),
    allowNull: false,
    field: 'adop_profession'
  },
  profile: {
    type: Sequelize.TEXT,
    allowNull: false,
    field: 'adop_profile'
  },
  status: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0,
    field: 'adop_status'
  },
  org: {
    type: Sequelize.INTEGER,
    allowNull: true,
    field: 'adop_org'
  }
}, {
  timestamps: false,
  freezeTableName: true
})

AdoptionModel.belongsTo(UserModel, {
  // 创建外键 AdoptionModel.userId -> UserModel.id
  foreignKey: 'userId',
  as: 'adoptionUser'
})
UserModel.hasMany(AdoptionModel, {
  foreignKey: 'userId',
  as: 'adoptionUser'
})

AdoptionModel.belongsTo(PetModel, {
  // 创建外键 AdoptionModel.petId -> PetModel.id
  foreignKey: 'petId',
  as: 'adoptionPet'
})
PetModel.hasMany(AdoptionModel, {
  foreignKey: 'petId',
  as: 'adoptionPet'
})

AdoptionModel.belongsTo(OrganizationModel, {
  // 创建外键 AdoptionModel.org -> OrganizationModel.id
  foreignKey: 'org',
  as: 'adoptionOrg'
})
OrganizationModel.hasMany(AdoptionModel, {
  foreignKey: 'org',
  as: 'adoptionOrg'
})

// 自动创建表
// AdoptionModel.sync({force: false})

module.exports = AdoptionModel
