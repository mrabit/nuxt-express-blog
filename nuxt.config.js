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
                hid: 'Keywords',
                name: 'Keywords',
                content: '一桶浆糊,web前端,HTML5,JavaScript,ECMAScript,ES6,PHP,CentOS'
            },
            {
                hid: 'Description',
                name: 'Description',
                content: '专注于WEB前端开发,以前偶尔看看PHP,现在对NodeJS感兴趣，毕竟JavaScript是世界上最好的语言'
            }
        ],
        link: [{
            rel: 'icon',
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
    }],
    loading: {
        color: '#29d'
    },
    /*
     ** Add axios globally
     */
    build: {
        vendor: ['axios', 'element-ui', 'web-storage-cache'],
        extractCSS: true,
        /*
         ** Run ESLINT on save
         */
        // extend(config, ctx) {
        //   if (ctx.isClient) {
        //     config.module.rules.push({
        //       enforce: 'pre',
        //       test: /\.(js|vue)$/,
        //       loader: 'eslint-loader',
        //       exclude: /(node_modules)/
        //     })
        //   }
        // }
    }
}

let css = [
    '/css/bootstrap.css',
    '/css/app.css',
    '/css/font-awesome.css',
    '/css/simple-line-icons.css',
    '/css/themify-icons.css',
    '/js/editormd/css/editormd.css',
]

css.map(href => {
    config.head.link.push({
        rel: "stylesheet",
        href: href
    })
});

let script = [
    "//cdn.bootcss.com/jquery/3.2.1/jquery.min.js",
    "/js/editormd/editormd.js",
    "/js/editormd/lib/marked.min.js",
    "/js/editormd/lib/prettify.min.js",
    "/js/editormd/lib/raphael.min.js",
    "/js/editormd/lib/underscore.min.js",
    "/js/editormd/lib/sequence-diagram.min.js",
    "/js/editormd/lib/flowchart.min.js",
    "/js/editormd/lib/jquery.flowchart.min.js"
]

script.map(src => {
    config.head.script.push({
        type: "text/javascript",
        src: src
    })
});

module.exports = config;