var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var modal = require('../public/login');
var User = require('../models/user');

// Register
router.get('/register', function(req, res) {
    res.render('index');
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

// Passport Configuration
passport.use(new LocalStrategy({passReqToCallback : true},
    function(req, username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, req.flash('loginMessage', 'Invalid password'));
                }
            });
        });
    })
);

// Register User
router.post('/register', function(req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors(); // deprecated, find new way
    
    User.findOne({username:username},function(err,user){
        if(err)
        console.log(err);
        else{
          
            if(errors) {
                //shakeModal();
                // res.render('index', {
                //     errors:errors
                // });
            } else if (!user){
                
                var newUser = new User({
                    username: username,
                    email: email,
                    password: password
                });
        
                User.createUser(newUser, function(err, user) {
                    if (err)  {
                        console.log(err);
                    }
                    //throw err;
                    console.log(user.username + " created");
                });
        
                req.flash('success_msg', 'You have successfully registered an account');
        
                // Logs in user after successfull registration
                req.login(newUser, function(err){
                    if (err) throw err;
                    res.redirect('/');
                })
            }
            else{
                console.log(username+" already exists.");
                res.redirect('/');
            }
        }
    });
});

// Login
router.get('/login', function(req, res) {
    res.render('index', {message: req.flash('loginMessage')} );
});

router.post('/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/',
      failureFlash:true
    }),function(req, res) {
        res.redirect('/');
    }
);

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

module.exports = router;
