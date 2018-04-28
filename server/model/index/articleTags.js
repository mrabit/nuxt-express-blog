const query = require('../db');
const util = require('util');

const ArticleTags = _ => {}


ArticleTags.get_tags = function() {
  const sql = `SELECT any_value(b.id) as id,b.tags_name,any_value(count(a.id)) as counts FROM tp_article_tags right join
    tp_tags as b on tags_id = b.id left join tp_article as a on article_id = a.id and a.private
     <> '1'  GROUP BY tags_name ORDER BY counts desc`;
  return new Promise((resolve, reject) => {
    query(sql, (err, result) => {
      if (err) reject(err.message);
      resolve(result);
    })
  })
}

ArticleTags.get_tagsName_by_articleId = function(article_id) {
  const sql = 'select tt.tags_name,tt.id from tp_article_tags as tat\
     LEFT JOIN tp_tags as tt on tt.id = tat.tags_id where article_id = ' + article_id;
  return new Promise((resolve, reject) => {
    query(sql, function(err, result) {
      if (err) reject(err);
      resolve(result);
    })
  });
}
ArticleTags.get_tagsName_by_tagsId = function(tagsId) {
  const sql = 'SELECT * from tp_tags where id = ' + tagsId;
  return new Promise((resolve, reject) => {
    query(sql, function(err, result) {
      if (err) reject(err);
      resolve((result[0] || {})['tags_name']);
    }, true)
  });
}


module.exports = ArticleTags;
