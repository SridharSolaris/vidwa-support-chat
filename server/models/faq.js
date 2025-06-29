const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  filename: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Faq", faqSchema);
