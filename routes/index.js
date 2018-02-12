var express = require('express');
var router = express.Router();

var bodyParser = require('body-Parser');
var mongoose = require('mongoose');
var Post = require('./../models/posts')
var datetime = require('node-datetime');

mongoose.connect('mongodb://localhost/testdb');

/*
*   Homepage Endpoint
*/
router.get('/', function(req,res){
    res.render('index');
});

/*
*   Post Question Endpoint
*/
router.get('/post/:postid/user/:userid/:title', function(req, res) {

    // Find post in DB using the id
    Post.findById(req.params.postid, function(err, doc) {
        if (err) console.error('Not found.') // later change to Error Page
       
        /*
        *   Add conditional statements to verify if post exists
        */

        // Renders postpage with correct content
        res.render(
            'postpage', 
            {
                title: req.params.title, 
                description: doc.description, 
                userName: doc.author.userName, 
                timestamp: doc.timePosted
            }
        ); 
    });
});

/*
*   Post METHOD Endpoint
*/
router.post('/post', function(req, res) {
    var currentDate = datetime.create();
    var formattedDate = currentDate.format('Y-m-d H:M:S');

    /*
    *   Missing to get User Information (username, userid) to put in post collection 
    */ 

    // inserts data into DataBase
    var post = new Post({
        title: req.body.title,
        description: req.body.description,
        author: {
            userName: 'TEST', // to be changed
            id: 'USER-ID',    // to be changed
        },
        comments:[],
        upvotes: 0,
        timePosted: formattedDate
    });

    post.save();

    // redirect post to postpage with specific url
    res.redirect(`/post/${post._id}/user/${post.author.id}/${post.title}`);
});


module.exports = router;