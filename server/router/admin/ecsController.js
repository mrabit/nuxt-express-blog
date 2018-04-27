const express = require('express');
const router = express.Router();
const ECS = require('../../model/admin/ecs');

router.get('/get_monitor_data', function(req, res) {

  const params = {
    StartTime: req.query.StartTime,
    EndTime: req.query.EndTime
  }
  ECS.describeInstanceMonitorData(params)
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
