const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer')
  .WebpackBundleSizeAnalyzerPlugin;

let config = {
  /*
   ** Headers of the page
   */
  head: {
    title: '一桶浆糊的博客',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,maximum-scale=1'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: '一桶浆糊,一桶浆糊的博客,JavaScript,中江吴彦祖,个人博客,mrabit,blog'
      },
      {
        hid: 'description',
        name: 'description',
        content: '专注于WEB前端开发,以前偶尔看看PHP,现在对NodeJS感兴趣，毕竟JavaScript是世界上最好的语言'
      }, {
        property: 'og:locale',
        content: 'zh_CN'
      }, {
        property: 'og:type',
        content: 'website',
      }, {
        property: 'twitter:card',
        content: 'summary'
      },
      {
        property: 'twitter:site',
        content: '@biabia123456'
      },
      {
        property: 'twitter:creator',
        content: '@biabia123456'
      }
    ],
    link: [{
      rel: 'shortcut icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }],
    script: []
  },
  /*
   ** Global CSS
   */
  css: [{
      src: '~assets/css/common.scss',
      lang: 'scss'
    },
    {
      src: '~assets/css/html_common.scss',
      lang: 'scss'
    },
    {
      src: '~assets/css/admin_common.scss',
      lang: 'scss'
    },
    {
      src: 'element-ui/lib/theme-chalk/index.css'
    }
  ],
  plugins: [{
      src: '~plugins/element-ui'
    },
    '~plugins/highlight',
    '~plugins/mavonEditor',
    '~plugins/axios.conf',
    '~plugins/loading',
  ],
  loading: {
    color: '#29d'
  },
  router: {
    scrollBehavior: function(to, from, savedPosition) {
      return { x: 0, y: 0 }
    },
    // 在每页渲染前运行 middleware/checkAuth.js 中间件的逻辑 直接进入页面不会执行
    // middleware: 'checkAuth'
  },
  /*
   ** Add axios globally
   */
  build: {
    vendor: ['axios', 'element-ui', 'web-storage-cache', 'moment'],
    extractCSS: true,
    /*
     ** Run ESLINT on save
     */
    extend(config, ctx) {
      // if (ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }
      // config.plugins.push(
      //   new WebpackBundleSizeAnalyzerPlugin('./plain-report.txt')
      // )
    },
    plugins: [
      new WebpackBundleSizeAnalyzerPlugin('./plain-report.txt')
    ]
  }
}

let css = [
  '/css/bootstrap.css',
  '/css/app.css',
  '/css/themify-icons.css',
  '/css/simple-line-icons.css',
  '/css/font-awesome.css',
  '/js/highlightjs/styles/github.min.css',
  '/js/markdown/github-markdown.min.css',
  '/js/katex/katex.min.css'
]

css.map(href => {
  config.head.link.push({
    rel: "stylesheet",
    href: href
  })
});

let script = [
  "//cdn.bootcss.com/jquery/3.2.1/jquery.min.js",
  "//cdn.bootcss.com/echarts/4.0.4/echarts.common.min.js",
  "/js/highlightjs/highlight.min.js",
  "/js/katex/katex.min.js"
]

script.map(src => {
  config.head.script.push({
    type: "text/javascript",
    src: src
  })
});

module.exports = config;
