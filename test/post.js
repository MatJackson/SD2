var request = require('request')
var assert = require('assert')
var sd2 = require('../app.js')
var Post = require('../models/posts')

describe('post test', function () {
  describe('post creation', function () {
    it('post created and stored in DB test', function () {
        var newPost = new Post({
            title: 'question',
            description: 'description',
            author: {
              username: 'username', 
              
            },
            comments: [],
            upvotes: 0,
            timePosted: 'arbitrarydate'
          })
          
         newPost.save()

         Post.findById(newPost._id, function (err, post) {
            if (err) { // if post id is not found
              console.error('Not found.')
              res.redirect('/error')
            } else {
              assert.equal(newPost,post)
            }
          })

      })
    }) // you can add other it() for other tests
  })
