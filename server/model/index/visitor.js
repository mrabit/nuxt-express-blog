const query = require('../db');

const Visitor = _ => {};

module.exports = Visitor;

/*** 新增访客
 * @param {*} params 
 */
Visitor.insert_visitor = (params) => {
  const map = [
    params.ip,
    params.referrer,
    params.visit_time,
    params.visit_url
  ];
  const sql = "INSERT INTO `tp_visitor` (`ip`,`referrer`,`visit_time`,`visit_url`)\
              VALUES (?,?,?,?)";
  return new Promise((resolve, reject) => {
    query(sql, map, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

/*** 检查访客日志，是否1小时内
 * @param {*} ip 
 * @return array 指定访客最新访问记录
 */
Visitor.check_visitor = (ip) => {
  const sql = "SELECT * from tp_visitor where ip = ? ORDER BY visit_time desc LIMIT 0,1";
  return new Promise((resolve, reject) => {
    query(sql, ip, (err, result) => {
      if (err) reject(err.message);
      resolve(result[0]);
    })
  });
}
