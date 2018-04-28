const query = require('../db');

module.exports = {
  checkAuth(OPEN_ID) {
    const sql = 'select * from tp_wx where OPEN_ID = ?';
    return new Promise((resolve, reject) => {
      query(sql, OPEN_ID, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    })
  },
  getAuthList(params) {
    const sql = 'select *,FROM_UNIXTIME( create_time,"%Y-%m-%d %H:%i:%S" ) as release_time from tp_wx ORDER BY create_time desc LIMIT ?,?';
    params['start'] = (params.page - 1) * params.length;
    const map = [
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
  getAuthCount() {
    const sql = 'select count(*) as count from tp_wx';
    return new Promise((resolve, reject) => {
      query(sql, (err, result) => {
        if (err) reject(err);
        resolve(result[0]['count']);
      })
    })
  },
  getAuthDetails(id) {
    const sql = 'select id, OPEN_ID, nick_name from tp_wx where id=?';
    return new Promise((resolve, reject) => {
      query(sql, id, (err, result) => {
        if (err) reject(err);
        resolve(result.length > 0 ? result[0] : {});
      })
    })
  },
  insert_auth(params) {
    const sql = 'INSERT INTO `tp_wx` (`OPEN_ID`,`nick_name`,`create_time`)\
        VALUES (?,?,?)';
    const map = [
      params.OPEN_ID,
      params.nick_name,
      params.create_time
    ];
    return new Promise((resolve, reject) => {
      query(sql, map, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    })
  },
  deleteAuth(id) {
    const sql = "delete from tp_wx where id = " + id;
    return new Promise((resolve, reject) => {
      query(sql, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    })
  },
  updateAuth(params) {
    const sql = 'update tp_wx set OPEN_ID=?, nick_name =? where id=?';
    const map = [
      params.OPEN_ID,
      params.nick_name,
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
