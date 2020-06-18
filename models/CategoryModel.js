const Sequelize = require('sequelize')
const db = require('../config/db')
const PetModel = require('./PetModel')

const CategoryModel = db.define('t_category', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'category_id'
  },
  name: {
    type: Sequelize.STRING(30),
    allowNull: false,
    field: 'category_name'
  },
  classifId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'classif_id'
  }
}, {
  timestamps: false,
  freezeTableName: true
})

PetModel.belongsTo(CategoryModel, {
  // 创建外键 PetModel.categoryId -> CategoryModel.id
  foreignKey: 'categoryId',
  as: 'category'
})
CategoryModel.hasMany(PetModel, {
  foreignKey: 'categoryId',
  as: 'category'
})

// 自动创建表
// CategoryModel.sync({force: false})

module.exports = CategoryModel
