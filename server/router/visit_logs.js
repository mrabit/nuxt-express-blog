const common = require('../common');
const Visitor = require('../model/index/visitor');

module.exports = (req, res, next) => {
  const reg = /^\/($|details|list|archives$|tags$|bing|about$|links$)[\/\?=0-9a-z_]*/;
  const referrer = req.headers.referer || "";
  const ip = common.getClientIp(req);
  if (req.path.search(reg) < 0) {
    return next();
  }
  // bing接口上方正则有缺陷
  if (req.path.search(/\/bing[\/\?=0-9a-z_]*/) >= 0 && req.path.search(/^\/bing[\/0-9]*$/) < 0) {
    return next();
  }

  const visit_time = Date.parse(new Date()) / 1000;
  Visitor.check_visitor(ip)
    .then(d => {
      // 上次访问记录小于一小时
      if (d && visit_time - d.visit_time < 3600) {
        return "";
      }
      return Visitor.insert_visitor({
        ip,
        referrer,
        visit_url: req.path,
        visit_time
      });
    })
    .then(_ => next())
    .catch(e => {
      res.status(403)
        .json(e);
    });
}
