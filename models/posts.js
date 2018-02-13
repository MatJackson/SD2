var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    
    title: String,
    description: String,
    author: {
        id:{ 
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
    }],
    upvotes: Number,
    timePosted: String
});

module.exports = mongoose.model('Post', postSchema);;