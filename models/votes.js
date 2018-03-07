var mongoose = require("mongoose");
var votingSchema = mongoose.Schema(
    {
        text: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            username: String
        },
        post: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Post"
            },
            title: String
        },
        like: {
            type: Boolean, 
            default: false
        },
        dislike: {
           type: Boolean, 
            default: false
        },
        timePosted: String

    });

    module.exports = mongoose.model("Vote",votingSchema);