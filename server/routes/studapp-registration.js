const express = require("express");
const StudappRegistrationProfile = require("../models/studapp-registration-profile");

const router = express.Router();

// GET /api/studapp/registration/me
router.get("/me", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    const profile = await StudappRegistrationProfile.findOne({ user: userId });
    res.json(profile || null);
  } catch (err) {
    res.status(500).json({ message: "Failed to load registration" });
  }
});

// PUT /api/studapp/registration - upsert profile sections
router.put("/", async (req, res) => {
  try {
    const { user, personal, education, guardian, attachments, status } = req.body;
    if (!user) return res.status(400).json({ message: "Missing user" });
    const updated = await StudappRegistrationProfile.findOneAndUpdate(
      { user },
      { $set: { personal, education, guardian, attachments, status } },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to save registration" });
  }
});

module.exports = router;


