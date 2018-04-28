const express = require('express');
const router = express.Router();
const links = require('../../model/admin/links');



router.get('/getLinksList/:page/:length', (req, res) => {
  const params = {
    page: parseInt(req.params.page) || 1,
    length: parseInt(req.params.length) || 10
  }
  links.getLinksList(params)
    .then(aaData => {
      return links.getLinksCount()
        .then(count => {
          res.json({
            code: 200,
            success: true,
            result: {
              aaData,
              count
            }
          });
        })
    }, err => res.end(err));
})

router.post('/addLinks', (req, res) => {
  const params = {
    site_name: req.body.site_name,
    site_url: req.body.site_url,
    create_time: (Date.parse(new Date()) / 1000)
  };
  links.insert_links(params)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      });
    }, err => res.end(err));
})

router.post('/deleteLinks', (req, res) => {
  const id = req.body.id;
  links.deleteLinks(id)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => res.end(err));
})

router.get('/getLinksDetails/:id', (req, res) => {
  const id = req.params.id;
  links.getLinksDetails(id)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      })
    }, err => res.end(err));
})

router.post('/updateLinks', (req, res) => {
  const params = {
    site_name: req.body.site_name,
    site_url: req.body.site_url,
    id: req.body.id
  };
  links.updateLinks(params)
    .then(result => {
      res.json({
        code: 200,
        success: true,
        result
      });
    }, err => res.end(err));
})

module.exports = router;
