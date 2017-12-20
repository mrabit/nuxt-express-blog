var query = require('../db');

module.exports = {
    checkAuth(OPEN_ID) {
        var sql = 'select * from tp_wx where OPEN_ID = ?';
        return new Promise((resolve, reject) => {
            query(sql, OPEN_ID, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        })
    },
    getAuthList(params) {
        var sql = 'select *,FROM_UNIXTIME( create_time,"%Y-%m-%d %H:%i:%S" ) as release_time from tp_wx ORDER BY create_time desc LIMIT ?,?';
        params['start'] = (params.page - 1) * params.length;
        var map = [
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
    getAuthCount() {
        var sql = 'select count(*) as count from tp_wx';
        return new Promise((resolve, reject) => {
            query(sql, (err, result) => {
                if (err) reject(err);
                resolve(result[0]['count']);
            })
        })
    },
    getAuthDetails(id) {
        var sql = 'select id, OPEN_ID, nick_name from tp_wx where id=?';
        return new Promise((resolve, reject) => {
            query(sql, id, (err, result) => {
                if (err) reject(err);
                resolve(result.length > 0 ? result[0] : {});
            }, true)
        })
    },
    insert_auth(params) {
        var sql = 'INSERT INTO `tp_wx` (`OPEN_ID`,`nick_name`,`create_time`)\
        VALUES (?,?,?)';
        var map = [
            params.OPEN_ID,
            params.nick_name,
            params.create_time
        ];
        return new Promise((resolve, reject) => {
            query(sql, map, (err, result) => {
                if (err) reject(err);
                resolve(result);
            }, true)
        })
    },
    deleteAuth(id) {
        var sql = "delete from tp_wx where id = " + id;
        return new Promise((resolve, reject) => {
            query(sql, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        })
    },
    updateAuth(params) {
        var sql = 'update tp_wx set OPEN_ID=?, nick_name =? where id=?';
        var map = [
            params.OPEN_ID,
            params.nick_name,
            params.id
        ]
        return new Promise((resolve, reject) => {
            query(sql, map, (err, result) => {
                if (err) reject(err);
                resolve(result);
            }, true)
        })
    }
}