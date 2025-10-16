// server/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware to check if user is supervisor
const isSupervisor = (req, res, next) => {
  // In real implementation, you'd check from JWT token or session
  next();
};

// Get dashboard statistics (Supervisor only)
router.get("/dashboard", isSupervisor, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalOfficials = await User.countDocuments({ role: "official" });
    const totalSupervisors = await User.countDocuments({ role: "supervisor" });
    const totalUsers = totalStudents + totalOfficials + totalSupervisors;

    res.json({
      totalUsers,
      totalStudents,
      totalOfficials,
      totalSupervisors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all officials (for management)
router.get("/officials", isSupervisor, async (req, res) => {
  try {
    const officials = await User.find({ role: "official" }).select("-password");
    res.json(officials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new official (Supervisor only)
router.post("/officials", isSupervisor, async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate HELSB email domain
    if (!email.endsWith('@helsb.gov.zm')) {
      return res.status(400).json({ 
        message: "Officials must use @helsb.gov.zm email domain" 
      });
    }

    // Check if official already exists
    const existingOfficial = await User.findOne({ email });
    if (existingOfficial) {
      return res.status(400).json({ message: "Official already exists" });
    }

    // Create new official
    const official = new User({
      fullName,
      email,
      password,
      role: "official"
    });

    await official.save();

    // Return without password
    const officialResponse = official.toObject();
    delete officialResponse.password;

    res.status(201).json(officialResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete official (Supervisor only)
router.delete("/officials/:id", isSupervisor, async (req, res) => {
  try {
    const official = await User.findOneAndDelete({ 
      _id: req.params.id, 
      role: "official" 
    });
    
    if (!official) {
      return res.status(404).json({ message: "Official not found" });
    }
    
    res.json({ message: "Official deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;