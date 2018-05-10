const query = require('../db');

const Article_Tags = _ => {}

/*** 添加文章标签
 * @param int $article_id 文章id
 * @param array $tags_arr 标签id数组
 * @return 
 */
Article_Tags.add_article_tags = function(article_id, tags_arr) {
  let sql = "INSERT INTO `tp_article_tags` (`article_id`,`tags_id`) VALUES ";
  tags_arr.forEach(v => {
    sql += ("('" + article_id + "','" + v.id + "'),");
  })
  sql = sql.substr(0, sql.length - 1);
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

/*** 获取文章标签
 * @param int $article_id 文章id
 * @return 指定文章标签数组
 */
Article_Tags.get_tagsName_by_articleId = function(article_id) {
  const sql = 'select tt.tags_name,tt.id from tp_article_tags as tat\
     LEFT JOIN tp_tags as tt on tt.id = tat.tags_id where article_id = ' + article_id;
  return new Promise((resolve, reject) => {
    query(sql, function(err, result) {
      if (err) reject(err);
      resolve(result);
    })
  });
}

/*** 删除文章标签
 * @param int $article_id 文章id
 * @return 
 */
Article_Tags.delete_tags_by_articleId = function(article_id) {
  const sql = "delete from tp_article_tags where article_id = " + article_id;
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

module.exports = Article_Tags;
