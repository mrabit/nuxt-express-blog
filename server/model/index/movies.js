const query = require('../db');

const Movies = params => {}

/*** 获取观影列表
 * @param array $params   参数:page 当前页  length 长度
 * @return mixed    获取到的Array数据
 */
Movies.get_movies_lists = params => {
  params['start'] = (params.page - 1) * params.length;
  const sql = "SELECT id,movie_name,movie_img,FROM_UNIXTIME( watch_time,' %Y-%m-%d' ) as watch_time,movie_url from tp_movies ORDER BY watch_time desc limit ?,?";
  return new Promise((resolve, reject) => {
    query(sql, [params.start, params.length], function(err, result) {
      if (err) reject(err.message)
      resolve(result);
    });
  })
}

/*** 获取观影总条数
 * @param array $params  
 * @return int    满足条件的文章总条数
 */
Movies.get_movies_count = _ => {
  const sql = "SELECT count(*) as count from tp_movies";
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result[0]['count']);
    })
  })
}

module.exports = Movies;
