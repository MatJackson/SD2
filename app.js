var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require("mongoose");
var app = express();

//routes requirements
var commentRoutes = require("./routes/comments"),
//MODELS requirements
var Comment = require("./models/comment");

//need to npm install method-override
var methodOverride = require("method-override");


mongoose.connect("mongodb://localhost/Metis");
/* example of middleware
var logger = function(req, res, next){
    console.log('Logging...');
    next();
}
app.use(logger);
*/

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride("_method"));


//set static path
app.use(express.static(path.join(__dirname, 'public')))


app.use(commentRoutes);

app.listen(3000, function(){
    console.log('server started on port 3000....');
})