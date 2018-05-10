const Tags = require('../../model/admin/tags');
const express = require('express');
const router = express.Router();

/*** 获取全部标签 */
router.get('/get_all_tags', function(req, res) {
  Tags.get_all_tags()
    .then(result => {
      res.json({
        success: true,
        code: 200,
        result
      });
    }, err => {
      res.end(err);
    })
})

module.exports = router;
