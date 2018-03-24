var express = require('express');
var router = express.Router();
var article = require('../model/index/article');
var articleTags = require('../model/index/articleTags');
var bing = require('../model/index/bing');
var moment = require('moment');
var fs = require('fs');
var path = require('path');

// sitemap地址:
// 首页: https://blog.mrabit.com
// 文章详情: https://blog.mrabit.com/details/:id
// 文章列表: https://blog.mrabit.com/list/:page
// 归档: https://blog.mrabit.com/archives
// 标签: https://blog.mrabit.com/tags
// 标签列表: https://blog.mrabit.com/list/:page?tags_id=:tags_id
// 关于: https://blog.mrabit.com/about
// bing: https://blog.mrabit.com/bing
// bing列表: https://blog.mrabit.com/bing/:page
// 友链: https://blog.mrabit.com/links

const article_details = _ => {
  return article.get_article_all_id()
    .then(arr => {
      const url = 'https://blog.mrabit.com/details/';
      const article_url = arr.map(k => {
        return url + k.id;
      });
      return article_url;
    });
}

const article_list = _ => {
  return article.get_article_count()
    .then(count => {
      const totalPage = Math.ceil(count / 5);
      const url = 'https://blog.mrabit.com/list/';
      let list_url = [];
      for (let i = 1; i <= totalPage; i++) {
        list_url.push(url + i);
      }
      return list_url;
    })
}

const article_list_tags = _ => {
  return articleTags.get_tags()
    .then(result => {
      const url = 'https://blog.mrabit.com/list/';
      let list_tags_url = result.map(k => {
        let temp_url = [];
        const totalPage = Math.ceil(k.counts / 5);
        for (let i = 1; i <= totalPage; i++) {
          temp_url.push(url + i + "?tags_id=" + k.id);
        }
        return temp_url;
      })
      return Array.prototype.concat.apply([], list_tags_url);
    })
}

const bing_list = _ => {
  return bing.get_img_count()
    .then(count => {
      const totalPage = Math.ceil(count / 10);
      const url = 'https://blog.mrabit.com/bing/';
      let list_url = [];
      for (let i = 1; i <= totalPage; i++) {
        list_url.push(url + i);
      }
      return list_url;
    })
}

const create_sitemap = url_arr => {
  const xml_head = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
  const xml_foot = `</urlset>`;
  const xml_body = url_arr.map(k => {
      return `
      <url>
        <loc>${k}</loc>
        <lastmod>${moment().format('YYYY-MM-DDTHH:mm:ss+08:00')}</lastmod>
        <changefreq>daily</changefreq>
      </url>`;
    })
    .join('');
  return xml_head + xml_body + xml_foot;
}

router.get('/', (req, res) => {
  const url_list = [
    'https://blog.mrabit.com', // 首页
    'https://blog.mrabit.com/archives', // 归档
    'https://blog.mrabit.com/tags', // 标签
    'https://blog.mrabit.com/about', // 关于
    'https://blog.mrabit.com/bing', // bing
    'https://blog.mrabit.com/links' // 友链
  ]
  Promise.all([article_details(), article_list(), article_list_tags()])
    .then(val => {
      const xml = create_sitemap(Array.prototype.concat.apply(url_list, val));
      fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xml);
      res.json({
        code: 200,
        success: true
      });
    })
})

module.exports = router;
