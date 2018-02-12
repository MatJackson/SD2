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

// Login
router.get('/login', function(req, res) {
    res.render('index');
});

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

    if(errors) {
        console.log(errors);
        res.render('index', {
            errors:errors
        });
    } else {
        var newUser = new User({
            username: username,
            email: email,
            password: password
        });

        User.createUser(newUser, function(err, user) {
            if (err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You have successfully registered an account');

        res.redirect('/')
    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                console.log('Unknown User'); //debugging
                return done(null, false, {message: 'Unknown User'});
            }
            console.log('user found'); // debugging

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    console.log(username + "logged in"); //debugging
                    return done(null, user);
                } else {
                    console.log('Invalid password'); //debugging
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {successRedirect: '/', failureRedirect:'/users/login', failureFlash:true}),
    function(req, res) {
    console.log('authenticate called'); // debugging
        res.redirect('/');
    }
);

router.get('/logout', function(req, res){
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});

module.exports = router;