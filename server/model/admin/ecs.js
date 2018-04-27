const query = require('../db');
const ALY = require('aliyun-sdk');
const moment = require('moment');
const { ecs: ecsConf } = require('../../config');

var ecs = new ALY.ECS({
  accessKeyId: ecsConf.accessKeyId,
  secretAccessKey: ecsConf.secretAccessKey,
  endpoint: 'https://ecs.aliyuncs.com',
  apiVersion: '2014-05-26'
});

var ECS = _ => {}

function down(x, y) {
  return moment(x.TimeStamp)
    .unix() > moment(y.TimeStamp)
    .unix() ? 1 : -1
}

ECS.describeInstanceMonitorData = params => {
  console.log(params);
  return new Promise((resolve, reject) => {
    ecs.describeInstanceMonitorData({
      InstanceId: ecsConf.InstanceId,
      StartTime: params.StartTime || moment.utc()
        .subtract(1, 'hour')
        .format(),
      EndTime: params.EndTime || moment.utc()
        .format()
    }, function(err, res) {
      if (err) return reject(err);
      res.MonitorData.InstanceMonitorData.sort(down);
      resolve(res);
    });
  })
}


module.exports = ECS;
