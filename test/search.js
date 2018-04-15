var request = require('request')
var assert = require('assert')
var sd2 = require('../app.js')
var Post = require('../models/posts')

describe('search test', function () {
    describe('search request', function () {
      it('returns search terms', function () {
        var search = 'search terms'  // puts the search String into variable
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
            assert.equal('search terms',resMsg)
          }
        })
  
        })
      }) // you can add other it() for other tests
    })

