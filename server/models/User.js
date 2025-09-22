const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "supervisor", "official"], required: true },
  year: { type: Number }, // optional for staff
  studentID: { type: String }, // optional for staff
  loanNumber: { type: String }, // optional for staff
});

module.exports = mongoose.model("User", userSchema);
