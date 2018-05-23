const express = require('express');
const router = express.Router();
const ALIDNS = require('../../model/admin/alidns.js');


// 获取域名列表
router.get('/get_domain_list', (req, res) => {
  ALIDNS({ Action: 'DescribeDomains' })
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result: result.Domains.Domain
      })
    }, err => {
      res.end(err);
    })
});

// 获取解析记录列表
router.get('/get_domain_records/:page/:length', (req, res) => {
  const params = {
    Action: "DescribeDomainRecords",
    DomainName: req.query.domainame || "",
    RRKeyWord: req.query.keyword || "",
    PageNumber: parseInt(req.params.page) || 1,
    PageSize: parseInt(req.params.length) || 10
  }
  ALIDNS(params)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => {
      res.end(err.message);
    })
})

// 设置解析记录状态
router.post('/set_domain_record_status', (req, res) => {
  const params = {
    Action: "SetDomainRecordStatus",
    RecordId: req.body.RecordId,
    Status: req.body.Status
  }
  ALIDNS(params)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => {
      res.end(err.message);
    })
})

// 获取解析记录信息
router.get('/get_domain_record_info', (req, res) => {
  const params = {
    Action: "DescribeDomainRecordInfo",
    RecordId: req.query.RecordId
  }
  ALIDNS(params)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => {
      res.end(err.message);
    })
})

router.post('/update_domain_record', (req, res) => {
  const params = {
    Action: "UpdateDomainRecord",
    RecordId: req.body.RecordId,
    RR: req.body.RR,
    Type: req.body.Type,
    Value: req.body.Value,
    TTL: req.body.TTL,
    Line: req.body.Line
  }
  if (req.body.Priority) {
    params['Priority'] = req.body.Priority;
  }
  ALIDNS(params)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => {
      res.end(err.message);
    })
})

router.post('/add_domain_record', (req, res) => {
  const params = {
    Action: "AddDomainRecord",
    DomainName: req.body.DomainName,
    RR: req.body.RR,
    Type: req.body.Type,
    Value: req.body.Value,
    TTL: req.body.TTL,
    Line: req.body.Line
  }
  if (req.body.Priority) {
    params['Priority'] = req.body.Priority;
  }
  ALIDNS(params)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => {
      res.end(err.message);
    })
})

router.post('/delete_domain_record', (req, res) => {
  const params = {
    Action: "DeleteDomainRecord",
    RecordId: req.body.RecordId
  }
  ALIDNS(params)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => {
      res.end(err.message);
    })
})

module.exports = router;
