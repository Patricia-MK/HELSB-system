const express = require("express");
const router = express.Router();

// Try to import Notification model with error handling
let Notification;
try {
  Notification = require("../models/Notification");
  console.log("✅ Notification model loaded successfully");
} catch (err) {
  console.error("❌ Failed to load Notification model:", err);
}

// Create notification
router.post("/", async (req, res) => {
  try {
    // Check if model is available
    if (!Notification) {
      return res.status(500).json({ 
        message: "Notification model not available. Check server logs." 
      });
    }

    const { studentNumber, message, type } = req.body;
    
    console.log("📝 CREATING NOTIFICATION =====================");
    console.log("Student Number:", studentNumber);
    console.log("Message:", message);
    console.log("Type:", type);
    
    if (!studentNumber || !message) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        message: "Missing required fields: studentNumber and message" 
      });
    }

    // Create notification
    const notification = new Notification({
      studentNumber: studentNumber.toString().trim(),
      message: message.toString().trim(),
      type: type || "info"
    });
    
    // Save to database
    const savedNotification = await notification.save();
    console.log("✅ NOTIFICATION SAVED TO DATABASE:", savedNotification._id);
    console.log("Full notification:", savedNotification);
    console.log("===========================================");
    
    res.status(201).json({ 
      message: "Notification created successfully", 
      notification: savedNotification 
    });
    
  } catch (err) {
    console.error("❌ NOTIFICATION CREATION ERROR:", err);
    res.status(500).json({ 
      message: "Server error creating notification",
      error: err.message,
      stack: err.stack
    });
  }
});

// Get notifications for student
router.get("/student/:studentNumber", async (req, res) => {
  try {
    // Check if model is available
    if (!Notification) {
      return res.status(500).json({ 
        message: "Notification model not available. Check server logs." 
      });
    }

    const { studentNumber } = req.params;
    
    console.log("📨 Fetching notifications for:", studentNumber);
    
    const notifications = await Notification.find({ studentNumber: studentNumber.toString().trim() })
      .sort({ createdAt: -1 })
      .limit(50);
    
    console.log(`✅ Found ${notifications.length} notifications for ${studentNumber}`);
    
    res.json(notifications);
  } catch (err) {
    console.error("❌ Get notifications error:", err);
    res.status(500).json({ 
      message: "Error fetching notifications",
      error: err.message 
    });
  }
});

// Test route to check if notifications work
router.get("/test-db", async (req, res) => {
  try {
    // Check if model is available
    if (!Notification) {
      return res.status(500).json({ 
        message: "Notification model not available. Check server logs.",
        modelAvailable: false
      });
    }

    // Count total notifications
    const totalCount = await Notification.countDocuments();
    
    // Get sample notifications
    const sampleNotifications = await Notification.find().limit(5).sort({ createdAt: -1 });
    
    console.log("🧪 DATABASE TEST =====================");
    console.log("Total notifications in DB:", totalCount);
    console.log("Sample notifications:", sampleNotifications);
    console.log("=====================================");
    
    res.json({
      modelAvailable: true,
      totalCount,
      sampleNotifications,
      message: `Database has ${totalCount} notifications total`
    });
  } catch (err) {
    console.error("Database test error:", err);
    res.status(500).json({ 
      error: err.message,
      modelAvailable: false
    });
  }
});

// Test route to create a sample notification
router.post("/test-create", async (req, res) => {
  try {
    // Check if model is available
    if (!Notification) {
      return res.status(500).json({ 
        message: "Notification model not available. Check server logs." 
      });
    }

    const { studentNumber } = req.body;
    const testStudentNumber = studentNumber || "2022100001";
    
    console.log("🧪 CREATING TEST NOTIFICATION ==============");
    
    const testNotification = new Notification({
      studentNumber: testStudentNumber,
      message: "🎉 This is a TEST notification from the server! Created at: " + new Date().toLocaleString(),
      type: "success"
    });
    
    const savedNotification = await testNotification.save();
    
    console.log("✅ Test notification created with ID:", savedNotification._id);
    console.log("Full test notification:", savedNotification);
    console.log("===========================================");
    
    res.json({ 
      message: "Test notification created successfully",
      notification: savedNotification 
    });
  } catch (err) {
    console.error("❌ Test notification error:", err);
    res.status(500).json({ 
      error: err.message,
      stack: err.stack
    });
  }
});

// Simple health check route
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Notifications route is working",
    timestamp: new Date().toISOString(),
    modelAvailable: !!Notification
  });
});

module.exports = router;