const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret123"; // in real apps, use env variable

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create safe user object without sensitive data
    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      // Only include student-specific fields if they exist and user is student
      ...(user.role === 'student' && {
        studentID: user.studentID,
        loanNumber: user.loanNumber,
        year: user.year,
        nrcNo: user.nrcNo,
        program: user.program,
        school: user.school,
        institution: user.institution,
        qualification: user.qualification,
        loanDetails: user.loanDetails
      })
    };

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ 
      user: userData, 
      token,
      message: "Login successful" 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// DEBUG ROUTE - Add this to auth.js
router.post("/login-debug", async (req, res) => {
  const { email, password } = req.body;
  console.log("=== LOGIN DEBUG ===");
  console.log("Email:", email);
  console.log("Password:", password);

  try {
    const user = await User.findOne({ email });
    console.log("User found:", user ? "YES" : "NO");
    
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(400).json({ message: "User not found", debug: "No user with this email" });
    }

    console.log("User role:", user.role);
    console.log("Stored password (first 50 chars):", user.password.substring(0, 50) + "...");
    console.log("Is password hashed?", user.password.startsWith('$2b$'));
    console.log("Password length:", user.password.length);

    // Test password comparison
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password matches:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(400).json({ message: "Invalid password", debug: "Password comparison failed" });
    }

    console.log("✅ Login successful!");
    res.json({ 
      success: true, 
      message: "Debug login successful",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      }
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;