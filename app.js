var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require("mongoose");
var app = express();
//need to npm install method-override
var methodOverride = require("method-override");

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


//COMMENT SCHEMA 
var commentSchema = new mongoose.Schema({
    body: String,
    created: {type: Date, default:Date.now}
});

var Comment = mongoose.model("Comment",commentSchema);



app.get('/', function(req,res){
    res.render('index');
})

//COMMENT ROUTES

//1. NEW ROUTE
app.get("/posts/new", function(req,res){
    res.render("new");
});

//2.CREATE ROUTE
app.post("/posts",function(req,res){
    Blog.create(req.body.blog, function(err,newBlog){
        if(err){
            res.render("new");  
        } else{
            res.redirect("/posts");
        }
    });
});
//3.SHOW ROUTE
app.get("/posts/:id",function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
            res.redirect("/posts");
        else{
            res.render("show", {blog:foundBlog});
        }
    });
});

app.get("/posts", function (req,res){
    Blog.find({},function(err,blogs){
        if(err)
        console.log("error!!");
        else{
            res.render("rightsidebar", {blogs:blogs});
        }
    });
    
});
// //EDIT ROUTE
// app.get("/posts/:id/edit",function(req,res){
//     Blog.findById(req.params.id, function(err,foundBlog){
//         if (err)
//         res.redirect("/posts");
//         else{
//             res.render("edit",{blog:foundBlog});
//         }
//     });
    
// });
// //UPDATE ROUTE
// app.put("/posts/:id",function(req,res){
//     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
//         if(err)
//         res.redirect("/posts");
//         else{
//             res.redirect("/posts/"+ req.params.id);
//         }
//     });
// });

// //DELETE ROUTE
// app.delete("/posts/:id", function(req,res){
//     Blog.findByIdAndRemove(req.params.id,function(err){
//         if (err)
//         res.redirect("/posts");
//         else{
//         res.redirect("/posts");
//         }
//     });
// });







app.listen(3000, function(){
    console.log('server started on port 3000....');
})