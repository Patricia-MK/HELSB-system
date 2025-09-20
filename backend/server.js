// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Application = require("./models/Application");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("HELSB Backend is running ");
});

// Get all applications
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find({});
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Update application status (Approve / Reject / Request Info)
app.patch("/api/applications/:id/decision", async (req, res) => {
  const { status } = req.body;
  try {
    const appToUpdate = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appToUpdate) return res.status(404).json({ error: "Application not found" });
    res.json(appToUpdate);
  } catch (err) {
    res.status(500).json({ error: "Failed to update application" });
  }
});

// Catch-all 404 route
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
