const mongoose = require("mongoose");

const personalSchema = new mongoose.Schema({
  firstName: String,
  otherNames: String,
  surname: String,
  nrcNumber: String,
  dob: Date,
  gender: String,
  phone: String,
  email: String,
  address: String,
  nationality: String,
  district: String,
}, { _id: false });

const educationSchema = new mongoose.Schema({
  lastSchool: String,
  yearOfCompletion: String,
  schoolDistrict: String,
  examNumber: String,
}, { _id: false });

const guardianSchema = new mongoose.Schema({
  firstName: String,
  otherNames: String,
  surname: String,
  occupation: String,
  gender: String,
  address: String,
  relation: String,
}, { _id: false });

const attachmentsSchema = new mongoose.Schema({
  certifiedNrcId: String,       // GridFS file id
  guardianNrcId: String,        // GridFS file id
  statementOfResultsId: String, // GridFS file id
}, { _id: false });

const registrationProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  personal: personalSchema,
  education: educationSchema,
  guardian: guardianSchema,
  attachments: attachmentsSchema,
  status: { type: String, enum: ["NotStarted", "InProgress", "Submitted", "Verified"], default: "InProgress" },
}, { timestamps: true });

module.exports = mongoose.model("StudappRegistrationProfile", registrationProfileSchema);


