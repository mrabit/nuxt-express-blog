module.exports = {
    db: {
        host: '数据库地址',
        user: '数据库账号',
        password: '数据库密码',
        database: '数据库',
        useConnectionPooling: true
    },
    qiniu: {
        accessKey: "七牛accessKey",
        secretKey: "七牛secretKey",
        bucket: "mrabit",
        domain: "七牛自定义域名"
    },
    redis: {
        host: 'redis地址',
        port: 6379,
        auth_pass: 'redis密码',
        exp: 60 * 60
    },
    domain: '网站地址',
    location: '高德地图key'
}