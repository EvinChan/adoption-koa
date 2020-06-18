const Sequelize = require('sequelize')
const db = require('../config/db')

const CarouselModel = db.define('t_carousel', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'carousel_id'
  },
  src: {
    type: Sequelize.TEXT,
    allowNull: false,
    field: 'carousel_src'
  }
}, {
  timestamps: true,
  freezeTableName: true,
  createdAt: 'gmt_create',
  updatedAt: 'gmt_modified'
})

// 自动创建表
// AddressModel.sync({force: false})

module.exports = CarouselModel
