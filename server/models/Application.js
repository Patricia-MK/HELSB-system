// server/models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // link to student user
    program: { type: String, required: true }, // e.g. Computer Science
    loanNumber: { type: String, unique: true }, // auto-assigned or manual
    status: { 
      type: String, 
      enum: ["Pending", "Approved", "Rejected"], 
      default: "Pending" 
    },
    submittedAt: { type: Date, default: Date.now },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // official who reviewed
    remarks: { type: String }, // official’s comments
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
