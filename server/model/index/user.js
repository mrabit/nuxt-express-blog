const query = require('../db');

const User = _ => {};


User.get_profile = (id) => {
  const sql = 'select id, uname, blog_name, about, weibo, github, twitter, user_header_img from tp_user where id=?';
  return new Promise((resolve, reject) => {
    query(sql, id, (err, result) => {
      if (err) reject(err);
      resolve(result.length > 0 ? result[0] : {});
    })
  })
}

module.exports = User;
