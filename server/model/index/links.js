const query = require('../db');

module.exports = {
  /*** 获取友链列表
   * @param {*} time 
   * @return
   */
  getLinksList(params) {
    const sql = 'select *,FROM_UNIXTIME( create_time,"%Y-%m-%d %H:%i:%S" ) as release_time from tp_links ORDER BY create_time desc';
    return new Promise((resolve, reject) => {
      query(sql, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    })
  }
}
