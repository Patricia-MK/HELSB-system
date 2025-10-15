const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Create notification
router.post("/", async (req, res) => {
  try {
    const { studentNumber, message, type } = req.body;
    
    console.log("Creating notification for:", studentNumber, "Message:", message);
    
    const notification = new Notification({
      studentNumber,
      message,
      type: type || "info"
    });
    
    await notification.save();
    console.log("✅ Notification created successfully");
    res.status(201).json({ message: "Notification created", notification });
  } catch (err) {
    console.error("❌ Notification error:", err);
    res.status(500).json({ message: "Error creating notification" });
  }
});

// Get notifications for student
router.get("/student/:studentNumber", async (req, res) => {
  try {
    const { studentNumber } = req.params;
    
    console.log("Fetching notifications for:", studentNumber);
    
    const notifications = await Notification.find({ studentNumber })
      .sort({ createdAt: -1 })
      .limit(50);
    
    console.log(`✅ Found ${notifications.length} notifications`);
    res.json(notifications);
  } catch (err) {
    console.error("❌ Get notifications error:", err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// Mark notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ message: "Error updating notification" });
  }
});

// Mark all as read
router.put("/student/:studentNumber/read-all", async (req, res) => {
  try {
    const { studentNumber } = req.params;
    
    await Notification.updateMany(
      { studentNumber, read: false },
      { read: true }
    );
    
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Mark all read error:", err);
    res.status(500).json({ message: "Error updating notifications" });
  }
});

module.exports = router;