var request = require('request')
var assert = require('assert')
var sd2 = require('../app.js')
var Comment = require('../models/comment')
var datetime = require('node-datetime')

describe('comment test', function () {
  describe('comment creation', function () {
    it('comment created and stored in DB test', function () {
        var currentDate = datetime.create()
        var formattedDate = currentDate.format('Y-m-d H:M:S')
              
        var newComment = new Comment ({
            bestAnswer: false,
            helpful: true,
            author: 'username',
            timePosted: formattedDate
        })
        
        newComment.save()      
             
        Comment.findById(newComment._id, function (err, comment) {
            if (err) { // if comment id is not found
                 console.error('Not found.')
                res.redirect('/error')
                } else {
                  assert.equal(newComment,comment)
                }
            })
        })

        

    
    }) // you can add other it() for other tests
  })
