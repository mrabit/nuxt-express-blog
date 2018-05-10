const query = require('../db');

module.exports = {
  /*** 获取友链
   * @param array $params 参数:page 页数  length 每页长度
   * @return array 友链数组
   */
  getLinksList: params => {
    const sql = 'select *,FROM_UNIXTIME( create_time,"%Y-%m-%d %H:%i:%S" ) as release_time from tp_links ORDER BY create_time desc LIMIT ?,?';
    params['start'] = (params.page - 1) * params.length;
    const map = [
      params.start,
      params.length
    ]
    return new Promise((resolve, reject) => {
      query(sql, map, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    })
  },
  /*** 获取友链总数
   * @param 
   * @return int 总数
   */
  getLinksCount: _ => {
    const sql = 'select count(*) as count from tp_links';
    return new Promise((resolve, reject) => {
      query(sql, (err, result) => {
        if (err) reject(err);
        resolve(result[0]['count']);
      })
    })
  },
  /*** 获取友链详情
   * @param $int 友链id
   * @return array 详情
   */
  getLinksDetails: id => {
    const sql = 'select id, site_name, site_url from tp_links where id=?';
    return new Promise((resolve, reject) => {
      query(sql, id, (err, result) => {
        if (err) reject(err);
        resolve(result.length > 0 ? result[0] : {});
      })
    })
  },
  /*** 新增友链
   * @param $params 友链字段: site_name 网站名称 site_url 网站地址 create_time 创建时间
   * @return 
   */
  insert_links: params => {
    const sql = 'INSERT INTO `tp_links` (`site_name`,`site_url`,`create_time`)\
        VALUES (?,?,?)';
    const map = [
      params.site_name,
      params.site_url,
      params.create_time
    ];
    return new Promise((resolve, reject) => {
      query(sql, map, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    })
  },
  /*** 删除友链
   * @param $id 友链id
   * @return
   */
  deleteLinks: id => {
    const sql = "delete from tp_links where id = " + id;
    return new Promise((resolve, reject) => {
      query(sql, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    })
  },
  /*** 更新友链
   * @param $params 友链字段: site_name 网站名称 site_url 网站地址 id 友链id
   * @return 
   */
  updateLinks(params) {
    const sql = 'update tp_links set site_name=?, site_url =? where id=?';
    const map = [
      params.site_name,
      params.site_url,
      params.id
    ]
    return new Promise((resolve, reject) => {
      query(sql, map, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    })
  }
}
