var mongoose = require("mongoose");
var commentSchema = mongoose.Schema(
    {
        text: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            username: String
        },
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

    module.exports = mongoose.model("Comment",commentSchema);