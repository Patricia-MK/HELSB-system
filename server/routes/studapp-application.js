const express = require("express");
const StudappApplicationDetails = require("../models/studapp-application-details");

const router = express.Router();

// POST /api/studapp/applications - create application
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    if (!body.user || !body.university || !body.program) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const created = await StudappApplicationDetails.create(body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: "Failed to create application" });
  }
});

// GET /api/studapp/applications?userId=...
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { user: userId } : {};
    const docs = await StudappApplicationDetails.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

module.exports = router;


