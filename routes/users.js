var express = require('express')
var router = express.Router()
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var User = require('../models/user')
var bcrypt = require('bcryptjs')

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user)
  })
})

// Register -------------------------------------------------------------------
passport.use('local-signup', new LocalStrategy({passReqToCallback: true},
  function (req, username, password, done) {
    User.getUserByUsername(username, function (err, user) {
      if (err) return done(err)
      if (user) {
        return done(null, false, req.flash('signupMessage', 'Username already in use'))
      } else {
        var newUser = new User({
          username: username,
          email: req.email,
          password: password
        })
        User.createUser(newUser, function (err, user) {
          if (err) console.log(err)
        })
        req.login(newUser, function (err) {
          if (err) throw err
        })
        return done(null, newUser)
      }
    })
  }
))

router.get('/register', function (req, res) {
  res.render('index')
})

router.post('/register', function (req, res) {
  req.checkBody('username', 'Username is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password)

  var errors = req.validationErrors() // deprecated, find new way
  if (errors) {
    req.flash('signupMessage', errors[0].msg)
    res.redirect('/')
  } else {
    passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/',
      failureFlash: true
    })(req, res)
  }
})

// Login -------------------------------------------------------------------
passport.use('local-login', new LocalStrategy({passReqToCallback: true},
  function (req, username, password, done) {
    User.getUserByUsername(username, function (err, user) {
      // if there are any errors, return the error before anything else
      if (err) return done(err)
      if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'))
      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, req.flash('loginMessage', 'Invalid password'))
        }
      })
    })
  }
))

router.get('/login', function (req, res) {
  res.render('index')
})

router.post('/login', function (req, res) {
  req.checkBody('username', 'Username is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()
  var errors = req.validationErrors()
  if (errors) {
    req.flash('loginMessage', errors[0].msg)
    res.redirect('/')
  } else {
    passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/',
      failureFlash: true
    })(req, res)
  }
})

// Forgot Password
router.get('/forgotpassword', function (req, res) {
  res.render('index')
})

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

router.get('/logout', function (req, res) {
  req.logout()

  req.flash('success_msg', 'You are logged out')

  res.redirect('/')
})

module.exports = router
