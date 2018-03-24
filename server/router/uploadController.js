var qiniu_model = require('../model/qiniu');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');


router.get('/fetch_file', function(req, res) {
  var qiniu = new qiniu_model();
  qiniu.fetch_file_by_url(req.query.url)
    .then(result => {
      res.json(result);
    })
})

router.post('/qiniu_base64', function(req, res) {

  var qiniu = new qiniu_model();
  qiniu.upload_img_by_base64(req.query.base64_string.replace(' ', '+'))
    .then(result => {
      res.json(typeof result == "string" ? JSON.parse(result) : result);
    }, err => {
      res.json(err);
    })

})

router.post('/local_base64', function(req, res) {
  var base64 = req.body.image;
  base64 = base64.replace(/^(data:image\/\w+;base64,)/, "");
  // base64编码图片转buffer用于fs写入
  // var buffer = new Buffer(base64, 'base64');

  // 文件类型
  var type = req.body.type;

  // 静态资源路径
  var resource_path = "/Uploads/Picture/" + moment()
    .format("YYYY-MM-DD") + "/";
  // 即将储存的文件夹地址
  var file_paths = __dirname + "/../public" + resource_path;
  // 即将储存的文件名
  var fileName = (Date.parse(new Date()) / 1000) + type;

  // 判断文件夹是否存在  不存在则新建
  if (!fs.existsSync(file_paths)) {
    fs.mkdirSync(file_paths);
  }

  // 参数二可用new Buffer(base64, 'base64'),则不需要参数三
  fs.writeFile(file_paths + fileName, base64, 'base64', (err) => {
    if (!err) {
      res.json({
        status: 0,
        path: resource_path + fileName
      })
    } else {
      res.json(err)
    }
  })
})

module.exports = router;
