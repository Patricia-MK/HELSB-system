const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// GET all applications (official can see submitted applications)
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find({});
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// PATCH update application status (approve/reject/request info)
router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedApp) return res.status(404).json({ message: "Application not found" });
    res.json(updatedApp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update application status" });
  }
});

module.exports = router;
