var Article = require('../../model/admin/article');
var Tags = require('../../model/admin/tags');
var ArticleTags = require('../../model/admin/articleTags');
var express = require('express');
var router = express.Router();

router.get('/get_details/:id', function(req, res) {
    var id = req.params.id;
    Article.get_article_by_id(id).then(article => {
        ArticleTags.get_tagsName_by_articleId(id).then(tags_arr => {
            // res.json(result);
            var tags = {};
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

router.get('/get_lists/:page/:length', function(req, res) {
    var params = {
        startime: req.query.startime || null,
        endtime: req.query.endtime || null,
        title: req.query.title || null,
        page: parseInt(req.params.page) || 1,
        length: parseInt(req.params.length) || 10
    }
    Article.get_article_lists(params).then(aaData => {
        return Article.get_article_count(params).then(count => {
            return {
                count: count,
                article_lists: aaData
            }
        })
    }, err => {
        res.end(err);
    }).then(result => {
        res.json({
            code: 200,
            success: true,
            result
        });
    });
})

router.post('/insert_article', function(req, res) {
    Article.insert_article(req.body).then(article_id => {
        if (JSON.stringify(req.body.tags) != "{}") {
            return Tags.insert_into_all(req.body.tags).then(tags_arr => {
                return ArticleTags.add_article_tags(article_id, tags_arr)
            }).then(_ => {
                return 200
            })
        } else {
            return 200;
        }
    }).then(status => {
        res.json({
            code: status,
            success: true,
            message: '文章新增成功.'
        })
    })
})

router.post('/delete_article', function(req, res) {
    var id = req.body.id;
    Article.delete_article_by_id(id).then(result => {
        return ArticleTags.delete_tags_by_articleId(id)
    }, err => {
        res.end(err);
    }).then(_ => {
        res.json({
            code: 200,
            success: true,
            message: '文章删除成功.'
        })
    })
})

router.post('/update_article', function(req, res) {
    Article.update_article_by_id(req.body).then(result => {
        return ArticleTags.delete_tags_by_articleId(req.body.id).then(_ => {
            if (JSON.stringify(req.body.tags) != "{}") {
                return Tags.insert_into_all(req.body.tags).then(tags_arr => {
                    return ArticleTags.add_article_tags(req.body.id, tags_arr)
                }).then(_ => {
                    return 200
                })
            } else {
                return 200;
            }
        })
    }, err => {
        res.end(err);
    }).then(status => {
        res.json({
            code: status,
            success: true,
            message: '文章更新成功.'
        });
    })
})

module.exports = router;