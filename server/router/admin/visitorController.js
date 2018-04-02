var express = require('express');
var router = express.Router();
var Visitor = require('../../model/admin/visitor');
var moment = require('moment');

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

module.exports = router;
