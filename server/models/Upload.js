const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  studentNumber: { type: String, required: true }, // <-- added
  loanType: { type: String, enum: ["first-timer", "returning"], required: true },
  documents: {
    confirmationSlip: String,
    paymentHistory: String,
    results: String,
    proofOfPayment: String,
    nrc: String,
    bankStatement: String,
    grade12Results: String,
    guardianNrc: String,
    passportPhotos: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Upload", uploadSchema);
