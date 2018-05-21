import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express()
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: false
}));
app.use(cookieParser());

app.set('port', port)

// 设置静态资源目录
app.use(express.static(path.join(__dirname, 'public')));

// 中间件判断token
app.use(require('./router/middleware'));
app.use(require('./router/visit_logs'));

// 前端接口路由
app.use('/user', require('./router/index/userController'));
app.use('/article', require('./router/index/articleController'));
app.use('/article_tags', require('./router/index/articleTagsController'));
app.use('/bing', require('./router/index/bingController'));
app.use('/links', require('./router/index/linksController'));
app.use('/movies', require('./router/index/moviesController'));
app.use('/alidns', require('./router/index/alidnsContriller'));

// sitemap地图
app.use('/sitemap', require('./router/sitemap'));

// 后台登录接口
app.use('/api', require('./router/admin/userController'));

// 后台接口路由
app.use('/api/wx', require('./router/admin/wxAuthController'));
app.use('/api/article', require('./router/admin/articleController'));
app.use('/api/tags', require('./router/admin/tagsController'));
app.use('/api/links', require('./router/admin/linksController'));
app.use('/api/visitor', require('./router/admin/visitorController'));
app.use('/api/ecs', require('./router/admin/ecsController'));
app.use('/api/movies', require('./router/admin/moviesController'));


// 上传
app.use('/upload', require('./router/uploadController'));

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
const server = app.listen(port, host);

console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
