const query = require('../db');

const Visitor = _ => {}

module.exports = Visitor;

/*** 统计今日访客,访客总人数
 * @param string $visit_time 今日时间
 * @return array 今日访客,总访客
 */
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

/*** 分时段统计今日访客人数
 * @param int $number 时间间隔
 * @return array 今日访客人数统计
 */
Visitor.get_visitor_today = (number = 2) => {
  let params = [];
  for (let i = 0; i < 24; i += number) {
    let temp = [];
    for (let j = 0; j < number; j++) {
      temp.push(i + j);
    }
    params.push(`IFNULL(count(HOUR(FROM_UNIXTIME(visit_time)) in (${temp.join(',')}) or null ),0) as '${i+number}'`);
  }

  const sql = `select ${params.join(',')} from tp_visitor where date(FROM_UNIXTIME(visit_time)) = date(now())`;
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result[0]);
    });
  })
}
