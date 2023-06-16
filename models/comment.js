const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  discussionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'discussion'
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);