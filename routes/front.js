const router = require('koa-router')()
const frontPet = require('../controllers/front/frontPet')
const frontProvince = require('../controllers/front/frontProvince')
const frontCity = require('../controllers/front/frontCity')
const frontNotice = require('../controllers/front/frontNotice')
const frontOrganization = require('../controllers/front/frontOrganization')

router.prefix('/front')

// 首页 轮播图
router.get('/getCarousel', frontPet.getCarousel)

// 首页 萌宠图集
router.get('/getIndexPicture', frontPet.getIndexPicture)

// 首页 萌宠图集 查看更多
router.get('/getMorePicture/:page/:limit', frontPet.getMorePicture)

// 首页 待领养宠物狗/猫
router.get('/getIndexPet/:classification',frontPet.getIndexPet)

// 宠物页面 待领养宠物
router.get('/getNotAdopted/:page/:limit',frontPet.getNotAdopted)

// 宠物页面 已领养宠物
router.get('/getAdopted/:page/:limit',frontPet.getAdopted)

// 查看宠物详情
router.get('/getPetDetail', frontPet.getPetDetail)

// 宠物详情 宠物回访
router.get('/getRevisit', frontPet.getRevisit)

// 首页 系统公告
router.get('/getNotice', frontNotice.getNotice)

// 首页 查看某个系统公告
router.get('/getNoticeDetail', frontNotice.getNoticeDetail)

// 首页 宠物机构
router.get('/getOrganization', frontOrganization.getOrganization)

// 搜索 排名前5宠物品种热词
router.get('/searchHotCategory', frontPet.searchHotCategory)

// 搜索 品种关键字查询
router.get('/searchCategoryList/:page/:limit',frontPet.searchCategoryList)

// 省份选择器
router.get('/getProvinceList', frontProvince.getProvinceList)

// 市选择器
router.get('/getCityList', frontCity.getCityList)

// address 市选择器
router.get('/getCityList2', frontCity.getCityList2)

module.exports = router
