const Sequelize = require('sequelize')
const moment = require('moment')
const db = require('../config/db')
const OrderModel = require('../models/OrderModel')
const UserModel = require('../models/UserModel')
const PetModel = require('../models/PetModel')

const RevisitModel = db.define('t_revisit', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'visit_id'
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    field: 'visit_content'
  },
  orderId: {
    type: Sequelize.CHAR(13),
    allowNull: false,
    field: 'order_id'
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
  gmtCreate: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'gmt_create',
    get() {
      return moment(this.getDataValue('gmtCreate')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  status: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0,
    field: 'visit_status'
  },
}, {
  timestamps: false,
  freezeTableName: true
})

RevisitModel.belongsTo(OrderModel, {
  // 创建外键 RevisitModel.orderId -> UserModel.id
  foreignKey: 'orderId',
  as: 'revisitOrder'
})
OrderModel.hasMany(RevisitModel, {
  // 创建外键 RevisitModel.orderId -> OrderModel.id
  foreignKey: 'orderId',
  as: 'revisitOrder'
})

RevisitModel.belongsTo(UserModel, {
  // 创建外键 RevisitModel.userId -> UserModel.id
  foreignKey: 'userId',
  as: 'revisitUser'
})
UserModel.hasMany(RevisitModel, {
  // 创建外键 RevisitModel.userId -> UserModel.id
  foreignKey: 'userId',
  as: 'revisitUser'
})

RevisitModel.belongsTo(PetModel, {
  // 创建外键 RevisitModel.petId -> PetModel.id
  foreignKey: 'petId',
  as: 'revisitPet'
})
PetModel.hasMany(RevisitModel, {
  // 创建外键 RevisitModel.petId -> PetModel.id
  foreignKey: 'petId',
  as: 'revisitPet'
})

// 自动创建表
// RevisitModel.sync({force: false})

module.exports = RevisitModel
