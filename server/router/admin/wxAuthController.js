const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../model/admin/user');
const wx_auth = require('../../model/admin/wx_auth');
const redis = require('../../model/redis_db');
const exp = require('../../config')['redis']['exp'];
const wx_conf = require('../../config')['wx'];
const common = require('../../common');
const location_key = require('../../config')['location'];


/*** 微信获取accessToken */
router.get('/jsoncode2session', (req, res) => {
  const js_code = req.query.js_code;
  const appid = wx_conf.appid;
  const secret = wx_conf.secret;
  const grant_type = wx_conf.grant_type;
  const params = {
    appid,
    secret,
    js_code,
    grant_type
  };
  common.get_request('https://api.weixin.qq.com/sns/jscode2session', params)
    .then(result => {
      res.json(result);
    }, err => {
      res.end(err);
    });
})

/*** 检测是否有微信权限 */
router.get('/checkAuth', (req, res) => {
  const OPEN_ID = req.query.OPEN_ID;
  wx_auth.checkAuth(OPEN_ID)
    .then(result => {
      if (result.length > 0) {
        res.json({
          code: 200,
          success: true,
          result
        });
      } else {
        res.json({
          code: 109,
          success: false,
          result
        });
      }
    }, err => {
      res.end(err);
    })
})

/*** 获取地址 */
router.get('/getLocation', (req, res) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const params = {
    location: longitude + ',' + latitude,
    key: location_key,
    radius: '1000',
    extensions: 'all'
  }
  common.get_request('http://restapi.amap.com/v3/geocode/regeo', params)
    .then(result => {
      res.json(result);
    }, err => {
      res.end(err);
    });
})

/*** 获取权限列表 */
router.get('/getAuthList/:page/:length', (req, res) => {
  const params = {
    page: parseInt(req.params.page) || 1,
    length: parseInt(req.params.length) || 10
  }
  wx_auth.getAuthList(params)
    .then(aaData => {
      return wx_auth.getAuthCount()
        .then(count => {
          res.json({
            code: 200,
            success: true,
            result: {
              aaData,
              count
            }
          });
        })
    }, err => res.end(err));
})

/*** 添加权限 */
router.post('/addAuth', (req, res) => {
  const params = {
    OPEN_ID: req.body.OPEN_ID,
    nick_name: req.body.nick_name,
    create_time: (Date.parse(new Date()) / 1000)
  };
  wx_auth.insert_auth(params)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      });
    }, err => res.end(err));
})

/*** 删除权限 */
router.post('/deleteAuth', (req, res) => {
  const id = req.body.id;
  wx_auth.deleteAuth(id)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => res.end(err));
})

/*** 获取权限详情 */
router.get('/getAuthDetails/:id', (req, res) => {
  const id = req.params.id;
  wx_auth.getAuthDetails(id)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => res.end(err));
})

/*** 修改权限详情 */
router.post('/updateAuth', (req, res) => {
  const params = {
    OPEN_ID: req.body.OPEN_ID,
    nick_name: req.body.nick_name,
    id: req.body.id
  };
  wx_auth.updateAuth(params)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      });
    }, err => res.end(err));
})

module.exports = router;
