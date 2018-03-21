var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Post = require('../models/posts')

//
// Search route
//
router.get('/search', function (req, res) {
  var search = req.query.search  // puts the search String into variable
  var keywords = search.split(' ')  // put every keyword into array
  var resMsg = ''
  // Creates index for all text searches *you must delete old indexes from the post collection for this to work*
  Post.find({$text: {$search: search}}, function (err, searchRes) {
    if (err) { console.log(err) } else {
      if (searchRes.length === 0) {
        resMsg = `No results found for "${search}"`
      } else {
        resMsg = `Search results for "${search}"`
      }
      res.render('search', {searchRes, search: resMsg})
    }
  })
})

module.exports = router
