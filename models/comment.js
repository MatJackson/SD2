var mongoose = require('mongoose')
var commentSchema = mongoose.Schema(
  {
    text: String,
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

    timePosted: String,

    bestAnswer: Boolean,

    helpful: Boolean

  })

module.exports = mongoose.model('Comment', commentSchema)
