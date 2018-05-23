let query = require('../db');
const alidnsNodeJS = require('alidns-nodejs');
const config = require('../../config');
const common = require('../../common');


const client = alidnsNodeJS({
  accesskeyId: config.ecs.accessKeyId,
  accesskeySecret: config.ecs.secretAccessKey,
})

let ALIDNS = params => {
  return new Promise((resolve, reject) => {
    client.queryData(params, function(err, result) {
      if (err) reject(err);
      resolve(result);
    })
  })
}

module.exports = ALIDNS;
