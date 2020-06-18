const AdminModel = require('../../models/AdminModel')
const PetModel = require('../../models/PetModel')
const PetInformationModel = require('../../models/PetInformationModel')
const CategoryModel = require('../../models/CategoryModel')
const ClassificationModel = require('../../models/ClassificationModel')
const ProvinceModel = require('../../models/ProvinceModel')
const OrganizationModel = require('../../models/OrganizationModel')
const UserModel = require('../../models/UserModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// 查看宠物信息
exports.getPet = async (ctx, next) => {
  const token = ctx.header['admin-token']
  const adminInfo = jwt.verify(token, SECRET)
  try {
    const admin = await AdminModel.findOne({
      attributes: ['id'],
      where: {
        mobile: adminInfo.mobile
      }
    })
    if (admin) {
      let page = parseInt(ctx.params.page)
      let limit = parseInt(ctx.params.limit)
      let offset = (page - 1) * limit
      let classificationName = ctx.query.classificationName
      let categoryName = ctx.query.categoryName
      let petName = ctx.query.petName
      let sex = ctx.query.sex
      let province = ctx.query.provinceName
      let organization = ctx.query.organizationName
      let status = ctx.query.status
      let time1 = ctx.query.time1
      let time2 = ctx.query.time2
      let where1 = {}
      let where2 = {}
      if (classificationName) {
        where2['classifId'] = classificationName
        if (categoryName) {
          where2['id'] = categoryName
        }
      } else {
        if (categoryName) {
          where2['id'] = categoryName
        }
      }
      if(petName) {
        where1['name'] = {[Op.like]: `%${petName}%`}
        if (sex) {
          where1['sex'] = sex
        }
      } else {
        if (sex) {
          where1['sex'] = sex
        }
      }
      if (province) {
        where1['province'] = province
        if (organization) {
          where1['orgId'] = organization
        }
      } else {
        if (organization) {
          where1['orgId'] = organization
        }
      }
      if (status) {
        where1['status'] = status
      }
      if(time1 && time2) {
        time1 = time1 + ' 00:00:00'
        time2 = time2 + ' 23:59:59'
        where1['gmt_create'] = {[Op.gt]: `${time1}`, [Op.lt]: `${time2}`}
      }
      let order = []
      if (ctx.query.sort === 'asc') {
        order = [['id', 'asc']]
      } else {
        order = [['id', 'desc']]
      }
      const petInfo = await PetModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'name', 'sex', 'status', 'gmt_create', 'gmt_modified'],
        where: where1,
        order: order,
        include: [
          {
            model: CategoryModel,
            attributes: ['name'],
            where: where2,
            as: 'category'
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
                as: 'organizationName'
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
    } else {
      ctx.body = {
        code: 400,
        message: '请重新登录'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 根据id查看某个宠物的基础信息
exports.getOnePet = async (ctx, next) => {
  const token = ctx.header['admin-token']
  const adminInfo = jwt.verify(token, SECRET)
  try {
    const admin = await AdminModel.findOne({
      attributes: ['id'],
      where: {
        mobile: adminInfo.mobile
      }
    })
    if (admin) {
      const petInfo = await PetModel.findOne({
        attributes: ['name', 'sex', 'age', 'weight', 'isVaccine', 'isRepellant', 'isSterilization', 'status'],
        where: {
          id: ctx.query.id
        },
        include: [
          {
            model: CategoryModel,
            attributes: ['name'],
            as: 'category',
            include: [
              {
                model: ClassificationModel,
                attributes: ['name'],
                as: 'classification'
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
    } else {
      ctx.body = {
        code: 400,
        message: '请重新登录'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 根据id查看某个宠物的详细信息
exports.getOnePetInformation = async (ctx, next) => {
  const token = ctx.header['admin-token']
  const adminInfo = jwt.verify(token, SECRET)
  try {
    const admin = await AdminModel.findOne({
      attributes: ['id'],
      where: {
        mobile: adminInfo.mobile
      }
    })
    if (admin) {
      const petInfo = await PetModel.findOne({
        attributes: ['name'],
        where: {
          id: ctx.query.id
        },
        include: [
          {
            model: PetInformationModel,
            attributes: ['imageSrc', 'petDesc'],
            as: 'petInformation'
          }
        ]
      })
      ctx.body = {
        code: 200,
        data: {
          petInfo
        }
      }
    } else {
      ctx.body = {
        code: 400,
        message: '请重新登录'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 上传宠物头像
exports.uploadHeading = async (ctx, next) => {
  const file = ctx.request.files.file
  // 生成头像的唯一识别码
  let name = uuid();
  // 获取图片类型
  let type = file.name.split('.')[1]
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, '../../../../../pet_pics/pet/') + `${name}.${type}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  let fp = filePath.split("\\")
  // 新头像的访问路径
  let heading = "http://localhost:5000/" + fp[2] + "/" + fp[3]
  ctx.body = {
    code: 200,
    data: {
      heading
    }
  }
}

// 修改宠物信息
exports.updatePet = async (ctx, next) => {
  const req = ctx.request.body
  const token = ctx.header['admin-token']
  const adminInfo = jwt.verify(token, SECRET)
  try {
    const admin = await AdminModel.findOne({
      attributes: ['id'],
      where: {
        mobile: adminInfo.mobile
      }
    })
    if (admin) {
      // 获取宠物品种id
      const categoryInfo = await CategoryModel.findOne({
        attributes: ['id'],
        where: {
          name: req.category.name
        },
        include: [
          {
            model: ClassificationModel,
            attributes: ['id'],
            where: {
              name: req.category.classification.name
            },
            as: 'classification'
          }
        ]
      })
      const res = await PetModel.update({
        categoryId: categoryInfo.id,
        name: req.name,
        sex: req.sex,
        age: req.age,
        weight: req.weight,
        isVaccine: req.isVaccine,
        isRepellant: req.isRepellant,
        isSterilization: req.isSterilization,
        status: req.status,
        gmtModified: new Date()
      }, {
        where: {
          id: req.id
        }
      })
      ctx.body = {
        code: 200,
        message: '修改信息成功'
      }
    } else {
      ctx.body = {
        code: 400,
        message: '请重新登录'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

// 修改宠物详细信息
exports.updatePetInformation = async (ctx, next) => {
  const req = ctx.request.body
  const token = ctx.header['admin-token']
  const adminInfo = jwt.verify(token, SECRET)
  try {
    const admin = await AdminModel.findOne({
      attributes: ['id'],
      where: {
        mobile: adminInfo.mobile
      }
    })
    if (admin) {
      const res = await PetInformationModel.update({
        imageSrc: req.petInformation.imageSrc,
        petDesc: req.petInformation.petDesc,
      }, {
        where: {
          petId: req.id
        }
      })
      const res2 = await PetModel.update({
        gmtModified: new Date()
      }, {
        where: {
          id: req.id
        }
      })
      ctx.body = {
        code: 200,
        message: '修改信息成功'
      }
    } else {
      ctx.body = {
        code: 400,
        message: '请重新登录'
      }
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: '网络出错'
    }
  }
}

function uuid() {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  let uuid = s.join("");
  return uuid;
}
