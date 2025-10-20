const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // ADD THIS

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "supervisor", "official"], required: true },
  year: { type: Number }, // optional for staff
  studentID: { type: String }, // optional for staff
  loanNumber: { type: String }, // optional for staff
  nrcNo: { type: String }, // optional for staff
  program: { type: String }, // optional for staff
  qualification: { type: String }, // optional for staff
  school: { type: String }, // optional for staff
  institution: { type: String }, // optional for staff
  loanDetails: {
    totalDisbursed: { type: Number, default: 0 },
    totalRepaid: { type: Number, default: 0 },
    remainingBalance: { type: Number, default: 0 }
  }
}, {
  timestamps: true // ADD THIS TOO
});

// ADD THIS PASSWORD HASHING MIDDLEWARE
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with salt rounds
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);