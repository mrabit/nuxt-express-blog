const Article = require('../../model/index/article');
const express = require('express');
const articleTags = require('../../model/index/articleTags');
const router = express.Router();


/*** 获取文章详情 */
router.get('/get_details/:id', function(req, res) {
  const id = req.params.id;
  Article.get_article_by_id(id)
    .then((result) => {
      Article.update_visit_number_by_id(id);
      res.json({
        code: 200,
        success: true,
        result
      });
    }, (err) => {
      res.end(err);
    });
})

/*** 获取文章列表 */
router.get('/get_lists/:page/:length', function(req, res) {
  const params = {
    tags_id: req.query.tags_id,
    page: parseInt(req.params.page) || 1,
    length: parseInt(req.params.length) || 5
  };
  (!params.tags_id ? Article.get_article_lists(params) : Article.get_article_lists_by_tagsId(params))
  .then(aaData => {
      return (!params.tags_id ? Article.get_article_count() : Article.get_article_count_by_tagsId(params.tags_id || null))
        .then(count => {
          //取文章总页数
          const totalPage = Math.ceil(count / params.length);
          const data = {
            count: count,
            totalPage: totalPage,
            article_lists: aaData
          }
          if (params.tags_id) {
            return articleTags.get_tagsName_by_tagsId(params.tags_id)
              .then(tags_name => {
                data['tags_name'] = tags_name;
                return data;
              })
          }
          return data;
        })
    }, err => {
      res.end(err);
    })
    .then(result => res.json({
      code: 200,
      success: true,
      result
    }));
});

/*** 归档 */
router.get('/archives', function(req, res) {
  Article.get_article_by_archives()
    .then(result => {
      const article_lists = [];
      result.reduce((p, next) => {
          return p.then(() => {
            const temp = {
              archives_time: next.create_time
            };
            return Article.get_article_by_in({
                key: 'id',
                val: next.id
              })
              .then(lists => {
                temp['aaData'] = lists;
                article_lists.push(temp);
              })
          })
        }, new Promise(resolve => resolve()))
        .then(() => {
          res.json({
            code: 200,
            success: true,
            result: article_lists
          });
        });
    }, err => {
      res.end(err);
    })
})

module.exports = router;
