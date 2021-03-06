const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');
const db_config = require('../config')
  .db;

Connection.prototype.query = function(sql, values, cb, isConsole) {
  const query = Connection.createQuery(sql, values, cb);
  query._connection = this;

  if (typeof cb !== "function") {
    isConsole = cb;
  }

  if (!(typeof sql === 'object' && 'typeCast' in sql)) {
    query.typeCast = this.config.typeCast;
  }

  if (query.sql) {
    query.sql = this.format(query.sql, query.values);
    isConsole && console.log(query.sql);
  }

  this._implyConnect();

  return this._protocol._enqueue(query);
};

const pool = mysql.createPool(db_config);

const query = function(sql, params, callback, isConsole = false) {
  typeof params == "function" && (callback = params, params = null);
  pool.getConnection(function(err, conn) {
    if (err) {
      callback(err, null, null);
    } else {
      conn.query(sql, params, function(qerr, vals, fields) {
        //释放连接
        conn.release();
        //事件驱动回调
        callback(qerr, vals, fields);
      }, isConsole);
    }
  });
};

module.exports = query;
