// server/routes/officialRoutes.js
const express = require("express");
const router = express.Router();
const Agreement = require("../models/Agreement");

// GET all agreements for official dashboard
router.get("/", async (req, res) => {
  try {
    const agreements = await Agreement.find().sort({ date: -1 });
    res.status(200).json(agreements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch agreements" });
  }
});

// PUT update agreement status (approve/reject)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedAgreement = await Agreement.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedAgreement) return res.status(404).json({ message: "Agreement not found" });
    res.status(200).json(updatedAgreement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update agreement status" });
  }
});

module.exports = router;
