const query = require('../db');

const Bing = _ => {}

module.exports = Bing;

Bing.add_img = function(params) {

}

/*** 获取指定时间图片
 * @param {*} time 
 * @return
 */
Bing.get_image_by_time = function(time) {
  const sql = "select * from tp_bing where img_time = ?";
  return new Promise((resolve, reject) => {
    query(sql, time, function(err, result) {
      if (err) reject(err.message);
      resolve(result);
    });
  })
}

/*** 新增图片
 * @param {*} params 
 * @return
 */
Bing.insert_imgInfo = function(params) {
  const map = [
    params.img_real_url,
    params.img_url_480,
    params.img_url,
    params.img_time,
    params.img_title
  ];
  const sql = "INSERT INTO `tp_bing` (`img_real_url`,`img_url_480`,`img_url`,`img_time`,`img_title`)\
    VALUES (?,?,?,?,?)";
  return new Promise((resolve, reject) => {
    query(sql, map, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

/*** 获取图片列表
 * @param {*} params 
 * @return
 */
Bing.get_img_lists = function(params) {
  params['start'] = (params.page - 1) * params.length;
  const sql = "SELECT id, img_url, img_url_480, img_time, img_title from tp_bing ORDER BY img_time desc LIMIT ?,?";
  return new Promise((resolve, reject) => {
    query(sql, [params.start, params.length], function(err, result) {
      if (err) reject(err.message)
      resolve(result);
    });
  })
}

/*** 获取图标总数
 * @param {*} time 
 * @return
 */
Bing.get_img_count = function() {
  const sql = "select count(*) as count from tp_bing";
  return new Promise((resolve, reject) => {
    query(sql, function(err, result) {
      if (err) reject(err.message);
      resolve(result[0]['count']);
    })
  })
}
