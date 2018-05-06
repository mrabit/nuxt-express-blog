const query = require('../db');

const Article = params => {
  this.id = params.id;
}

/*** 通过id查找指定文章
 * @param int   id  指定文章id
 * @return promise  返回需要的数据
 */
Article.get_article_by_id = function(id) {
  let sql = 'SELECT ta.id,title,reprint_url,is_html,content,tu.uname,visit_number,\
        FROM_UNIXTIME( create_time, \'%Y-%m-%d %H:%i:%s\' ) as create_time,\
        FROM_UNIXTIME( create_time, \'%m月%d,%Y\' ) as release_time,\
        FROM_UNIXTIME( modify_time, \'%Y-%m-%d %H:%i:%s\' ) as modify_time from tp_article as ta\
        LEFT JOIN tp_user as tu on tu.id = ta.create_user_id';
  if (id) {
    sql += " where ta.id = ?";
  }
  return new Promise((resolve, reject) => {
      query(sql, id, function(err, result) {
        if (err) reject(err.message);
        resolve({
          article: result,
          id: id
        });
      })
    })
    .then(this.get_article_adjoin_by_id);
}

/*** 获取相邻的文章id
 * @param array id                  当前文章的id
 * @param array article             当前文章的内容
 * @return array {article, adjoin}  获取到的Array数据
 */
Article.get_article_adjoin_by_id = params => {
  const sql = "SELECT * FROM ( SELECT `id`,`title` FROM `tp_article` WHERE `id` < ? AND `private` <> 1 ORDER BY id desc LIMIT 1   )\
     t1 UNION ALL SELECT * FROM ( SELECT `id`,`title` FROM `tp_article` WHERE `id` > ? AND `private` <> 1 ORDER BY id LIMIT 1   ) t2";
  return new Promise((resolve, reject) => {
    query(sql, [params.id, params.id], function(err, result) {
      if (err) reject(err.message);
      //只有一条数据
      if (result.length == 1) {
        const article_id = result[0]['id'];
        if (params.id > article_id) {
          //上条数据,在其末尾添加空数组
          result.push(null);
        } else {
          //下条数据,在其开头添加空数组
          result.unshift(null);
        }
      }
      resolve({
        article: params.article,
        adjoin: result
      });
    });
  })
}

/*** 获取文章列表
 * @param array $params   参数:page 当前页  length 长度
 * @return mixed    获取到的Array数据
 */
Article.get_article_lists = params => {
  params['start'] = (params.page - 1) * params.length;
  const sql = "SELECT a.id,`title`,`reprint_url`,`content`,`is_html`,u.uname,visit_number,FROM_UNIXTIME( create_time,'%Y-%m-%d %H:%i:%s' )\
      as create_time,FROM_UNIXTIME( create_time,'%m月%d,%Y' ) as release_time FROM `tp_article` as\
       a left join tp_user as u on create_user_id = u.id  WHERE `private` <> '1' ORDER BY create_time\
        desc LIMIT ?,?";
  return new Promise((resolve, reject) => {
    query(sql, [params.start, params.length], function(err, result) {
      if (err) reject(err.message)
      resolve(result);
    });
  })
}

/*** 获取文章总条数
 * @param array $params  
 * @return int    满足条件的文章总条数
 */
Article.get_article_count = _ => {
  const sql = 'SELECT count(*) as count from tp_article where private != 1';
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result[0]['count']);
    })
  })
}

/*** 通过标签获取文章列表
 * @param {*} params 
 * @return array 满足条件的文章列表
 */
Article.get_article_lists_by_tagsId = params => {
  params['start'] = (params.page - 1) * params.length;
  const sql = "SELECT a.id,`title`,`reprint_url`,`content`,`is_html`,u.uname,visit_number,FROM_UNIXTIME( create_time,' %Y-%m-%d %H:%i:%s' ) \
     as create_time,FROM_UNIXTIME( create_time,' %m月%d,%Y' ) as release_time FROM `tp_article`  as a left join tp_user \
      as u on create_user_id = u.id inner join tp_article_tags as t on t.article_id = a.id  WHERE `tags_id` = ? AND \
       `private` <> '1' ORDER BY create_time desc LIMIT ?,?  ";
  return new Promise((resolve, reject) => {
    query(sql, [params.tags_id, params.start, params.length], function(err, result) {
      if (err) reject(err.message);
      resolve(result)
    })
  })
}

/*** 通过标签统计文章总数
 * @param {*} tags_id 
 * @return int 统计文章总数
 */
Article.get_article_count_by_tagsId = tags_id => {
  const sql = "SELECT COUNT(*) AS count FROM `tp_article`  as a left join tp_user as u on create_user_id = u.id\
     inner join tp_article_tags as t on t.article_id = a.id  WHERE `tags_id` = ? AND `private` <> '1' LIMIT 1 ";
  return new Promise((resolve, reject) => {
    query(sql, tags_id, function(err, result) {
      if (err) reject(err.message);
      resolve(result[0]['count'])
    })
  })
}

/*** 归档
 * @return mixed
 */
Article.get_article_by_archives = _ => {
  const sql = 'SELECT FROM_UNIXTIME( create_time, "%Y年%m月" ) as create_time,COUNT( * ) as count\
        ,GROUP_CONCAT(id) as id FROM `tp_article` GROUP BY FROM_UNIXTIME( create_time, "%Y年%m月" )\
         ORDER BY create_time DESC';
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

/*** 查找存在指定条件的所有数据
 * @param $param
 * @return mixed
 */
Article.get_article_by_in = params => {
  const sql = "select id,title,FROM_UNIXTIME( create_time,' %Y-%m-%d' ) as create_time from tp_article where " + params.key + " in (" + params.val + ")\
     and private <> 1 order by create_time desc";
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

/*** sitemap使用文章id
 * @return object 文章id集合
 */
Article.get_article_all_id = _ => {
  const sql = 'SELECT id from tp_article where private != 1';
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

/*** 更新文章浏览次数
 * @param {*} id 
 */
Article.update_visit_number_by_id = id => {
  const sql = "update tp_article set visit_number = visit_number + '1' WHERE id = ?";
  return new Promise((resolve, reject) => {
    query(sql, [id], (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

module.exports = Article;
