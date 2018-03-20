var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Post = require('../models/posts')

router.get('/search', function (req, res) {
  var search = req.query.search
  var keywords = search.split(' ')
  var resMsg = ''
  Post.find({$text: {$search: search}}, function (err, searchRes) {
    if (err) { console.log(err) } else {
      if (searchRes.length == 0) {
        resMsg = `No results found for "${search}"`
      } else {
        resMsg = `Search results for "${search}"`
      }
      res.render('search', {searchRes, search: resMsg})
    }
  })
})

module.exports = router
