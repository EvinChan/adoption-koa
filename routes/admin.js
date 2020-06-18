const router = require('koa-router')()
const admin = require('../controllers/admin/admin')
const adminUser = require('../controllers/admin/adminUser')
const adminOrganization = require('../controllers/admin/adminOrganization')
const adminOrder = require('../controllers/admin/adminOrder')
const adminClassification = require('../controllers/admin/adminClassification')
const adminCategory = require('../controllers/admin/adminCategory')
const adminPet = require('../controllers/admin/adminPet')
const adminProvince = require('../controllers/admin/adminProvince')
const adminCity = require('../controllers/admin/adminCity')
const adminNotice = require('../controllers/admin/adminNotice')
const adminCarousel = require('../controllers/admin/adminCarousel')

router.prefix('/admin')

// 管理员注册
router.post('/register', admin.register)

// 管理员登录
router.post('/login', admin.login)

// 根据token获取管理员信息
router.get('/getData', admin.getData)

// 查看用户信息
router.get('/getUser/:page/:limit', adminUser.getUser)

// 根据id查看某个用户的信息
router.get('/getOneUser', adminUser.getOneUser)

// 修改用户信息
router.put('/updateUser', adminUser.updateUser)

// 查看地址信息
router.get('/getAddress/:page/:limit', adminUser.getAddress)

// 根据id查看某个用户地址信息
router.get('/getOneAddress', adminUser.getOneAddress)

// 查看领养申请表信息
router.get('/getAdoption/:page/:limit', adminUser.getAdoption)

// 根据id查看当前领养申请表的宠物信息
router.get('/getAdoptionPet', adminUser.getAdoptionPet)

// 根据id查看当前领养申请表的用户信息
router.get('/getAdoptionUser', adminUser.getAdoptionUser)

// 根据id查看某个领养申请表的信息
router.get('/getOneAdoption', adminUser.getOneAdoption)

// 查看宠物机构
router.get('/getOrganization/:page/:limit', adminOrganization.getOrganization)

// 根据id查看某个机构的信息
router.get('/getOneOrganization', adminOrganization.getOneOrganization)

// 修改宠物机构信息
router.put('/updateOrganizationInfo', adminOrganization.updateOrganizationInfo)

// 审核宠物机构信息
router.put('/updateOrganization', adminOrganization.updateOrganization)

// 查看订单信息
router.get('/getOrder/:page/:limit', adminOrder.getOrder)

// 根据id查看某个订单信息并修改
router.get('/getOneOrder', adminOrder.getOneOrder)

// 查看宠物分类
router.get('/getClassification/:page/:limit', adminClassification.getClassification)

// 根据id查看某个分类的信息
router.get('/getOneClassification', adminClassification.getOneClassification)

// 新增宠物分类
router.post('/createClassification', adminClassification.createClassification)

// 修改宠物分类
router.put('/updateClassification', adminClassification.updateClassification)

// 查看宠物品种
router.get('/getCategory/:page/:limit', adminCategory.getCategory)

// 根据id查看某个品种的信息
router.get('/getOneCategory', adminCategory.getOneCategory)

// 新增宠物品种
router.post('/createCategory', adminCategory.createCategory)

// 修改宠物品种
router.put('/updateCategory', adminCategory.updateCategory)

// 查看宠物信息
router.get('/getPet/:page/:limit', adminPet.getPet)

// 根据id查看某个宠物的基础信息
router.get('/getOnePet', adminPet.getOnePet)

// 根据id查看某个宠物的详细信息
router.get('/getOnePetInformation', adminPet.getOnePetInformation)

// 上传宠物头像
router.post('/uploadHeading', adminPet.uploadHeading)

// 修改宠物信息
router.put('/updatePet', adminPet.updatePet)

// 修改宠物详细信息
router.put('/updatePetInformation', adminPet.updatePetInformation)

// 查看公告信息
router.get('/getNotice/:page/:limit', adminNotice.getNotice)

// 根据id查看某个公告信息
router.get('/getOneNotice', adminNotice.getOneNotice)

// 修改公告信息
router.put('/updateNotice', adminNotice.updateNotice)

// 新增公告信息
router.post('/createNotice', adminNotice.createNotice)

// 查看轮播图
router.get('/getCarousel/:page/:limit', adminCarousel.getCarousel)

// 根据id查看某个轮播图信息
router.get('/getOneCarousel', adminCarousel.getOneCarousel)

// 上传轮播图
router.post('/uploadCarousel', adminCarousel.uploadCarousel)

// 修改轮播图
router.put('/updateCarousel', adminCarousel.updateCarousel)

// 机构选择器
router.get('/getOrganizationList', adminOrganization.getOrganizationList)

// 分类选择器
router.get('/getClassificationList', adminClassification.getClassificationList)

// id 品种选择器
router.get('/getCategoryList', adminCategory.getCategoryList)

// name 品种选择器
router.get('/getCategoryList2', adminCategory.getCategoryList2)

// 省份选择器
router.get('/getProvinceList', adminProvince.getProvinceList)

// name 市选择器
router.get('/getCityList', adminCity.getCityList)

module.exports = router
