const express = require('express');
const router = express.Router();
const ALIDNS = require('alidns-nodejs');
const config = require('../../config');
const common = require('../../common');

const client = ALIDNS({
  accesskeyId: config.ecs.accessKeyId,
  accesskeySecret: config.ecs.secretAccessKey,
})

router.get('/UpdateDomainRecord', function(req, res) {
  client.queryData({
    Action: 'UpdateDomainRecord',
    RecordId: '3896345047864320',
    RR: "router",
    Type: "A",
    Value: common.getClientIp(req)
  }, function(err, result) {
    if (err) res.end(err);
    res.json(result);
  })
})

module.exports = router;
