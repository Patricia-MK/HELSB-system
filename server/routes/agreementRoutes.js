// server/routes/agreementRoutes.js
const express = require("express");
const router = express.Router();
const Agreement = require("../models/Agreement");

// POST /api/agreements - save agreement form
router.post("/", async (req, res) => {
  try {
    const agreement = new Agreement(req.body);
    await agreement.save();
    res.status(201).json({ message: "Agreement submitted successfully", agreement });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to submit agreement", error: err.message });
  }
});

module.exports = router;
