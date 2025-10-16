// routes/activities.js
const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

// Get all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 }).limit(50);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;