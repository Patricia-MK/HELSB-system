const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Application = require("../models/Application");

// GET all users (students and staff)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// GET all applications
router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find({});
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

module.exports = router;
