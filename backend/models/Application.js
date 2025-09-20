const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  name: String,
  nrc: String,
  program: String,
  gpa: Number,
  status: { type: String, default: "Pending" },
  documents: [String]
});

module.exports = mongoose.model("Application", ApplicationSchema);
