// models/Activity.js
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  type: { type: String, required: true }, // login, logout, create, update, delete, approve, reject
  description: { type: String, required: true },
  userName: { type: String, required: true },
  userRole: { type: String, required: true },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", activitySchema);