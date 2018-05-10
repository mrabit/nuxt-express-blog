const query = require('../db');

const User = _ => {}

/*** 登录
 * @param array $params  参数: uname upwd
 * @return 登录用户信息
 */
User.login = params => {
  const sql = "select * from tp_user where uname = ? and upwd = ?";
  return new Promise((resolve, reject) => {
    query(sql, [params.uname, params.upwd], (err, result) => {
      if (err) reject(err);
      resolve(result.length > 0 ? result[0] : {});
    })
  })
}

/*** 获取用户详情
 * @param int $id  用户id
 * @return array 用户详情数据
 */
User.get_profile_by_id = (id = 1) => {
  const sql = "select id, uname, blog_name, weibo, github, twitter, user_header_img, last_login_ip, last_login_time from tp_user where id = ?";
  return new Promise((resolve, reject) => {
    query(sql, id, (err, result) => {
      if (err) reject(err);
      resolve(result.length > 0 ? result[0] : {});
    })
  })
}

/*** 获取用户密码
 * @param int $id  用户id
 * @return 用户密码
 */
User.get_passwd_by_id = (id = 1) => {
  const sql = "select upwd from tp_user where id = ?";
  return new Promise((resolve, reject) => {
    query(sql, id, (err, result) => {
      if (err) reject(err);
      resolve(result.length > 0 ? result[0] : {});
    })
  })
}

/*** 修改用户详情
 * @param array $params
 * @return
 */
User.edit_profile = (params) => {
  const sql = "update tp_user set uname=?,blog_name=?,weibo=?,github=?,twitter=?,user_header_img=? where id=?";
  const map = [
    params.uname,
    params.blog_name,
    params.weibo,
    params.github,
    params.twitter,
    params.user_header_img,
    params.id
  ]
  return new Promise((resolve, reject) => {
    query(sql, map, function(err, result) {
      if (err) reject(err.message);
      resolve(result);
    });
  })
}

/*** 获取用户描述
 * @param int $id 用户id
 * @return
 */
User.get_about_by_id = (id = 1) => {
  const sql = 'select about from tp_user where id = ?';
  return new Promise((resolve, reject) => {
    query(sql, id, (err, result) => {
      if (err) reject(err);
      resolve(result.length > 0 ? result[0] : {});
    })
  })
}

/*** 修改用户描述
 * @param string $about 用户描述
 * @param int $id 用户id
 * @return
 */
User.edit_about = (about, id = 1) => {
  const sql = 'update tp_user set about=? where id=?';
  return new Promise((resolve, reject) => {
    query(sql, [about, id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    })
  })
}

/*** 修改用户密码
 * @param array $params 参数: newPasswd 新密码 oldPasswd 旧密码
 * @param int $id 用户id
 * @return
 */
User.change_passwd = (params, id = 1) => {
  const sql = 'update tp_user set upwd=? where upwd = ? and id=?';
  const map = [
    params.newPasswd,
    params.oldPasswd,
    id
  ];
  return new Promise((resolve, reject) => {
    query(sql, map, (err, result) => {
      if (err) reject(err);
      resolve(result);
    })
  })
}

/*** 修改用户上次登录时间,ip
 * @param int $id 用户id
 * @param int $ip 登录ip
 * @return
 */
User.update_login_time_by_id = (id, ip) => {
  const sql = 'update tp_user set last_login_ip=?, last_login_time=? where id=?';
  const map = [
    ip,
    Date.parse(new Date()) / 1000,
    id
  ]
  return new Promise((resolve, reject) => {
    query(sql, map, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  })
}

module.exports = User;
