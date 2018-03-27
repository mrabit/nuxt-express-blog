var query = require('../db');

var Article = _ => {}

Article.get_article_by_id = function(id) {
  var sql = 'SELECT id,title,reprint_url,private,content from tp_article';
  if (id) {
    sql += " where id = ?";
  }
  return new Promise((resolve, reject) => {
    query(sql, id, function(err, result) {
      if (err) reject(err.message);
      resolve(result[0]);
    })
  });
}

Article.get_article_lists = function(params) {
  params['start'] = (params.page - 1) * params.length;
  var sql = "SELECT a.id,`title`,`is_html`,`reprint_url`,`private`,u.uname,\
    FROM_UNIXTIME( create_time,'%Y-%m-%d %H:%i:%S' ) as release_time FROM `tp_article` as a \
    left join tp_user as u on create_user_id = u.id";
  var map = [];
  if (params.title) {
    map.push("`title` LIKE '%" + params.title + "%'");
  }
  if (params.startime && params.endtime) {
    map.push("( `create_time` >= " + params.startime + " AND `create_time` <= " + params.endtime + "  )");
  }
  var map_str = "";
  for (var i in map) {
    map_str += (map[i] + " AND ");
  }
  if (map.length) {
    sql += " WHERE ";
  }
  map_str = map_str.substring(0, map_str.length - (" AND ")
    .length);
  sql += (map_str + " ORDER BY create_time desc LIMIT ?,?");

  return new Promise((resolve, reject) => {
    query(sql, [params.start, params.length], function(err, result) {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

Article.get_article_count = function(params) {
  var sql = 'SELECT count(*) as count from tp_article';
  var map = [];
  if (params.title) {
    map.push("`title` LIKE '%" + params.title + "%'");
  }
  if (params.startime && params.endtime) {
    map.push("( `create_time` >= " + params.startime + " AND `create_time` <= " + params.endtime + "  )");
  }
  var map_str = "";
  for (var i in map) {
    map_str += (map[i] + " AND ");
  }
  if (map.length) {
    sql += " WHERE ";
  }
  sql += (map_str.substring(0, map_str.length - (" AND ")
    .length));
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result[0]['count']);
    }, false)
  })
}

Article.insert_article = function(article) {
  var sql = "INSERT INTO `tp_article` (`title`,`content`,`reprint_url`,`private`,`create_user_id`,`create_time`)\
     VALUES (?,?,?,?,?,?)";
  return new Promise((resolve, reject) => {
    var map = [
      article.title,
      article.content,
      article.reprint_url,
      article.private,
      article.create_user_id,
      Date.parse(new Date()) / 1000
    ]
    query(sql, map, function(err, insert_id) {
      if (err) reject(err.message);
      resolve(insert_id.insertId);
    });
  })
}

Article.delete_article_by_id = function(id) {
  var sql = "delete from tp_article where id = " + id;
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

Article.update_article_by_id = function(params) {
  var sql = "update tp_article set title=?,content=?,private=?,reprint_url=?,modify_time=? where id=?";
  var map = [
    params.title,
    params.content,
    params.private,
    params.reprint_url,
    Date.parse(new Date()) / 1000,
    params.id
  ]
  return new Promise((resolve, reject) => {
    query(sql, map, function(err, result) {
      if (err) reject(err.message);
      resolve(result);
    });
  })
}

module.exports = Article;
