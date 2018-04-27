const query = require('../db');
// const ALY = require('aliyun-sdk');
var Metrics = require("aliyun-metrics");
const moment = require('moment');
const { ecs: ecsConf } = require('../../config');

// var ecs = new ALY.ECS({
//   accessKeyId: ecsConf.accessKeyId,
//   secretAccessKey: ecsConf.secretAccessKey,
//   endpoint: 'https://ecs.aliyuncs.com',
//   apiVersion: '2014-05-26'
// });
var client = new Metrics({
  accesskeyId: ecsConf.accessKeyId,
  accesskeySecret: ecsConf.secretAccessKey,
})

var ECS = params => {
  return new Promise((resolve, reject) => {
    client.queryData({
      project: "acs_ecs_dashboard",
      metric: params.metric,
      period: 60,
      startTime: params.startTime || moment.utc()
        .subtract(1, 'hour')
        .format(),
      endTime: params.endTime || moment.utc()
        .format(),
      dimensions: `{instanceId:'${ecsConf.InstanceId}'}`
    }, function(error, data) {
      if (error || !data)
        reject(error || 'data is null');
      else
        resolve(data);
    });
  })
}



module.exports = ECS;
