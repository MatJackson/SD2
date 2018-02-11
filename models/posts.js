var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    id: String,
    title: String,
    description: String,
    author: {
        userName: String,
        id: String,
    },
    comments:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
    }],
    upvotes: Number,
    timePosted: String
}, {collection: 'posts'});

module.exports = mongoose.model('Post', postSchema);;