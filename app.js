var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var cookieParser = require('cookie-parser')
var expressValidator = require('express-validator')
var flash = require('connect-flash')
var session = require('express-session')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var mongo = require('mongodb')
var mongoose = require('mongoose')

// Init app
var app = express()

// 2 following needed for update and destroy routes
var methodOverride = require('method-override')
app.use(methodOverride('_method'))

// REQUIRE MODELS
var Comment = require('./models/comment')
var Post = require('./models/posts')
var User = require('./models/user')

mongoose.connect('mongodb://localhost/db2')
var db = mongoose.connection

// REQUIRE ROUTES
var routes = require('./routes/index')
var users = require('./routes/users')
var commentRoutes = require('./routes/comments')
var searches = require('./routes/searches')

// View Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

/* example of middleware
var logger = function(req, res, next){
    console.log('Logging...');
    next();
}
app.use(logger);
*/

// BodyParser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')))

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

// Passport Init
app.use(passport.initialize())
app.use(passport.session())

// Express Validator - taken from git page
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
    var root = namespace.shift()
    var formParam = root

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

// Connect Flash
app.use(flash())

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error') // for passport
  res.locals.user = req.user || null // track if user logged in/out
  next()
})

// Middleware for Route Files
app.use('/', routes)
app.use('/users', users)
app.use(commentRoutes)
app.use('/', searches)

// Set Port
app.set('port', (process.env.PORT || 3000))

// What's this for? ask Steph -MJ

// set static path
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.render('index')
})

app.listen(3000, function () {
  console.log('server started on port ' + app.get('port'))
})
