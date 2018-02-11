var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var Comment = require ("../models/comment");

//========================================
//COMMENT ROUTES
router.get("/posts/:id/comments/new",isLoggedIn, function(req,res){
	Post.findById(req.params.id,function(err,post){
		if(err)
		console.log(err);
		else{
			res.render("comments/new",{post:post});
		}
	});

});
//COMMENTS CREATE
router.post("/posts/:id/comments", function(req,res){
	Post.findById(req.params.id,function(err,post){
		if(err){
		console.log(err);
		res.redirect("/posts");
		}
		else{
			//console.log(req.body.comment);
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);

				}
				else{
					comment.author.id=req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					post.comments.push(comment._id);
					post.save();
					res.redirect("/posts/"+post._id);
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
	res.redirect("/login")
}

module.exports = router;