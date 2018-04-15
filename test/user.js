var request = require('request')
var assert = require('assert')
var sd2 = require('../app.js')
var User = require('../models/user')

describe('Registration test', function () {
  describe('User Creation and Stored', function () {
    it('returns user', function () {
        var newUser = new User({
            username: 'username',
            email: 'email@hotmail.com',
            password: 'password'
          })
          User.createUser(newUser, function (err, user) {
            if (err) console.log(err)
          })

          User.findOne({username: 'username'}, function (err, user) {
            assert.equal(newUser, user)
          })

    }) // you can add other it() for other tests

    it('password comparison',function(){
        var password='pass'
        User.getUserByUsername('username', function (err, user) {
            if (err) return done(err)
            if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'))
             User.comparePassword(password, 'pass', function (err, isMatch) {
               assert.equal(true,isMatch)

             })
           })
    })
  })
})
