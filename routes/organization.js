const router = require('koa-router')()
const organization = require('../controllers/organization/organization')
const organizationUser = require('../controllers/organization/organizationUser')
const organizationPet = require('../controllers/organization/organizationPet')
const organizationClassification = require('../controllers/organization/organizationClassification')
const organizationCategory = require('../controllers/organization/organizationCategory')
const organizationOrder = require('../controllers/organization/organizationOrder')
const organizationRevisit = require('../controllers/organization/organizationRevisit')

router.prefix('/organization')

// 机构登录
router.post('/login', organization.login)

// 根据token获取机构信息
router.get('/getData', organization.getData)

// 查看机构个人信息
router.get('/getOneOrganization', organization.getOneOrganization)

// 查看领养申请表信息
router.get('/getAdoption/:page/:limit', organizationUser.getAdoption)

// 根据id查看当前领养申请表的宠物信息
router.get('/getAdoptionPet', organizationUser.getAdoptionPet)

// 根据id查看当前领养申请表的用户信息
router.get('/getAdoptionUser', organizationUser.getAdoptionUser)

// 根据id查看某个领养申请表的信息
router.get('/getOneAdoption', organizationUser.getOneAdoption)

// 修改领养申请表信息
router.put('/updateAdoption', organizationUser.updateAdoption)

// 查看宠物信息
router.get('/getPet/:page/:limit', organizationPet.getPet)

// 根据id查看某个宠物的基础信息
router.get('/getOnePet', organizationPet.getOnePet)

// 根据id查看某个宠物的详细信息
router.get('/getOnePetInformation', organizationPet.getOnePetInformation)

// 新增宠物信息
router.post('/createPet', organizationPet.createPet)

// 上传宠物头像
router.post('/uploadHeading', organizationPet.uploadHeading)

// 修改宠物信息
router.put('/updatePet', organizationPet.updatePet)

// 修改宠物详细信息
router.put('/updatePetInformation', organizationPet.updatePetInformation)

// 查看订单信息
router.get('/getOrder/:page/:limit', organizationOrder.getOrder)

// 根据id查看某个订单信息
router.get('/getOneOrder', organizationOrder.getOneOrder)

// 修改订单信息
router.put('/updateOrder', organizationOrder.updateOrder)

// 查看回访信息
router.get('/getRevisit/:page/:limit', organizationRevisit.getRevisit)

// 根据id查看当前回访的用户信息
router.get('/getRevisitUser', organizationRevisit.getRevisitUser)

// 根据id查看当前回访的宠物信息
router.get('/getRevisitPet', organizationRevisit.getRevisitPet)

// 根据id查看某个回访的信息
router.get('/getOneRevisit', organizationRevisit.getOneRevisit)

// 修改回访信息
router.put('/updateRevisit', organizationRevisit.updateRevisit)

// 分类选择器
router.get('/getClassificationList', organizationClassification.getClassificationList)

// id 品种选择器
router.get('/getCategoryList', organizationCategory.getCategoryList)

// name 品种选择器
router.get('/getCategoryList2', organizationCategory.getCategoryList2)

module.exports = router
