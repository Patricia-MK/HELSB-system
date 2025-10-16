// models/Agreement.js
const mongoose = require("mongoose");

const agreementSchema = new mongoose.Schema({
  receiptNumber: String,
  bankName: String,
  accountName: String,
  branchName: String,
  studentLoanNo: String,
  nrcNo: String,
  bankAccountNo: String,
  zraTpin: String,
  napsaNo: String,
  program: { type: String, required: true },
  year: { type: String, required: true },
  institution: { type: String, required: true },
  studentNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  qualification: String,
  school: String,
  loanRate: String,
  studentName: { type: String, required: true },
  ceoName: String,
  date: { type: Date, default: Date.now },
  agree: { type: Boolean, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected"], 
    default: "Pending" 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Agreement", agreementSchema);