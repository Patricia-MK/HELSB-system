const express = require("express");
const StudappUniversity = require("../models/studapp-university");
const StudappSchool = require("../models/studapp-school");
const StudappProgram = require("../models/studapp-program");

const router = express.Router();

// GET /api/studapp/academics/universities
router.get("/universities", async (req, res) => {
  try {
    const docs = await StudappUniversity.find().sort({ name: 1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load universities" });
  }
});

// GET /api/studapp/academics/schools?universityId=...
router.get("/schools", async (req, res) => {
  try {
    const { universityId } = req.query;
    if (!universityId) return res.status(400).json({ message: "Missing universityId" });
    const schools = await StudappSchool.find({ universityId }).sort({ name: 1 });
    res.json(schools);
  } catch (err) {
    res.status(500).json({ message: "Failed to load schools" });
  }
});

// GET /api/studapp/academics/programs?schoolId=...
router.get("/programs", async (req, res) => {
  try {
    const { schoolId } = req.query;
    if (!schoolId) return res.status(400).json({ message: "Missing schoolId" });
    const programs = await StudappProgram.find({ schoolId }).sort({ name: 1 });
    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load programs" });
  }
});

module.exports = router;


