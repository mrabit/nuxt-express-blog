const Article = require('../../model/admin/article');
const Tags = require('../../model/admin/tags');
const ArticleTags = require('../../model/admin/articleTags');
const express = require('express');
const router = express.Router();
const moment = require('moment');

/*** 获取文章详情 */
router.get('/get_details/:id', (req, res) => {
  const id = req.params.id;
  Article.get_article_by_id(id)
    .then(article => {
      ArticleTags.get_tagsName_by_articleId(id)
        .then(tags_arr => {
          const tags = {};
          tags_arr.forEach(v => {
            tags[v.tags_name] = v.id;
          });
          article["tags"] = tags;
          res.json({
            success: true,
            code: 200,
            result: article
          });
        })
    }, (err) => {
      res.end(err);
    });
})

/*** 获取文章列表 */
router.get('/get_lists/:page/:length', (req, res) => {
  const params = {
    startime: req.query.startime || null,
    endtime: req.query.endtime || null,
    title: req.query.title || null,
    page: parseInt(req.params.page) || 1,
    length: parseInt(req.params.length) || 10
  }
  Article.get_article_lists(params)
    .then(aaData => {
      return Article.get_article_count(params)
        .then(count => {
          return {
            count: count,
            article_lists: aaData
          }
        })
    }, err => {
      res.end(err);
    })
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      });
    });
})

/*** 新增文章 */
router.post('/insert_article', (req, res) => {
  Article.insert_article(req.body)
    .then(article_id => {
      if (JSON.stringify(req.body.tags) != "{}") {
        return Tags.insert_into_all(req.body.tags)
          .then(tags_arr => {
            return ArticleTags.add_article_tags(article_id, tags_arr)
          })
          .then(_ => {
            return 200
          })
      } else {
        return 200;
      }
    })
    .then(status => {
      res.json({
        code: status,
        success: true,
        message: '文章新增成功.'
      })
    })
})

/*** 删除文章 */
router.post('/delete_article', (req, res) => {
  const id = req.body.id;
  Article.delete_article_by_id(id)
    .then(result => {
      return ArticleTags.delete_tags_by_articleId(id)
    }, err => {
      res.end(err);
    })
    .then(_ => {
      res.json({
        code: 200,
        success: true,
        message: '文章删除成功.'
      })
    })
})

/*** 修改文章 */
router.post('/update_article', (req, res) => {
  Article.update_article_by_id(req.body)
    .then(result => {
      return ArticleTags.delete_tags_by_articleId(req.body.id)
        .then(_ => {
          if (JSON.stringify(req.body.tags) != "{}") {
            return Tags.insert_into_all(req.body.tags)
              .then(tags_arr => {
                return ArticleTags.add_article_tags(req.body.id, tags_arr)
              })
              .then(_ => {
                return 200
              })
          } else {
            return 200;
          }
        })
    }, err => {
      res.end(err);
    })
    .then(status => {
      res.json({
        code: status,
        success: true,
        message: '文章更新成功.'
      });
    })
})

/*** 获取今日新增文章数 */
router.get('/get_article_count_today', (req, res) => {
  const today = moment(moment()
      .format('YYYY-MM-DD'))
    .unix();
  Article.get_article_count({
      startime: today
    })
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    })
})

/*** 获取文章阅读排行 */
router.get('/get_read_rank', (req, res) => {
  Article.get_article_by_visitor()
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    })
})

module.exports = router;
