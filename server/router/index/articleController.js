var Article = require('../../model/index/article');
var express = require('express');
var router = express.Router();


router.get('/get_details/:id', function(req, res) {
    var id = req.params.id;
    Article.get_article_by_id(id).then((result) => {
        res.json({
            code: 200,
            success: true,
            result
        });
    }, (err) => {
        res.end(err);
    });
})

router.get('/get_lists/:page/:length', function(req, res) {

    var params = {
        tags_id: req.query.tags_id,
        page: parseInt(req.params.page) || 1,
        length: parseInt(req.params.length) || 5
    };
    (!params.tags_id ? Article.get_article_lists(params) : Article.get_article_lists_by_tagsId(params))
    .then(aaData => {
        return (!params.tags_id ? Article.get_article_count() : Article.get_article_count_by_tagsId(params.tags_id || null))
            .then(count => {
                //取文章总页数
                var totalPage = Math.ceil(count / params.length);
                return {
                    count: count,
                    totalPage: totalPage,
                    article_lists: aaData
                }
            })
    }, err => {
        res.end(err);
    }).then(result => res.json({
        code: 200,
        success: true,
        result
    }));

});

router.get('/archives', function(req, res) {
    Article.get_article_by_archives().then(result => {
        var article_lists = [];
        result.reduce((p, next) => {
            return p.then(() => {
                var temp = {
                    archives_time: next.create_time
                };
                return Article.get_article_by_in({
                    key: 'id',
                    val: next.id
                }).then(lists => {
                    temp['aaData'] = lists;
                    article_lists.push(temp);
                })
            })
        }, new Promise(resolve => resolve())).then(() => {
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