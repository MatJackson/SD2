var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var routes = require('./routes/index');
var app = express();
var Post = require('./models/posts');

/* example of middleware
var logger = function(req, res, next){
    console.log('Logging...');
    next();
}
app.use(logger);
*/

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// set static path
app.use(express.static(path.join(__dirname, 'public')));

// uses the route module
app.use('/', routes);

app.listen(3000, function(){
    console.log('Server started on port 3000....');
});