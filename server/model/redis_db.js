var redis = require('redis');
var db_config = require('../config').redis;
var redisClient = redis.createClient(db_config.port, db_config.host, {
    auth_pass: db_config.auth_pass
});

redisClient.on('error', function(err) {
    console.log('Error ' + err);
});

redisClient.on('connect', function() {
    console.log('Redis is ready');
});

module.exports = {
    redisClient: redisClient,
    // 新增键值
    set: (key, token) => {
        key = "blog_" + key;
        return new Promise((resolve, reject) => {
            redisClient.set(key, token, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        })
        redis.redisClient.set(req.body.uname, token);
    },
    // 删除当前指定键值
    del: (key) => {
        key = "blog_" + key;
        return new Promise((resolve, reject) => {
            redisClient.del(key, (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        });
    },
    // 当前键是否存在
    exists: (key) => {
        key = "blog_" + key;
        return new Promise((resolve, reject) => {
            redisClient.exists(key, (err, result) => {
                if (err) reject(err);
                resolve(!!result);
            })
        })
    },
    // 设置(更新)过期时间
    expire: (key, time = 60) => {
        key = "blog_" + key;
        return new Promise((resolve, reject) => {
            redisClient.expire(key, time, (err, result) => {
                if (err) reject(err);
                resolve(!!result);
            })
        })
    },
    // 验证是否与数据库中token一致
    validator: (key, token) => {
        key = "blog_" + key;
        return new Promise((resolve, reject) => {
            redisClient.get(key, (err, result) => {
                if (err) reject(err);
                resolve(token == result);
            })
        })
    }
}