const express = require('express');
const router = express.Router();
const Movies = require('../../model/admin/movies');

/*** 获取观影列表 */
router.get('/get_lists/:page/:length', function(req, res) {
  const params = {
    startime: req.query.startime || null,
    endtime: req.query.endtime || null,
    movie_name: req.query.movie_name || null,
    page: parseInt(req.params.page) || 1,
    length: parseInt(req.params.length) || 10
  }
  Movies.get_movies_lists(params)
    .then(aaData => {
      return Movies.get_movies_count(params)
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


/*** 新增观影记录 */
router.post('/insert_movie', (req, res) => {
  const params = {
    movie_name: req.body.movie_name,
    movie_img: (req.body.movie_img[0] || {})
      .url,
    watch_time: req.body.watch_time,
    movie_url: req.body.movie_url || ""
  }
  Movies.insert_movie(params)
    .then(movie_id => {
      return 200;
    })
    .then(status => {
      res.json({
        code: status,
        success: true,
        message: '观影记录新增成功.'
      })
    })
})

/*** 删除观影记录 */
router.post('/delete_movie', (req, res) => {
  const id = req.body.id;
  Movies.delete_movie_by_id(id)
    .then(_ => {
      res.json({
        code: 200,
        success: true,
        message: '观影记录删除成功.'
      })
    })
})


/*** 获取观影详情 */
router.get('/get_details/:id', (req, res) => {
  const id = req.params.id;
  Movies.get_movie_by_id(id)
    .then(movie => {
      res.json({
        success: true,
        code: 200,
        result: movie
      });
    }, (err) => {
      res.end(err);
    });
})

/*** 修改观影记录 */
router.post('/update_movie', (req, res) => {
  const params = {
    movie_name: req.body.movie_name,
    movie_img: (req.body.movie_img[0] || {})
      .url,
    watch_time: req.body.watch_time,
    movie_url: req.body.movie_url || "",
    id: req.body.id
  }
  Movies.update_movie_by_id(params)
    .then(result => {
      return 200;
    }, err => {
      res.end(err);
    })
    .then(status => {
      res.json({
        code: status,
        success: true,
        message: '观影记录更新成功.'
      });
    })
})

module.exports = router;
