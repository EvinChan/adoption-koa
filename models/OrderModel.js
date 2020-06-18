const Sequelize = require('sequelize')
const moment = require('moment')
const db = require('../config/db')
const AdoptionModel = require('./AdoptionModel')
const UserModel = require('./UserModel')
const PetModel = require('./PetModel')
const AddressModel = require('./AddressModel')

const OrderModel = db.define('t_order', {
  id: {
    type: Sequelize.CHAR(13),
    primaryKey: true,
    allowNull: false,
    field: 'order_id'
  },
  adopId: {
    type: Sequelize.INTEGER,
    allowNull: false,
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
  addressId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'address_id'
  },
  shipping: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: 'order_shipping'
  },
  freight: {
    type: Sequelize.DECIMAL(6, 2),
    allowNull: false,
    field: 'order_freight'
  },
  remark: {
    type: Sequelize.STRING(50),
    allowNull: true,
    field: 'order_remark'
  },
  status: {
    type: Sequelize.TINYINT,
    allowNull: false,
    field: 'order_status'
  },
  gmtCreate: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'gmt_create',
    get() {
      return moment(this.getDataValue('gmtCreate')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  gmtTransaction: {
    type: Sequelize.DATE,
    allowNull: true,
    field: 'gmt_transaction',
    get() {
      return moment(this.getDataValue('gmtTransaction')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}, {
  timestamps: false,
  freezeTableName: true
})

OrderModel.belongsTo(AdoptionModel, {
  // 创建外键 OrderModel.adopId -> AdoptionModel.id
  foreignKey: 'adopId',
  as: 'orderAdoption'
})
AdoptionModel.hasOne(OrderModel, {
  foreignKey: 'adopId',
  as: 'orderAdoption'
})

OrderModel.belongsTo(UserModel, {
  // 创建外键 OrderModel.userId -> UserModel.id
  foreignKey: 'userId',
  as: 'orderUser'
})
UserModel.hasMany(OrderModel, {
  foreignKey: 'userId',
  as: 'orderUser'
})

OrderModel.belongsTo(PetModel, {
  // 创建外键 OrderModel.petId -> PetModel.id
  foreignKey: 'petId',
  as: 'orderPet'
})
PetModel.hasOne(OrderModel, {
  foreignKey: 'petId',
  as: 'orderPet'
})

OrderModel.belongsTo(AddressModel, {
  // 创建外键 OrderModel.addressId -> AddressModel.id
  foreignKey: 'addressId',
  as: 'orderAddress'
})
AddressModel.hasMany(OrderModel, {
  foreignKey: 'addressId',
  as: 'orderAddress'
})

// 自动创建表
// OrderModel.sync({force: false})

module.exports = OrderModel
