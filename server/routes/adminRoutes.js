// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

// Mock data for officials
let officials = [
  {
    _id: "1",
    name: "Dr. John Machayi",
    email: "john.machayi@helsb.gov.zm",
    role: "super_admin",
    department: "Management",
    createdAt: new Date()
  },
  {
    _id: "2", 
    name: "Sarah Banda",
    email: "sarah.banda@helsb.gov.zm",
    role: "official",
    department: "Screening",
    createdAt: new Date()
  }
];

// Get all officials
router.get("/officials", (req, res) => {
  res.json(officials);
});

// Add new official
router.post("/officials", (req, res) => {
  const { name, email, role, department } = req.body;
  const newOfficial = {
    _id: Date.now().toString(),
    name,
    email,
    role: role || "official",
    department: department || "General",
    createdAt: new Date()
  };
  officials.push(newOfficial);
  res.json({ message: "Official added successfully", official: newOfficial });
});

// Delete official
router.delete("/officials/:id", (req, res) => {
  const { id } = req.params;
  officials = officials.filter(official => official._id !== id);
  res.json({ message: "Official deleted successfully" });
});

module.exports = router;