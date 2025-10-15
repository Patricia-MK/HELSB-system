// server/routes/notifications.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// POST create notification
router.post("/", async (req, res) => {
  const { studentId, message } = req.body;
  if (!studentId || !message) return res.status(400).json({ message: "Missing studentId or message" });

  try {
    const notification = await Notification.create({ studentId, message, read: false });
    res.json({ message: "Notification sent", notification });
  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ message: "Server error sending notification" });
  }
});

// GET notifications for a student
router.get("/:studentId", async (req, res) => {
  try {
    const notifications = await Notification.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
});

module.exports = router;
