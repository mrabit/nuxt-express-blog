var ArticleTags = require('../../model/index/articleTags');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  ArticleTags.get_tags()
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      });
    }, err => {
      res.send(err);
    })
})

module.exports = router;
