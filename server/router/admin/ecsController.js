const express = require('express');
const router = express.Router();
const ECS = require('../../model/admin/ecs');
const moment = require('moment');

router.get('/get_cpu_utilization', (req, res) => {
  const params = {
    startTime: req.query.startTime,
    endTime: req.query.endTime,
    metric: 'CPUUtilization'
  }
  ECS(params)
    .then(d => {
      res.json({
        success: true,
        code: 200,
        result: d
      });
    }, (err) => {
      res.json(err);
    });
});

router.get('/get_internet_rate', (req, res) => {
  const params = {
    startTime: req.query.startTime,
    endTime: req.query.endTime
  }

  Promise.all([ECS(Object.assign({}, params, {
      metric: 'InternetInRate'
    })), ECS(Object.assign({}, params, {
      metric: 'InternetOutRate'
    }))])
    .then(([InternetInRate, InternetOutRate]) => {
      res.json({
        success: true,
        code: 200,
        result: {
          InternetInRate,
          InternetOutRate
        }
      });
    }, (err) => {
      res.json(err);
    })
})

module.exports = router;
