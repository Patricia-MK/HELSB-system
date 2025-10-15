const express = require("express");
const router = express.Router();
const User = require("../models/User"); // adjust path if needed

// GET student by email
router.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select(
      "fullName studentID loanNumber year nrcNo school institution program qualification email"
    ); // only return relevant fields

    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching student by email:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
