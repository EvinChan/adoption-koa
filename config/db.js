const Sequelize = require('sequelize')

const conf = {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    },
    timezone: '+08:00'
}

const sequelize = new Sequelize('adoption', 'root', '123456', conf)

// 测试连接
// sequelize.authenticate().then(() => {
//     console.log('ok');
// }).catch(() => {
//     console.log('err');
// })

module.exports = sequelize
