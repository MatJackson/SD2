var express = require('express')
var router = express.Router()
var Post = require('../models/posts')
var Comment = require('../models/comment')
var datetime = require('node-datetime')

//= ==================
// COMMENT ROUTES
//= ==================

// COMMENTS CREATE ROUTE

router.post('/post/:postid/user/:userid/:title/comments', isLoggedIn, function (req, res) {
  Post.findById(req.params.postid, function (err, post) {
    if (err) {
      console.log(err)
      // error message for time being
      res.send('Cannot find post')
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err)
        } else {
          var currentDate = datetime.create()
          var formattedDate = currentDate.format('Y-m-d H:M:S')
          comment.bestAnswer = false
          comment.helpful = true
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          comment.timePosted = formattedDate
          comment.save()
          post.comments.push(comment._id)
          post.save()
          res.redirect('/post/' + post._id + '/user/' + req.params.userid + '/' + post.title)
        }
      })
    }
  })
})

router.get('/post/:postid/user/:userid/:title/comments/like', isLoggedIn, function (req, res) {
  var postid = req.params.postid
  var userid = req.params.userid
  var title = req.params.title

  console.log('Current User ' + userid)

  Post.findById(postid, function (err, post) {
    if (err) {
      console.log(err)
    } else {
      var query = { _id: postid }
      var votingArray = post.voteArray
      console.log(votingArray)
      var foundUser = false
      for (var i = 0; i < votingArray.length; i++) {
        var votingArrayUserID = votingArray[i].userID
        console.log('USER ID IS:' + votingArrayUserID)
        if (votingArrayUserID === userid) {
          foundUser = true

          if (votingArray[i].didLike) {
            console.log('1')
            Post.findOneAndUpdate(query, { voteArray: { didLike: false, didDislike: false, userID: userid } }, {upsert: true}, function (err, post) { if (err) throw err })

            Post.findByIdAndUpdate(postid, {$inc: {like: -1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              } else {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
          } else if (!votingArray[i].didLike && !votingArray[i].didDislike) {
            console.log('2')
            Post.findOneAndUpdate(query, { voteArray: { didLike: true, didDislike: false, userID: userid } }, {upsert: false}, function (err, post) { if (err) throw err })

            Post.findByIdAndUpdate(postid, {$inc: {like: 1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              } else {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
          } else if (!votingArray[i].didLike && votingArray[i].didDislike) {
            console.log('3')
            Post.findOneAndUpdate(query, { voteArray: { didLike: true, didDislike: false, userID: userid } }, {upsert: false}, function (err, post) { if (err) throw err })

            Post.findByIdAndUpdate(postid, {$inc: {dislike: -1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
            Post.findByIdAndUpdate(postid, {$inc: {like: 1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              } else {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
          }
          break
        }
      }
      if (!foundUser) {
        console.log('4')
        Post.findOneAndUpdate(query, { voteArray: { didLike: true, didDislike: false, userID: userid } }, {upsert: true}, function (err, post) { if (err) throw err })

        Post.findByIdAndUpdate(postid, {$inc: {like: 1}}, function (err, post) {
          if (err) {
            res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
          } else {
            res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
          }
        })
      }
    }
  })
})

router.get('/post/:postid/user/:userid/:title/comments/dislike', isLoggedIn, function (req, res) {
  var postid = req.params.postid
  var userid = req.params.userid
  var title = req.params.title

  console.log('Current User ' + userid)

  Post.findById(postid, function (err, post) {
    if (err) {
      console.log(err)
    } else {
      var query = { _id: postid }
      var votingArray = post.voteArray
      console.log(votingArray)
      var foundUser = false
      for (var i = 0; i < votingArray.length; i++) {
        var votingArrayUserID = votingArray[i].userID
        console.log('USER ID IS:' + votingArrayUserID)
        if (votingArrayUserID === userid) {
          foundUser = true
          if (votingArray[i].didDislike) {
            console.log('1')
            Post.findOneAndUpdate(query, { voteArray: { didLike: false, didDislike: false, userID: userid } }, {upsert: true}, function (err, post) { if (err) throw err })

            Post.findByIdAndUpdate(postid, {$inc: {dislike: -1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              } else {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
          } else if (!votingArray[i].didLike && !votingArray[i].didDislike) {
            console.log('2')
            Post.findOneAndUpdate(query, { voteArray: { didLike: false, didDislike: true, userID: userid } }, {upsert: false}, function (err, post) { if (err) throw err })

            Post.findByIdAndUpdate(postid, {$inc: {dislike: 1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              } else {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
          } else if (!votingArray[i].didDislike && votingArray[i].didLike) {
            console.log('3')
            Post.findOneAndUpdate(query, { voteArray: { didLike: false, didDislike: true, userID: userid } }, {upsert: false}, function (err, post) { if (err) throw err })

            Post.findByIdAndUpdate(postid, {$inc: {like: -1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
            Post.findByIdAndUpdate(postid, {$inc: {dislike: 1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              } else {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
          }
          break
        }
      }
      if (!foundUser) {
        console.log('4')
        Post.findOneAndUpdate(query, { voteArray: { didLike: false, didDislike: true, userID: userid } }, {upsert: true}, function (err, post) { if (err) throw err })

        Post.findByIdAndUpdate(postid, {$inc: {dislike: 1}}, function (err, post) {
          if (err) {
            res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
          } else {
            res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
          }
        })
      }
    }
  })
})

router.get('/post/:postid/user/:userid/:title/comments/:commentid/like', isLoggedIn, function (req, res) {
  var postid = req.params.postid
  var userid = req.params.userid
  var commentid = req.params.commentid
  var title = req.params.title

  console.log('Current User ' + userid)

  Comment.findById(commentid, function (err, comment) {
    if (err) {
      console.log(err)
    } else {
      var query = { _id: commentid }
      var votingArray = comment.voteArray
      console.log(votingArray)
      var foundUser = false
      for (var i = 0; i < votingArray.length; i++) {
        var votingArrayUserID = votingArray[i].userID
        console.log('USER ID IS:' + votingArrayUserID)
        if (votingArrayUserID === userid) {
          foundUser = true
          if (votingArray[i].didLike) {
            console.log('1')
            Comment.findOneAndUpdate(query, { voteArray: { didLike: false, didDislike: false, userID: userid } }, {upsert: true}, function (err, post) { if (err) throw err })

            Comment.findByIdAndUpdate(commentid, {$inc: {like: -1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              } else {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
          } else if (!votingArray[i].didLike && !votingArray[i].didDislike) {
            console.log('2')
            Comment.findOneAndUpdate(query, { voteArray: { didLike: true, didDislike: false, userID: userid } }, {upsert: false}, function (err, post) { if (err) throw err })

            Comment.findByIdAndUpdate(commentid, {$inc: {like: 1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              } else {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
          } else if (!votingArray[i].didLike && votingArray[i].didDislike) {
            console.log('3')
            Comment.findOneAndUpdate(query, { voteArray: { didLike: true, didDislike: false, userID: userid } }, {upsert: false}, function (err, post) { if (err) throw err })

            Comment.findByIdAndUpdate(commentid, {$inc: {dislike: -1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
            Comment.findByIdAndUpdate(commentid, {$inc: {like: 1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              } else {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
          }
          break
        }
      }
      if (!foundUser) {
        console.log('4')
        Comment.findOneAndUpdate(query, { voteArray: { didLike: true, didDislike: false, userID: userid } }, {upsert: true}, function (err, post) { if (err) throw err })

        Comment.findByIdAndUpdate(commentid, {$inc: {like: 1}}, function (err, post) {
          if (err) {
            res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
          } else {
            res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
          }
        })
      }
    }
  })
})

router.get('/post/:postid/user/:userid/:title/comments/:commentid/dislike', isLoggedIn, function (req, res) {
  var postid = req.params.postid
  var userid = req.params.userid
  var commentid = req.params.commentid
  var title = req.params.title

  console.log('Current User ' + userid)

  Comment.findById(commentid, function (err, comment) {
    if (err) {
      console.log(err)
    } else {
      var query = { _id: commentid }
      var votingArray = comment.voteArray
      console.log(votingArray)
      var foundUser = false
      for (var i = 0; i < votingArray.length; i++) {
        var votingArrayUserID = votingArray[i].userID
        console.log('USER ID IS:' + votingArrayUserID)
        if (votingArrayUserID === userid) {
          foundUser = true
          if (votingArray[i].didDislike) {
            console.log('1')
            Comment.findOneAndUpdate(query, { voteArray: { didLike: false, didDislike: false, userID: userid } }, {upsert: true}, function (err, post) { if (err) throw err })

            Comment.findByIdAndUpdate(commentid, {$inc: {dislike: -1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              } else {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
          } else if (!votingArray[i].didLike && !votingArray[i].didDislike) {
            console.log('2')
            Comment.findOneAndUpdate(query, { voteArray: { didLike: false, didDislike: true, userID: userid } }, {upsert: false}, function (err, post) { if (err) throw err })

            Comment.findByIdAndUpdate(commentid, {$inc: {dislike: 1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              } else {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
          } else if (!votingArray[i].didDislike && votingArray[i].didLike) {
            console.log('3')
            Comment.findOneAndUpdate(query, { voteArray: { didLike: false, didDislike: true, userID: userid } }, {upsert: false}, function (err, post) { if (err) throw err })

            Comment.findByIdAndUpdate(commentid, {$inc: {like: -1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
            Comment.findByIdAndUpdate(commentid, {$inc: {dislike: 1}}, function (err, post) {
              if (err) {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              } else {
                res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
              }
            })
          }
          break
        }
      }
      if (!foundUser) {
        console.log('4')
        Comment.findOneAndUpdate(query, { voteArray: { didLike: false, didDislike: true, userID: userid } }, {upsert: true}, function (err, post) { if (err) throw err })

        Comment.findByIdAndUpdate(commentid, {$inc: {dislike: 1}}, function (err, post) {
          if (err) {
            res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
          } else {
            res.redirect('/post/' + postid + '/user/' + userid + '/' + title)
          }
        })
      }
    }
  })
})

router.get('/post/:postid/user/:userid/:title/comments/:commentid/bestanswer', isLoggedIn, function (req, res) {
  Post.findById(req.params.postid, function (err, post) {
    if (err) {
      console.log(err)
      // error message for time being
      res.send('Cannot find post')
    } else {
      var commentsArray = post.comments
      for (var i = 0; i < commentsArray.length; i++) {
        Comment.findById(commentsArray[i], function (err, comment) {
          if (err) {
            console.log(err)
          } else {
            comment.bestAnswer = false
            comment.save()
            post.save()
          }
        })
      }
      Comment.findByIdAndUpdate(req.params.commentid, {$set: {bestAnswer: true}}, function (err, comment) {
        if (err) {
          console.log(err)
        } else {
          comment.helpful = true
          comment.save()
          post.save()
          res.redirect('/post/' + post._id + '/user/' + req.params.userid + '/' + post.title)
        }
      })
    }
  })
})

router.get('/post/:postid/user/:userid/:title/comments/:commentid/nothelpful', isLoggedIn, function (req, res) {
  Post.findById(req.params.postid, function (err, post) {
    if (err) {
      console.log(err)
      // error message for time being
      res.send('Cannot find post')
    } else {
      Comment.findById(req.params.commentid, function (err, comment) {
        if (err) {
          console.log(err)
        } else {
          if (comment.helpful === true) {
            comment.helpful = false
            comment.save()
            post.save()
          } else {
            comment.helpful = true
            comment.save()
            post.save()
          }
        }
      })

      res.redirect('/post/' + post._id + '/user/' + req.params.userid + '/' + post.title)
    }
  })
})

// UPDATE ROUTE
router.put('/post/:postid/user/:userid/:title/comments/:commentid/', checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.commentid, {text: req.body.comment}, function (err, updatedComment) {
    if (err) {
      console.log(err)
      res.redirect('/')
    } else {
      updatedComment.save()
      res.redirect('/post/' + req.params.postid + '/user/' + req.params.userid + '/' + req.params.title)
    }
  })
})

// DELETE ROUTE
router.delete('/post/:postid/user/:userid/:title/comments/:commentid/', checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.commentid, function (err) {
    if (err) {
      console.log(err)
      res.redirect('/')
    } else {
      Post.findById(req.params.postid, function (err, foundPost) {
        if (err) throw err
        console.log('start:' + foundPost.comments)
        var commentsArray = foundPost.comments
        for (var i = 0; i < commentsArray.length; i++) {
          if (req.params.commentid === commentsArray[i].toString()) {
            var index = commentsArray.indexOf(req.params.commentid)
            commentsArray.splice(index, 1)
          }
        }
        foundPost.save()
        console.log(foundPost.comments)
      })

      res.redirect('/post/' + req.params.postid + '/user/' + req.params.userid + '/' + req.params.title)
    }
  })
})

// MIDDLE WARE
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/')
}
function checkCommentOwnership (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.commentid, function (err, foundComment) {
      if (err) {
        res.redirect('back')
      } else {
        // check if pst belong to author
        if (foundComment.author.id.equals(req.user._id)) { next() } else { // need better error message later
          res.redirect('back')
        }
      }
    })
  } else {
    res.redirect('back')
  }
}

module.exports = router
