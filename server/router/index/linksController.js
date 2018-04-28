const express = require('express');
const router = express.Router();
const links = require('../../model/index/links');

router.get('/getLinksList', (req, res) => {
  links.getLinksList()
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      });
    }, err => {
      res.send(err);
    })
});

module.exports = router;
