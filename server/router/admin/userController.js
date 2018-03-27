var express = require('express');
var router = express.Router();
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var User = require('../../model/admin/user');
var redis = require('../../model/redis_db');
var exp = require('../../config')['redis']['exp'];
var common = require('../../common');
// var websocket = require('../../websocket');

router.post('/login', (req, res) => {
  // 密码用前台md5加密发送过来,因为可能会用二维码扫码登录
  var user = {
    uname: req.body.uname,
    upwd: req.body.upwd
  }
  User.login(user)
    .then(result => {
      // 登录失败
      if (result.uname != user.uname || result.upwd != user.upwd) {
        return Promise.reject({
          success: false,
          code: 101,
          message: '登录失败,帐号或密码错误.'
        });
      } else {
        // 生成token
        var token = jwt.sign({
          uname: result.uname,
          upwd: result.upwd,
          id: result.id,
        }, 'mrabit', {
          expiresIn: exp
        })
        // 设置token到redis
        return redis.set(req.body.uname, token)
          .then(_ => {
            // 设置redis值的过期时间
            return redis.expire(req.body.uname, exp)
              .then(_ => {
                return {
                  result,
                  token
                }
              });
          });
      }
    }, err => {
      res.json(err);
    })
    .then(data => {
      // 更新登录状态时间
      // websocket模拟请求可能会带上服务器的ip 用,分割
      var ip = common.getClientIp(req)
        .split(',')[0];
      return User.update_login_time_by_id(data.result.id, ip)
        .then(status => {
          if (status.changeRows < 1) {
            return Promise.reject({
              code: 106,
              success: false,
              message: '登录信息更新失败.'
            })
          }
          // 登录成功,踢出非当前token登录ip
          // websocket.broadcast(ip, data.token);

          res.json({
            code: 200,
            success: true,
            message: '登录成功.',
            token: data.token,
            user: data.result
          })
        })
    })
    .catch(err => {
      res.json(err)
    })
})

router.post('/logout', (req, res) => {
  var key = req.body.key;
  redis.del(key)
    .then(result => {
      res.json({
        success: true,
        code: 200
      });
    }, err => {
      res.sendStatus(403)
        .json(err);
    })
})

router.get('/user/profile', (req, res) => {
  User.get_profile_by_id(req.query.id)
    .then(result => {
      res.json({
        success: true,
        code: 200,
        result
      })
    }, err => {
      res.json(err)
    })
})

router.post('/user/edit_profile', (req, res) => {
  User.edit_profile(req.body)
    .then(result => {
      res.json({
        success: true,
        code: 200,
        result
      });
    }, err => {
      res.json(err);
    })
})

router.get('/user/about', (req, res) => {
  User.get_about_by_id()
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      });
    }, err => res.end(err));
})

router.post('/user/edit_about', (req, res) => {
  var about = req.body.about;
  User.edit_about(about)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => {
      res.end(err);
    })
})

router.post('/user/changePasswd', (req, res) => {
  var params = {
    oldPasswd: md5(req.body.oldPasswd || ''),
    newPasswd: md5(req.body.newPasswd || '')
  }
  User.change_passwd(params)
    .then(result => {
      if (result.changedRows) {
        res.json({
          code: 200,
          success: true,
          result
        })
      } else {
        res.json({
          code: 108,
          success: false,
          message: '旧密码错误,请重新输入.'
        })
      }

    }, err => {
      res.end(err);
    })
})

router.post('/check_token', (req, res) => {
  res.json({
    success: true,
    code: 200
  })
})

module.exports = router;
