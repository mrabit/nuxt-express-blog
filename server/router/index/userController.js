const query = require('../../model/db');
const express = require('express');
const router = express.Router();
const User = require('../../model/index/user');

router.get('/profile', (req, res) => {
  User.get_profile('1')
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => {
      res.json(err);
    })
})

module.exports = router;
