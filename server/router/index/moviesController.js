const express = require('express');
const router = express.Router();
const Movies = require('../../model/index/movies');

/*** 获取观影列表 */
router.get('/get_lists/:page/:length', function(req, res) {
  const params = {
    page: parseInt(req.params.page) || 1,
    length: parseInt(req.params.length) || 5
  };
  Movies.get_movies_lists(params)
    .then(aaData => {
      return Movies.get_movies_count()
        .then(count => {
          //取观影总页数
          const totalPage = Math.ceil(count / params.length);
          const data = {
            count: count,
            totalPage: totalPage,
            movies_lists: aaData
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

module.exports = router;
