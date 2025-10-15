// server/routes/agreements.js
const express = require("express");
const router = express.Router();
const Agreement = require("../models/Agreement");

// GET all agreements
router.get("/", async (req, res) => {
  try {
    const agreements = await Agreement.find().sort({ createdAt: -1 });
    res.json(agreements);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Server error fetching agreements" });
  }
});

// PUT /api/agreements/:id/status - update agreement status
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const agreement = await Agreement.findById(req.params.id);
    if (!agreement) return res.status(404).json({ message: "Agreement not found" });

    agreement.status = status;
    await agreement.save();

    res.json({ message: `Status updated to ${status}`, agreement });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server error updating status" });
  }
});

module.exports = router;
