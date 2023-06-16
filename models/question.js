const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  questionName: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['solved', 'pending'],
    default: 'pending'
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);