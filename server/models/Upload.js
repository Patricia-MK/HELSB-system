const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loanType: { type: String, enum: ["first-timer", "returning"], required: true },
  documents: {
    confirmationSlip: String,
    paymentHistory: String,
    results: String,
    proofOfPayment: String,
    nrc: String,
    bankStatement: String,
    grade12Results: String,      // first-timers only
    guardianNrc: String,         // first-timers only
    passportPhotos: String,      // first-timers only
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Upload", uploadSchema);
