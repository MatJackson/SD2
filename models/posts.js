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
    like: {
        type: Number, 
        default: 0
    },
    dislike: {
        type: Number, 
        default: 0
    },

    voteArray: [{
        id:{ 
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },    
        didLike: {
            type: Boolean, 
            default: false
        },
        didDislike: {
            type: Boolean, 
            default: false
        }
        }],

    timePosted: String
});

module.exports = mongoose.model('Post', postSchema);;