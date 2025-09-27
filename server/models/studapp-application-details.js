const mongoose = require("mongoose");

const applicationDetailsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  university: { type: String, required: true },
  studentNumber: { type: String },
  school: { type: String },
  program: { type: String, required: true },
  yearOfStudy: { type: Number },
  sponsorshipRate: { type: Number },
  acceptanceLetterId: { type: String }, // GridFS id
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending", index: true },
}, { timestamps: true });

module.exports = mongoose.model("StudappApplicationDetails", applicationDetailsSchema);


