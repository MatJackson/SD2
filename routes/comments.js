var express = require("express");
var router = express.Router();
var Post = require("../models/posts");
var Comment = require ("../models/comment");
var datetime = require('node-datetime');
var bodyParser = require('body-Parser');


//===================
//COMMENT ROUTES
//===================

//COMMENTS CREATE ROUTE

router.post("/post/:postid/user/:userid/:title/comments", isLoggedIn, function(req,res){
	Post.findById(req.params.postid,function(err,post){

		if(err){
		console.log(err);
		//error message for time being
		res.send("Cannot find post");
		}
		else{
			
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);

				}
				else{
					var currentDate = datetime.create();
					var formattedDate = currentDate.format('Y-m-d H:M:S');
					
					comment.author.id=req.user._id;
					comment.author.username = req.user.username;
					comment.timePosted = formattedDate;
					comment.save();
					post.comments.push(comment._id);
					post.save();
					res.redirect("/post/"+post._id+"/user/" + post.author._id +"/"+ post.title);

				}
			});
		}
	});
});
//MIDDLE WARE
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect("/");


}

module.exports = router;