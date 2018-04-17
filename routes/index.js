var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Post = require('../models/posts')
var datetime = require('node-datetime')
/*
*   Homepage Endpoint
*/
router.get('/', function (req, res) {
  Post.find({}, function (err, allPosts) {
    if (err) throw err
    res.render('index', {post: allPosts})
  })
})

router.get('/allposts', function (req, res) {
  Post.find({}, function (err, allPosts) {
    if (err) { console.log(err) } else {
      res.render('allposts', {post: allPosts})
    }
  })
})
router.get('/profilepage', function (req, res) {
  Post.find({}, function (err, allPosts){
  	if (err) { console.log(err) } else {
  		res.render('profilepage',{post: allPosts})
    }
  })
})

/*
*   Post Question Endpoint
*/
router.post('/post', isLoggedIn, function (req, res) {
  var currentDate = datetime.create()
  var formattedDate = currentDate.format('Y-m-d H:M:S')
  console.log(req.body.title)
  var post = new Post({
    title: req.body.title,
    description: req.body.description,
    author: {
      username: req.user.username, // to be changed
      id: req.user._id // to be changed
    },
    comments: [],
    upvotes: 0,
    timePosted: formattedDate
  })

  post.save()
  // redirect post to postpage with specific url
  res.redirect(`/post/${post._id}/user/${post.author.id}`)
})
// GET ROUTE
router.get('/post/:postid/user/:userid', function (req, res) {
  // Find post in DB using the id
  Post.findById(req.params.postid).populate('comments').exec(function (err, foundPost) {
    if (err) { // if post id is not found
      console.error('Not found.')
      res.redirect('/error')
    } else {
      // Renders postpage with correct content
      res.render('postpage', {post: foundPost})
    }
  })
})
// EDIT ROUTE
router.get('/post/:postid/user/:userid/edit', checkPostOwnership, function (req, res) {
  console.log("this is edit route " + req.params)
  Post.findById(req.params.postid, function (err, foundPost) {
    if (err) throw err
    res.render('editPost', {post: foundPost})
  })
})
// UPDATE ROUTE
router.put('/post/:postid/user/:userid', checkPostOwnership, function (req, res) {
  console.log("this is update route " + req.params)
  Post.findByIdAndUpdate(req.params.postid, req.body.post, function (err, updatedPost) {
    if (err) {
      res.redirect('/')
    } else {
      console.log(updatedPost.title)
      res.redirect('/post/' + updatedPost._id + '/user/' + updatedPost.author.id)
    }
  })
})
// DELETE ROUTE
router.delete('/post/:postid/user/:userid', checkPostOwnership, function (req, res) {
  Post.findByIdAndRemove(req.params.postid, function (err) {
    // need better statements after if-else, temporary for now
    if (err) {
      res.redirect('/')
    } else {
      res.redirect('/')
    }
  })
})

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/#')
}

function checkPostOwnership (req, res, next) {
  if (req.isAuthenticated()) {
    Post.findById(req.params.postid, function (err, foundPost) {
      if (err) {
        res.redirect('back')
      } else {
        // check if post belong to author
        if (foundPost.author.id.equals(req.user._id)) { next() } else { // need better error message later
          res.redirect('back')
        }
      }
    })
  } else {
    res.redirect('back')
  }
}
module.exports = router
