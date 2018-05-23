const express = require('express');
const router = express.Router();
const ALIDNS = require('../../model/admin/alidns.js');


// 获取域名列表
router.get('/get_domain_list', (req, res) => {
  ALIDNS.DescribeDomains()
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
    DomainName: req.query.domainame || "",
    RRKeyWord: req.query.keyword || "",
    PageNumber: parseInt(req.params.page) || 1,
    PageSize: parseInt(req.params.length) || 10
  }
  ALIDNS.DescribeDomainRecords(params)
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
    RecordId: req.body.RecordId,
    Status: req.body.Status
  }
  ALIDNS.SetDomainRecordStatus(params)
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
