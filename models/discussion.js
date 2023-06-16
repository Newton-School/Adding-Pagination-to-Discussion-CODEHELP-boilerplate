const mongoose = require("mongoose");

const discussionSchema = mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Discussion", discussionSchema);

