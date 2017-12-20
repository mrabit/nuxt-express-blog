var query = require('../db');
var util = require('util');

var ArticleTags = _ => {}


ArticleTags.get_tags = function() {
    var sql = "SELECT b.id,b.tags_name,count(a.id) as counts FROM `tp_article_tags` right join\
     tp_tags as b on tags_id = b.id left join tp_article as a on article_id = a.id and a.private\
      <> '1'  GROUP BY tags_name ORDER BY counts desc";
    return new Promise((resolve, reject) => {
        query(sql, (err, result) => {
            if (err) reject(err.message);
            resolve(result);
        })
    })
}

module.exports = ArticleTags;