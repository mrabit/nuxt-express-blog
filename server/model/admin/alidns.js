let query = require('../db');
const alidnsNodeJS = require('alidns-nodejs');
const config = require('../../config');
const common = require('../../common');


const client = alidnsNodeJS({
  accesskeyId: config.ecs.accessKeyId,
  accesskeySecret: config.ecs.secretAccessKey,
})

let ALIDNS = _ => {}

/*** 获取域名列表
 * @param {*} _ 
 */
ALIDNS.DescribeDomains = _ => {
  return new Promise((resolve, reject) => {
    client.queryData({
      Action: 'DescribeDomains'
    }, function(err, result) {
      if (err) reject(err);
      resolve(result);
    })
  })
}

/*** 获取解析记录列表
 * @param {*} params 
 */
ALIDNS.DescribeDomainRecords = params => {
  return new Promise((resolve, reject) => {
    params['Action'] = 'DescribeDomainRecords';
    client.queryData(params, function(err, result) {
      if (err) reject(err);
      resolve(result);
    })
  })
}

/*** 设置解析记录状态
 * @param {*} params 
 */
ALIDNS.SetDomainRecordStatus = params => {
  return new Promise((resolve, reject) => {
    params['Action'] = 'SetDomainRecordStatus';
    client.queryData(params, function(err, result) {
      if (err) reject(err);
      resolve(result);
    })
  })
}

module.exports = ALIDNS;
