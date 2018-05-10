const express = require('express');
const router = express.Router();
const Visitor = require('../../model/admin/visitor');
const moment = require('moment');

/*** 获取今日访客,访客总人数 */
router.get('/get_visitor_count', (req, res) => {
  const today = moment(moment()
      .format('YYYY-MM-DD'))
    .unix();
  Visitor.get_visitor_count(today)
    .then(result => {
      res.json({
        success: true,
        code: 200,
        result
      })
    }, err => res.end(err))
});

/*** 分时段统计今日访客 */
router.get('/get_visitor_today/:today', (req, res) => {
  const today = parseInt(req.params.today) || 2;
  Visitor.get_visitor_today(today)
    .then(result => {
      res.json({
        success: true,
        code: 200,
        result
      })
    }, err => res.end(err))
})

module.exports = router;
