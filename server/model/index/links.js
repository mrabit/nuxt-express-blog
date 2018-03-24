var query = require('../db');

module.exports = {
  getLinksList(params) {
    var sql = 'select *,FROM_UNIXTIME( create_time,"%Y-%m-%d %H:%i:%S" ) as release_time from tp_links ORDER BY create_time desc';
    return new Promise((resolve, reject) => {
      query(sql, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    })
  }
}
