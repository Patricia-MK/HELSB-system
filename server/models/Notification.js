const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  studentNumber: {
    type: String,
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["info", "success", "warning", "error"],
    default: "info"
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for better performance
notificationSchema.index({ studentNumber: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);