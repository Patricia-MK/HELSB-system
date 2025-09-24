// server/routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// ✅ Create new application (student submits)
router.post("/", async (req, res) => {
  try {
    const { studentId, program, loanNumber } = req.body;

    const newApp = new Application({
      student: studentId,
      program,
      loanNumber,
    });

    await newApp.save();
    res.status(201).json({ message: "Application submitted", application: newApp });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to submit application", error: err.message });
  }
});

// ✅ Get all applications (for officials/admin)
router.get("/", async (req, res) => {
  try {
    const apps = await Application.find().populate("student", "fullName email studentID");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// ✅ Update application status (official/admin approves/rejects)
router.put("/:id/status", async (req, res) => {
  try {
    const { status, remarks, reviewedBy } = req.body;
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status, remarks, reviewedBy },
      { new: true }
    );
    res.json({ message: "Application updated", application: app });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;
