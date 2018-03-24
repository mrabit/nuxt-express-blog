var query = require('../db');

module.exports = {
  getLinksList(params) {
    var sql = 'select *,FROM_UNIXTIME( create_time,"%Y-%m-%d %H:%i:%S" ) as release_time from tp_links ORDER BY create_time desc LIMIT ?,?';
    params['start'] = (params.page - 1) * params.length;
    var map = [
      params.start,
      params.length
    ]
    return new Promise((resolve, reject) => {
      query(sql, map, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    })
  },
  getLinksCount() {
    var sql = 'select count(*) as count from tp_links';
    return new Promise((resolve, reject) => {
      query(sql, (err, result) => {
        if (err) reject(err);
        resolve(result[0]['count']);
      })
    })
  },
  getLinksDetails(id) {
    var sql = 'select id, site_name, site_url from tp_links where id=?';
    return new Promise((resolve, reject) => {
      query(sql, id, (err, result) => {
        if (err) reject(err);
        resolve(result.length > 0 ? result[0] : {});
      })
    })
  },
  insert_links(params) {
    var sql = 'INSERT INTO `tp_links` (`site_name`,`site_url`,`create_time`)\
        VALUES (?,?,?)';
    var map = [
      params.site_name,
      params.site_url,
      params.create_time
    ];
    return new Promise((resolve, reject) => {
      query(sql, map, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    })
  },
  deleteLinks(id) {
    var sql = "delete from tp_links where id = " + id;
    return new Promise((resolve, reject) => {
      query(sql, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    })
  },
  updateLinks(params) {
    var sql = 'update tp_links set site_name=?, site_url =? where id=?';
    var map = [
      params.site_name,
      params.site_url,
      params.id
    ]
    return new Promise((resolve, reject) => {
      query(sql, map, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    })
  }
}
