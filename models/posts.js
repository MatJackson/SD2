var mongoose = require('mongoose')

var postSchema = mongoose.Schema({

  title: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'

    },
    username: String,
    colour: String
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
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
    userID: {
      type: String
    },
    didLike: {
      type: Boolean
    },
    didDislike: {
      type: Boolean
    }
  }],

  timePosted: String
})

postSchema.index({'$**': 'text'})

module.exports = mongoose.model('Post', postSchema)
