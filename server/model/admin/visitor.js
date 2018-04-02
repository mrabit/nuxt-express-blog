var query = require('../db');

var Visitor = _ => {}

module.exports = Visitor;


Visitor.get_visitor_count = visit_time => {
  const sql = "select * from (SELECT count(*) as visit_today from tp_visitor where visit_time > ?) t1,\
    (SELECT count(*) as visit_all from tp_visitor where visit_time > 0) t2";
  return new Promise((resolve, reject) => {
    query(sql, visit_time, (err, result) => {
      if (err) reject(err.message);
      resolve(result[0]);
    });
  })
}
