const CarouselModel = require('../../models/CarouselModel')
const AdminModel = require('../../models/AdminModel')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../../config/constants')
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// 查看轮播图
exports.getCarousel = async (ctx, next) => {
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
      let time1 = ctx.query.time1
      let time2 = ctx.query.time2
      let where = {}
      if(time1 && time2) {
        time1 = time1 + ' 00:00:00'
        time2 = time2 + ' 23:59:59'
        where['gmt_modified'] = {[Op.gt]: `${time1}`, [Op.lt]: `${time2}`}
      }
      const carouselInfo = await CarouselModel.findAndCountAll({
        limit: limit,
        offset: offset,
        attributes: ['id', 'src', 'gmt_create', 'gmt_modified'],
        where: where,
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

// 根据id查看某个轮播图信息
exports.getOneCarousel = async (ctx, next) => {
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
      const carouselInfo = await CarouselModel.findOne({
        attributes: ['src'],
        where: {
          id: ctx.query.id
        }
      })
      ctx.body = {
        code: 200,
        data: {
          carouselInfo
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

// 上传轮播图
exports.uploadCarousel = async (ctx, next) => {
  const file = ctx.request.files.file
  // 生成头像的唯一识别码
  let name = uuid();
  // 获取图片类型
  let type = file.name.split('.')[1]
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, '../../../../../pet_pics/carousel/') + `${name}.${type}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  let fp = filePath.split("\\")
  // 新头像的访问路径
  let src = "http://localhost:5000/" + fp[2] + "/" + fp[3]
  ctx.body = {
    code: 200,
    data: {
      src
    }
  }
}

// 修改轮播图
exports.updateCarousel = async (ctx, next) => {
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
      const res = await CarouselModel.update({
        src: req.src
      }, {
        where: {
          id: req.id
        }
      })
      ctx.body = {
        code: 200,
        message: '修改成功'
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
