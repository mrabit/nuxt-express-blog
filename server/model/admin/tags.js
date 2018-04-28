const query = require('../db');

const Tags = _ => {}

module.exports = Tags;

Tags.get_all_tags = function(params) {
  let sql = "SELECT * FROM `tp_tags`";
  if (params) {
    sql += ("where `tags_name` in ('" + params.join("','") + "')");
  }
  return new Promise((resolve, reject) => {
    query(sql, function(err, result) {
      if (err) reject(err.message);
      resolve(result);
    })
  });
}

Tags.insert_into_all = function(tags_arr) {
  //id非0的数组
  const $old_tags = [];
  //id为0,需要批量插入的数组
  const $insert_tags = [];

  for (let i in tags_arr) {
    if (tags_arr[i] == "0") {
      $insert_tags.push(i);
    } else {
      $old_tags.push(i);
    }
  }
  return new Promise((resolve, reject) => {
      if ($insert_tags.length > 0) {
        let sql = "INSERT INTO `tp_tags` (`tags_name`) VALUES ";
        $insert_tags.forEach(v => {
          sql += "('" + v + "'),";
        })
        sql = sql.substr(0, sql.length - 1);
        query(sql, (err, result) => {
          if (err) reject(err.message);
          resolve($insert_tags.concat($old_tags));
        })
      } else {
        resolve($insert_tags.concat($old_tags));
      }
    })
    .then(tags_arr => {
      return this.get_all_tags(tags_arr)
    })
}
