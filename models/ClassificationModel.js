const Sequelize = require('sequelize')
const db = require('../config/db')
const CategoryModel = require('./CategoryModel')

const ClassificationModel = db.define('t_classification', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'classif_id'
  },
  name: {
    type: Sequelize.STRING(30),
    allowNull: false,
    unique: true,
    field: 'classif_name'
  }
}, {
  timestamps: false,
  freezeTableName: true
})

CategoryModel.belongsTo(ClassificationModel, {
  // 创建外键 CategoryModel.classifId -> ClassificationModel.id
  foreignKey: 'classifId',
  as: 'classification'
})
ClassificationModel.hasMany(CategoryModel, {
  foreignKey: 'classifId',
  as: 'classification'
})

// 自动创建表
// ClassificationModel.sync({force: false})

module.exports = ClassificationModel
