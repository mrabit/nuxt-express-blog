var websocket = require('ws');
var common = require('./common');
var QRCode = require('qrcode');
var redis = require('./model/redis_db');
var domain = require('./config').domain;
var User = require('./model/admin/user');

var wss;

var socket_type = {
    // 小程序socket
    '/?admin': 'admin',
    // 登录socket
    '/?login': 'login',
    // 认证socket
    '/?token': 'token'
}
var prototype = {
    // socket客户端类型为login
    login: (ws, guid) => {
        console.log(guid);
        ws.guid = guid;
        //设置唯一的二维码key值,存入redis,过期时间为5分钟
        redis.set('qrcode_guid', guid).then(_ => {
            return redis.expire('qrcode_guid', 60 * 5);
        }).then(_ => {
            // 生成二维码返回
            QRCode.toDataURL(guid, function (err, url) {
                ws.send(JSON.stringify({
                    code: 200,
                    success: true,
                    key: url
                }));
            })
        });
    },
    // 小程序socket发送的登录请求认证
    admin: (ws, guid) => {
        // 判断当前guid是否过期
        redis.validator('qrcode_guid', guid).then(flag => {
            if (!flag) {
                ws.send('二维码已过期,请重试.');
                return false;
            }
            //进行登录认证
            var number = 0;
            wss.clients.forEach(client => {
                //客户端为login连接并且guid值对应
                if (client.type == 'login' && client.guid === guid) {
                    number++;

                    User.get_passwd_by_id().then(profile => {
                        return profile.upwd;
                    }).then(upwd => {
                        // 模拟post登录,防止和密码登录代码重复造成冗余代码(PS: 还不是因为懒)
                        return common.post_request(domain + '/api/login', {
                            uname: 'admin',
                            upwd
                        }, ws.ip);
                    }).then(result => {
                        client.send(JSON.stringify(result));
                        ws.send('登录成功.')
                    })
                }
            });
            // 请求登录的客户端已离线, 发送提醒消息到小程序
            if (!number) {
                ws.send('登录请求无效,获取登录信息失败.')
            }
        })
    },
    // 已登录, 记录token值, 方便广播踢人认证
    token: (ws, token) => {
        ws.token = token;
    }
}
module.exports = {
    // 在/bin/www文件内初始化websocket
    init: (server) => {
        wss = new websocket.Server({
            server
        });

        wss.on('connection', (ws, req) => {

            ws.key = req.headers['sec-websocket-key'];
            ws.type = socket_type[req.url];
            ws.ip = common.getClientIp(req);
            console.log(ws.ip);
            console.log('connected:', wss.clients.size);
            console.log('type:', ws.type);

            ws.on('message', (msg) => {
                prototype[ws.type](ws, msg);
            })

            ws.on('close', _ => {
                console.log('someone closed the connection,connected:', wss.clients.size)
            })
        })
    },
    // 广播消息 ws客户端token校验,非当前token直接踢下线
    broadcast: (ip, token) => {
        wss.clients.forEach(client => {
            // 客户端类型为token,会被提示下线
            if (client.type == "token" && client.token != token)
                client.send(JSON.stringify({
                    code: 107,
                    message: '您已被' + ip + '挤下线'
                }));
        })
    }
}