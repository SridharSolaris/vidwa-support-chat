const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  messages: [
    {
      text: String,
      sender: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Conversation", conversationSchema);
