Nuxt.js 构建项目
=========================================
### 用法

1. 安装依赖包

   `npm install`

2. 运行开发环境

   `npm run dev`

3. build前端代码

    `npm run build`
4. 运行生产环境

    `npm start`
    

### 文件目录
```
.
├── README.md
├── .eslintrc.js
├── .gitignore
├── backpack.config.js
├── config.js
├── nuxt.config.js
├── package.json
├── yarn.lock
├── assets
│   └── *
├── components
│   └── *
├── layouts
│   ├── default.vue
│   └── error.vue
├── middleware
├── pages
│   ├── admin
│   │    └── *.vue
│   ├── index
│   │    └── *.vue
│   └── index.vue
├── plugins
│   └── axios.js
├── server
│   ├── public
│   │    └── *
│   └── index.js
├── static
│   ├── css
│   │    └── *
│   ├── fonts
│   │    └── *
│   ├── js
│   │    └── *
│   └── favicon.ico
```

### gogs git钩子设置

钩子名称：`post-receive`

钩子文本： 
```shell
#!/bin/bash
unset $(git rev-parse --local-env-vars);
cd /usr/share/nginx/vue-blog
git pull origin master &&  npm i && npm run build && pm2 restart blog
```


### 参考地址

- [Nuxt.js 中文文档](https://zh.nuxtjs.org/guide)
