const PetModel = require('../../models/PetModel')
const PetInformationModel = require('../../models/PetInformationModel')
const RevisitModel = require('../../models/RevisitModel')
const UserModel = require('../../models/UserModel')
const OrganizationModel = require('../../models/OrganizationModel')
const ClassificationModel = require('../../models/ClassificationModel')
const CategoryModel = require('../../models/CategoryModel')
const ProvinceModel = require('../../models/ProvinceModel')
const CarouselModel = require('../../models/CarouselModel')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// 查看宠物详情
exports.getPetDetail = async (ctx, next) => {
  try {
    const petInfo = await PetModel.findAll({
      attributes: ['id', 'name', 'sex', 'age', 'weight', 'province', 'gmt_create', 'isVaccine', 'isRepellant', 'isSterilization', 'status'],
      where: {
        id: ctx.query.id
      },
      order: [
        ['gmt_create', 'ASC']
      ],
      include: [
        {
          model: PetInformationModel,
          attributes: ['imageSrc', 'petDesc'],
          as: 'petInformation',
        },
        {
          model: CategoryModel,
          attributes: ['name'],
          as: 'category',
        },
        {
          model: ProvinceModel,
          attributes: ['name'],
          as: 'provinceName'
        },
        {
          model: OrganizationModel,
          attributes: ['userId'],
          as: 'organization',
          include: [
            {
              model: UserModel,
              attributes: ['name'],
              as: 'organizationName',
            }
          ]
        }
      ]
    })
    ctx.body = {
      code: 200,
      data: {
        petInfo
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 宠物详情 宠物回访
exports.getRevisit = async (ctx, next) => {
  try {
    const revisitInfo = await RevisitModel.findAll({
      attributes: ['id', 'content', 'gmt_create', 'status'],
      where: {
        petId: ctx.query.id,
        status: 2
      },
      include: [
        {
          model: UserModel,
          attributes: ['name'],
          as: 'revisitUser'
        },
      ]
    })
    ctx.body = {
      code: 200,
      data: {
        revisitInfo
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 首页 轮播图
exports.getCarousel = async (ctx, next) => {
  try {
    const carouselInfo = await CarouselModel.findAll({
      attributes: ['id', 'src'],
      order: [
        ['id', 'asc']
      ]
    })
    ctx.body = {
      code: 200,
      data: {
        carouselInfo
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 首页 萌宠图集
exports.getIndexPicture = async (ctx, next) => {
  try {
    const classInfo = await ClassificationModel.findAll({
      attributes: ['id'],
      where: {
        name: ['狗', '猫']
      }
    })
    let classId = []
    for (let i = 0; i < classInfo.length; i++) {
      classId[i] = classInfo[i].id
    }
    const petInfo = await PetModel.findAll({
      attributes: ['id'],
      where: {
        status: [0, 2]
      },
      order: [
        ['gmt_create', 'DESC']
      ],
      limit: 5,
      include: [
        {
          model: PetInformationModel,
          attributes: ['imageSrc'],
          as: 'petInformation',
        },
        {
          model: CategoryModel,
          attributes: ['id'],
          as: 'category',
          where: {
            classifId: classId
          }
        }
      ]
    })
    ctx.body = {
      code: 200,
      data: {
        petInfo
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 首页 萌宠图集 查看更多
exports.getMorePicture = async (ctx, next) => {
  try {
    const classInfo = await ClassificationModel.findAll({
      attributes: ['id'],
      where: {
        name: ['狗', '猫']
      }
    })
    let classId = []
    for (let i = 0; i < classInfo.length; i++) {
      classId[i] = classInfo[i].id
    }
    let page = parseInt(ctx.params.page)
    let limit = parseInt(ctx.params.limit)
    let offset = (page - 1) * limit
    const petInfo = await PetModel.findAndCountAll({
      limit: limit,
      offset: offset,
      attributes: ['id'],
      where: {
        status: [0, 2]
      },
      order: [
        ['gmt_create', 'DESC']
      ],
      include: [
        {
          model: PetInformationModel,
          attributes: ['imageSrc'],
          as: 'petInformation',
        },
        {
          model: CategoryModel,
          attributes: ['id'],
          as: 'category',
          where: {
            classifId: classId
          }
        }
      ]
    })
    ctx.body = {
      code: 200,
      data: {
        petInfo
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 首页 待领养宠物狗/猫
exports.getIndexPet = async (ctx, next) => {
  try {
    const classInfo = await ClassificationModel.findAll({
      attributes: ['id'],
      where: {
        name: ctx.params.classification
      }
    })
    let classId = []
    for (let i = 0; i < classInfo.length; i++) {
      classId[i] = classInfo[i].id
    }
    const petInfo = await PetModel.findAll({
      attributes: ['id', 'name', 'sex', 'age'],
      where: {
        status: 0
      },
      order: [
        ['gmt_create', 'DESC']
      ],
      limit: 4,
      include: [
        {
          model: PetInformationModel,
          attributes: ['imageSrc'],
          as: 'petInformation',
        },
        {
          model: CategoryModel,
          attributes: ['name'],
          as: 'category',
          where: {
            classifId: classId
          }
        }
      ]
    })
    ctx.body = {
      code: 200,
      data: {
        petInfo
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 宠物页面 待领养宠物
exports.getNotAdopted = async (ctx, next) => {
  try {
    const ClassId = await ClassificationModel.findOne({
      where: {
        name: ctx.query.category
      }
    })
    let page = parseInt(ctx.params.page)
    let limit = parseInt(ctx.params.limit)
    let offset = (page - 1) * limit
    let order = []
    if (ctx.query.sortIndex === '1') {
      order = [['gmt_create', 'DESC']]
    } else {
      order = [['gmt_create', 'ASC']]
    }
    let where1 = {}
    if (ctx.query.organizationIndex) {
      where1['userId'] = ctx.query.organizationIndex
    }
    const petInfo = await PetModel.findAndCountAll({
      limit: limit,
      offset: offset,
      attributes: ['id', 'name', 'sex', 'age'],
      where: {
        status: 0
      },
      order: order,
      include: [
        {
          model: PetInformationModel,
          attributes: ['imageSrc'],
          as: 'petInformation',
        },
        {
          model: CategoryModel,
          attributes: ['name'],
          as: 'category',
          where: {
            classifId: ClassId.id
          }
        },
        {
          model: OrganizationModel,
          attributes: ['id'],
          as: 'organization',
          where: where1
        }
      ]
    })
    ctx.body = {
      code: 200,
      data: {
        petInfo
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 宠物页面 已领养宠物
exports.getAdopted = async (ctx, next) => {
  try {
    const ClassId = await ClassificationModel.findOne({
      where: {
        name: ctx.query.category
      }
    })
    let page = parseInt(ctx.params.page)
    let limit = parseInt(ctx.params.limit)
    let offset = (page - 1) * limit
    let order = []
    console.log(ctx.query.sortIndex);
    if (ctx.query.sortIndex === '1') {
      order = [['gmt_create', 'DESC']]
    } else {
      order = [['gmt_create', 'ASC']]
    }
    let where1 = {}
    if (ctx.query.organizationIndex) {
      where1['userId'] = ctx.query.organizationIndex
    }
    const petInfo = await PetModel.findAndCountAll({
      limit: limit,
      offset: offset,
      attributes: ['id', 'name', 'sex', 'age'],
      where: {
        status: 2
      },
      order: order,
      include: [
        {
          model: PetInformationModel,
          attributes: ['imageSrc'],
          as: 'petInformation',
        },
        {
          model: CategoryModel,
          attributes: ['name'],
          as: 'category',
          where: {
            classifId: ClassId.id
          }
        },
        {
          model: OrganizationModel,
          attributes: ['userId'],
          as: 'organization',
          where: where1
        }
      ]
    })
    ctx.body = {
      code: 200,
      data: {
        petInfo
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 搜索 排名前5宠物品种热词
exports.searchHotCategory = async (ctx, next) => {
  try {
    // SELECT COUNT(t_pet.category_id) AS count
    // FROM t_pet
    // GROUP BY t_pet.category_id
    // ORDER BY COUNT(t_pet.category_id) DESC
    const hotInfo = await PetModel.findAll({
      attributes: ['categoryId', [Sequelize.fn('COUNT', Sequelize.col('t_pet.category_id')), 'count']],
      group: 'categoryId',
      order: [
        [Sequelize.fn('COUNT', Sequelize.col('t_pet.category_id')), 'desc']
      ],
      limit: 5,
      include: [
        {
          model: CategoryModel,
          attributes: ['name'],
          as: 'category'
        },
      ]
    })
    ctx.body = {
      code: 200,
      data: {
        hotInfo
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 搜索 品种关键字查询
exports.searchCategoryList = async (ctx, next) => {
  try {
    let page = parseInt(ctx.params.page)
    let limit = parseInt(ctx.params.limit)
    let offset = (page - 1) * limit
    let keyword = ctx.query.keyword
    const petInfo = await PetModel.findAndCountAll({
      limit: limit,
      offset: offset,
      attributes: ['id', 'name', 'sex', 'age'],
      order: [
        ['gmt_create', 'ASC']
      ],
      include: [
        {
          model: PetInformationModel,
          attributes: ['imageSrc'],
          as: 'petInformation',
        },
        {
          model: CategoryModel,
          attributes: ['name'],
          as: 'category',
          where: {
            name: {[Op.like]: `%${keyword}%`}
          }
        }
      ]
    })
    ctx.body = {
      code: 200,
      data: {
        petInfo
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}
