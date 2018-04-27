let query = require('../db');

let Article = _ => {}

Article.get_article_by_id = id => {
  let sql = 'SELECT id,title,reprint_url,private,content from tp_article';
  if (id) {
    sql += " where id = ?";
  }
  return new Promise((resolve, reject) => {
    query(sql, id, (err, result) => {
      if (err) reject(err.message);
      resolve(result[0]);
    })
  });
}

Article.get_article_lists = params => {
  params['start'] = (params.page - 1) * params.length;
  let sql = "SELECT a.id,`title`,`is_html`,`reprint_url`,`private`,u.uname,\
    FROM_UNIXTIME( create_time,'%Y-%m-%d %H:%i:%S' ) as release_time FROM `tp_article` as a \
    left join tp_user as u on create_user_id = u.id";
  let map = [];
  if (params.title) {
    map.push("`title` LIKE '%" + params.title + "%'");
  }
  if (params.startime && params.endtime) {
    map.push("( `create_time` >= " + params.startime + " AND `create_time` <= " + params.endtime + "  )");
  }
  let map_str = "";
  for (let i in map) {
    map_str += (map[i] + " AND ");
  }
  if (map.length) {
    sql += " WHERE ";
  }
  map_str = map_str.substring(0, map_str.length - (" AND ")
    .length);
  sql += (map_str + " ORDER BY create_time desc LIMIT ?,?");

  return new Promise((resolve, reject) => {
    query(sql, [params.start, params.length], (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

Article.get_article_count = params => {
  let sql = 'SELECT count(*) as count from tp_article';
  let map = [];
  if (params.title) {
    map.push("`title` LIKE '%" + params.title + "%'");
  }
  if (params.startime) {
    map.push("`create_time` >= " + params.startime);
  }
  if (params.endtime) {
    map.push("`create_time` <= " + params.endtime);
  }
  let map_str = "";
  for (let i in map) {
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

Article.insert_article = article => {
  let sql = "INSERT INTO `tp_article` (`title`,`content`,`reprint_url`,`private`,`create_user_id`,`create_time`)\
     VALUES (?,?,?,?,?,?)";
  return new Promise((resolve, reject) => {
    let map = [
      article.title,
      article.content,
      article.reprint_url,
      article.private,
      article.create_user_id,
      Date.parse(new Date()) / 1000
    ]
    query(sql, map, (err, insert_id) => {
      if (err) reject(err.message);
      resolve(insert_id.insertId);
    });
  })
}

Article.delete_article_by_id = id => {
  let sql = "delete from tp_article where id = " + id;
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

Article.update_article_by_id = params => {
  let sql = "update tp_article set title=?,content=?,private=?,reprint_url=?,modify_time=? where id=?";
  let map = [
    params.title,
    params.content,
    params.private,
    params.reprint_url,
    Date.parse(new Date()) / 1000,
    params.id
  ]
  return new Promise((resolve, reject) => {
    query(sql, map, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    });
  })
}

Article.get_article_by_visitor = params => {
  let sql = 'select id,title,visit_number from tp_article order by visit_number desc limit 0,15';
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

module.exports = Article;
