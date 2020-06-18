const router = require('koa-router')()
const user = require('../controllers/user/user')
const userUser = require('../controllers/user/userUser')
const userAdoption = require('../controllers/user/userAdoption')
const userOrganization = require('../controllers/user/userOrganization')
const userOrder = require('../controllers/user/userOrder')
const userAddress = require('../controllers/user/userAddress')

router.prefix('/user')

// 检验手机号是否注册 200 未注册
router.get('/checkMobileFalse/:mobile', user.checkMobileFalse)

// 发送注册验证码
router.get('/getUserSms/:mobile', user.getUserSms)

// 检验手机号验证码是否正确
router.get('/checkCode/:mobile/:code', user.checkCode)

// 用户注册
router.post('/register', user.register)

// 用户登录
router.post('/login', user.login)

// 根据token获取用户信息
router.get('/getData', user.getData)

// 检验手机号是否注册 200 已注册
router.get('/checkMobileTrue/:mobile', user.checkMobileTrue)

// 找回密码
router.post('/resetPassword', user.resetPassword)

// 检测用户是否填写身份证号
router.get('/checkUserIdcard', userUser.checkUserIdcard)

// 查看用户个人信息
router.get('/getUserData', userUser.getUserData)

// 修改用户信息
router.put('/updateUserData', userUser.updateUserData)

// 查看用户认证信息
router.get('/getUserReal', userUser.getUserReal)

// 提交认证
router.put('/createVerification', userUser.createVerification)

// 上传用户头像
router.post('/uploadHeading', userUser.uploadHeading)

// 修改用户头像
router.post('/updateHeading', userUser.updateHeading)

// 修改用户密码
router.put('/updateUserPwd', userUser.updateUserPwd)

// 检验原手机号是否正确
router.get('/checkOldMobile/:mobile', userUser.checkOldMobile)

// 修改用户账号
router.put('/updateUserMobile', userUser.updateUserMobile)

// 查看用户地址
router.get('/getAddress/:page/:limit', userAddress.getAddress)

// 根据id查看某地址信息
router.get('/getOneAddress', userAddress.getOneAddress)

// 修改用户地址
router.put('/updateAddress', userAddress.updateAddress)

// 删除用户地址
router.delete('/deleteAddress/:id', userAddress.deleteAddress)

// 设置默认地址
router.put('/updateDefault', userAddress.updateDefault)

// 新增用户地址
router.post('/createAddress', userAddress.createAddress)

// 用户提交领养申请表
router.post('/createAdoption', userAdoption.createAdoption)

// 查看领养申请表
router.get('/getAdoption/:page/:limit', userAdoption.getAdoption)

// 根据id查看某领养申请表
router.get('/getOneAdoption', userAdoption.getOneAdoption)

// 取消领养申请
router.put('/cancelAdoption/:id', userAdoption.cancelAdoption)

// 提交订单时的宠物信息
router.get('/getOrderPet', userOrder.getOrderPet)

// 提交订单时的地址信息
router.get('/getOrderAddress', userOrder.getOrderAddress)

// 提交订单时查找该订单是否已经生成
router.get('/selectOrder', userOrder.selectOrder)

// 用户提交订单
router.post('/createOrder', userOrder.createOrder)

// 支付订单
router.put('/payOrder/:adopId', userOrder.payOrder)

// 查看用户订单
router.get('/getOrder/:page/:limit', userOrder.getOrder)

// 根据id查看某订单
router.get('/getOneOrder', userOrder.getOneOrder)

// 取消订单
router.put('/cancelOrder/:id', userOrder.cancelOrder)

// 确认收货
router.put('/confirmOrder/:id', userOrder.confirmOrder)

// 发布宠物回访
router.post('/createRevisit', userOrder.createRevisit)

// 是否显示 申请为机构 超链接
router.get('/getHeaderOrganization', userOrganization.getHeaderOrganization)

// 用户提交机构申请表
router.post('/createOrganization', userOrganization.createOrganization)

// 查看机构申请表
router.get('/getOrganization/:page/:limit', userOrganization.getOrganization)

// 根据id查看某机构申请表
router.get('/getOneOrganization', userOrganization.getOneOrganization)

// 取消机构申请表
router.put('/cancelOrganization/:id', userOrganization.cancelOrganization)

// 富文本图片上传
router.post('/tinymceUpload', userOrganization.tinymceUpload)

module.exports = router
