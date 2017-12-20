import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import path from 'path';

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

// 设置静态资源目录
app.use(express.static(path.join(__dirname, 'public')));

// 前端接口路由
app.use('/user', require('./router/index/userController'));
app.use('/article', require('./router/index/articleController'));
app.use('/article_tags', require('./router/index/articleTagsController'));
app.use('/bing', require('./router/index/bingController'));

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
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console