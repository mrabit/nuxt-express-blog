let query = require('../db');

let Article = _ => {}

/*** 通过id查找指定文章
 * @param int   id  指定文章id
 * @return promise  返回需要的数据
 */
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

/*** 获取文章列表
 * @param array $params   参数:page 当前页  length 长度
 * @return mixed    获取到的Array数据
 */
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

/*** 获取文章总条数
 * @param array $params  
 * @return int    满足条件的文章总条数
 */
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

/*** 新增文章
 * @param array $article 
 * @return int 新增文章id
 */
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

/*** 通过文章id删除文章
 * @param int $id 文章id 
 * @return 删除状态
 */
Article.delete_article_by_id = id => {
  let sql = "delete from tp_article where id = " + id;
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

/*** 通过文章id更新文章
 * @param int $id 文章id 
 * @return 更新状态
 */
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

/*** 获取文章阅读排行
 * @param null
 * @return 文章阅读排行数组
 */
Article.get_article_by_visitor = _ => {
  let sql = 'select id,title,visit_number from tp_article order by visit_number desc limit 0,15';
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

module.exports = Article;
