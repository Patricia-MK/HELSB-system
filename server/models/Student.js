const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get student by email
router.get("/email/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      "fullName studentID loanNumber year nrcNo school institution program qualification email"
    );

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;