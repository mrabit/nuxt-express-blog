const request = require('request');

module.exports = {
  getClientIp: (req) => {
    return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  },
  get_request: (url, params) => {
    const options = {
      method: 'GET',
      url: url,
      headers: {
        'Content-type': 'text/html; charset=utf-8'
      },
      qs: params
    }
    return new Promise((resolve, reject) => {
      request(options, (err, response, body) => {
        if (err) reject(err);
        resolve(typeof body == 'object' ? body : JSON.parse(body));
      })
    })
  },
  post_request: (url, params, ip) => {
    const options = {
      url: url,
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: params
    };
    if (ip) {
      options.headers['X-Forwarded-For'] = ip;
    }
    return new Promise((resolve, reject) => {
      request(options, (err, response, body) => {
        if (err) reject(err);
        resolve(typeof body == 'object' ? body : JSON.parse(body));
      })
    })
  }
}
