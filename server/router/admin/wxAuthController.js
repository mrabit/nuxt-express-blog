var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../../model/admin/user');
var wx_auth = require('../../model/admin/wx_auth');
var redis = require('../../model/redis_db');
var exp = require('../../config')['redis']['exp'];
var wx_conf = require('../../config')['wx'];
var common = require('../../common');
var location_key = require('../../config')['location'];


router.get('/jsoncode2session', (req, res) => {
  var js_code = req.query.js_code;
  var appid = wx_conf.appid;
  var secret = wx_conf.secret;
  var grant_type = wx_conf.grant_type;
  var params = {
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

router.get('/checkAuth', (req, res) => {
  var OPEN_ID = req.query.OPEN_ID;
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

router.get('/getLocation', (req, res) => {
  var latitude = req.query.latitude;
  var longitude = req.query.longitude;
  var params = {
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

router.get('/getAuthList/:page/:length', (req, res) => {
  var params = {
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

router.post('/addAuth', (req, res) => {
  var params = {
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

router.post('/deleteAuth', (req, res) => {
  var id = req.body.id;
  wx_auth.deleteAuth(id)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => res.end(err));
})

router.get('/getAuthDetails/:id', (req, res) => {
  var id = req.params.id;
  wx_auth.getAuthDetails(id)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => res.end(err));
})

router.post('/updateAuth', (req, res) => {
  console.log(req)
  var params = {
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
