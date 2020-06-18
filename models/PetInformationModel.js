const Sequelize = require('sequelize')
const db = require('../config/db')

const PetInformationModel = db.define('t_pet_information', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'info_id'
  },
  petId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'pet_id'
  },
  imageSrc: {
    type: Sequelize.STRING(100),
    allowNull: false,
    field: 'image_src'
  },
  petDesc: {
    type: Sequelize.TEXT,
    allowNull: false,
    field: 'pet_desc'
  }
}, {
  timestamps: false,
  freezeTableName: true
})

// 自动创建表
// PetInformationModel.sync({force: false})

module.exports = PetInformationModel
