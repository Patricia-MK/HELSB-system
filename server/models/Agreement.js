// server/models/Agreement.js
const mongoose = require("mongoose");

const agreementSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  accountName: { type: String, required: true },
  branchName: { type: String },
  studentLoanNo: { type: String },
  nrcNo: { type: String },
  bankAccountNo: { type: String },
  zraTpin: { type: String },
  napsaNo: { type: String },
  program: { type: String },
  year: { type: String },
  institution: { type: String },
  studentNumber: { type: String },
  qualification: { type: String },
  school: { type: String },
  loanRate: { type: String },
  studentName: { type: String },
  ceoName: { type: String },
  date: { type: Date, required: true },
  agree: { type: Boolean, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Agreement", agreementSchema);
