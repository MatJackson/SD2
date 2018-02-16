var express = require("express");
var router = express.Router();
var Post = require("../models/posts");
var Comment = require ("../models/comment");
var datetime = require('node-datetime');


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

// router.get("/post/:postid/user/:userid/:title/comments/", isLoggedIn, function(req,res){
// 	res.render("postpage");
// });


router.get("/post/:postid/user/:userid/:title/comments/like", isLoggedIn, function(req,res){
	
	Post.findById(req.params.postid, function(err, post){

		if(err){
				console.log(err);
		}else{
				if(post.like==1){
					Post.findByIdAndUpdate(req.params.postid, {$inc: {like: -1}} ,function(err, post){
						// if(err){
						// 	res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						// }else{
						// 	res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						// }
					});
				}else if(post.like==0 && post.dislike==0){
					Post.findByIdAndUpdate(req.params.postid, {$inc: {like: 1}} ,function(err, post){
						if(err){
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}else{
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}
					});
				}//else {	
				// 	res.redirect("/blogs"); 
				// }
		}

	});

});

router.get("/post/:postid/user/:userid/:title/comments/dislike", isLoggedIn, function(req,res){
	
	Post.findById(req.params.postid, function(err, post){
		
		if(err){
				console.log(err);
		}else{
				if(post.dislike==1){
					Post.findByIdAndUpdate(req.params.postid, {$inc: {dislike: -1}} ,function(err, pst){
						if(err){
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}else{
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}
					});
				}else if(post.like==0 && post.dislike==0){
					Post.findByIdAndUpdate(req.params.postid, {$inc: {dislike: 1}} ,function(err, post){
						if(err){
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}else{
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}
					});
				}//else {	
				// 	res.redirect("/blogs"); 
				// }
		}

	});

});


router.get("/post/:postid/user/:userid/:title/comments/:commentid/like", isLoggedIn, function(req,res){
	console.log(req.params.commentid);
	Comment.findById(req.params.commentid, function(err, comment){

		if(err){
				console.log(err);
		}else{
				if(comment.like==1){
					Comment.findByIdAndUpdate(req.params.commentid, {$inc: {like: -1}} ,function(err, post){
						if(err){
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}else{
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}
					});
				}else if(comment.like==0 && comment.dislike==0){
					Comment.findByIdAndUpdate(req.params.commentid, {$inc: {like: 1}} ,function(err, post){
						if(err){
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}else{
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}
					});
				}//else {	
				// 	res.redirect("/blogs"); 
				// }
		}

	});

});

router.get("/post/:postid/user/:userid/:title/comments/:commentid/dislike", isLoggedIn, function(req,res){
	
	Comment.findById(req.params.commentid, function(err, comment){
		
		if(err){
				console.log(err);
		}else{
				if(comment.dislike==1){
					Comment.findByIdAndUpdate(req.params.commentid, {$inc: {dislike: -1}} ,function(err, pst){
						if(err){
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}else{
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}
					});
				}else if(comment.like==0 && comment.dislike==0){
					Comment.findByIdAndUpdate(req.params.commentid, {$inc: {dislike: 1}} ,function(err, post){
						if(err){
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}else{
							res.redirect("/post/"+req.params.postid+"/user/" + req.params.userid +"/"+ req.params.title);
						}
					});
				}//else {	
				// 	res.redirect("/blogs"); 
				// }
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