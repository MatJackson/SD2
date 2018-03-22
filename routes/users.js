var express = require('express')
var router = express.Router()
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
// var modal = require('../public/login');
var User = require('../models/user')
var bcrypt = require('bcryptjs')

// Register
router.get('/register', function (req, res) {
  res.render('index')
})

// Login
router.get('/login', function (req, res) {
  res.render('index')
})

// Forgot Password
router.get('/forgotpassword', function (req, res) {
  res.render('index')
})

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user)
  })
})

// Passport Configuration
passport.use(new LocalStrategy(
  function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
      if (err) throw err
      if (!user) {
        return done(null, false, {message: 'Unknown User'})
      }

      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, {message: 'Invalid password'})
        }
      })
    })
  })
)

// Register User
router.post('/register', function (req, res) {
  var username = req.body.username
  var email = req.body.email
  var password = req.body.password
  var password2 = req.body.password2

  // Validation
  req.checkBody('username', 'Username is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password)

  var errors = req.validationErrors() // deprecated, find new way

  User.findOne({username: username}, function (err, user) {
    if (err) { console.log(err) } else {
      if (errors) {
        // shakeModal();
        // res.render('index', {
        //     errors:errors
        // });
      } else if (!user) {
        var newUser = new User({
          username: username,
          email: email,
          password: password, colour: "red"
        })

        User.createUser(newUser, function (err, user) {
          if (err) {
            console.log(err)
          }
          // throw err;
          console.log(user.username + ' created')
        })

        req.flash('success_msg', 'You have successfully registered an account')

        // Logs in user after successfull registration
        req.login(newUser, function (err) {
          if (err) throw err
          res.redirect('/')
        })
      } else {
        console.log(username + ' already exists.')
        res.redirect('/')
      }
    }
  })
})

// Forgot Password
router.post('/forgotpassword', function (req, res) {
  var username = req.body.username
  var email = req.body.email
  var password = req.body.password
  var passwordVerification = req.body.passwordVerification

  // Validation
  req.checkBody('username', 'Username is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('passwordVerification', 'Passwords do not match').equals(req.body.password)

  var errors = req.validationErrors() // deprecated, find new way

  User.findOne({username: username}, function (err, user) {
    if (err) {
      console.log(err)
    } else {
      if (errors) {
        console.log(err)
      } else if (user && user.email === email) {
        bcrypt.genSalt(10, function (err, salt) {
          if (err) throw err
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) throw err
            user.password = hash
            user.save()
            console.log(user.username + "'s Password Has Been Updated")
          })
        })

        req.flash('success_msg', 'You have successfully changed password')

        // User.findOne({username:username},function(err,modifiedUser){
        //     if(err)
        //     {
        //         console.log(err);
        //     }
        //     else
        //     {
        //          // Logs in user after successfull password modification
        //         var modifieduser = modifiedUser;
        //         req.login(modifieduser, function(err){
        //             if (err) throw err;
        //             res.redirect('/');
        //         })
        //     }
        // });

        res.redirect('/')
      } else {
        console.log('You have entered an invalid username and/or email !!!')
        res.redirect('/')
      }
    }
  })
})

router.post('/login',
  passport.authenticate('local', {successRedirect: '/', failureFlash: true}),
  function (req, res) {
    res.redirect('/')
  }
)

router.get('/logout', function (req, res) {
  req.logout()

  req.flash('success_msg', 'You are logged out')

  res.redirect('/')
})

module.exports = router