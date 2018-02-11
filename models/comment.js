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
        // @Nath, upvotes and downvotes are present for the time being, feel free to change the model
        upvotes: Number,
        downvotes: Number,
        timePosted: String

    });

    module.exports = mongoose.model("Comment",commentSchema);