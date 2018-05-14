const express = require('express');
const router = express.Router();
const ECS = require('../../model/admin/ecs');
const moment = require('moment');

// CPU使用率
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

// 公网带宽
router.get('/get_internet_rate', (req, res) => {
  const params = {
    startTime: req.query.startTime,
    endTime: req.query.endTime
  }

  Promise.all([ECS(Object.assign({}, params, {
      metric: 'VPC_PublicIP_InternetInRate'
    })), ECS(Object.assign({}, params, {
      metric: 'VPC_PublicIP_InternetOutRate'
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

// 磁盘使用量
router.get('/get_diskusage_info', (req, res) => {
  const params = {
    startTime: req.query.startTime,
    endTime: req.query.endTime,
  }
  Promise.all([ECS(Object.assign({}, params, {
      metric: 'diskusage_free'
    })), ECS(Object.assign({}, params, {
      metric: 'diskusage_used'
    })), ECS(Object.assign({}, params, {
      metric: 'diskusage_total'
    }))])
    .then(([diskusage_free, diskusage_used, diskusage_total]) => {
      res.json({
        success: true,
        code: 200,
        result: {
          diskusage_free,
          diskusage_used,
          diskusage_total
        }
      });
    }, (err) => {
      res.json(err);
    })
})

// 内存使用率
router.get('/get_memory_usedutilization', (req, res) => {
  const params = {
    startTime: req.query.startTime,
    endTime: req.query.endTime,
    metric: 'memory_usedutilization'
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
})

module.exports = router;
