const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwtKoa = require('koa-jwt')
const {SECRET} = require('./config/constants')

const user = require('./routes/user')
const admin = require('./routes/admin')
const adminDashboard = require('./routes/adminChart')
const organization = require('./routes/organization')
const organizationDashboard = require('./routes/organizationChart')
const front = require('./routes/front')

// koa-body中间件
const koaBody = require('koa-body');
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
  }
}));

// 错误处理
onerror(app)

// 中间件
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 解决跨域问题
app.use(async (ctx, next)=> {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, admin-token, org-token, pet-token');
  if (ctx.method === 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});

// 自定义错误处理
app.use(async (ctx,next) => {
  return next().catch(err => {
    if (err.status === 400){
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户输入错误，请重新输入！'
      }
    }
    else if (err.status === 401){
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: '用户验证失败，请重新登录！'
      }
    }
    else {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: '服务器出错，请稍后再试！'
      }
    }
  })
})

// jwt检验token
// app.use(jwtKoa({
//   secret: SECRET
// }).unless({
//   // 自定义哪些目录忽略jwt验证
//   path: [/\/register/, /\/login/, /\/getData/]
// }))

// 日志输出
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 路由
app.use(user.routes(), user.allowedMethods())
app.use(admin.routes(), admin.allowedMethods())
app.use(adminDashboard.routes(), adminDashboard.allowedMethods())
app.use(organization.routes(), organization.allowedMethods())
app.use(organizationDashboard.routes(), organizationDashboard.allowedMethods())
app.use(front.routes(), front.allowedMethods())

module.exports = app
