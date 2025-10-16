const express = require("express");
const router = express.Router();
const Agreement = require("../models/Agreement");

// POST - Submit new agreement form
router.post("/", async (req, res) => {
  try {
    console.log("Received agreement data:", req.body);

    const {
      receiptNumber,
      bankName,
      accountName,
      branchName,
      studentLoanNo,
      nrcNo,
      bankAccountNo,
      zraTpin,
      napsaNo,
      program,
      year,
      institution,
      studentNumber,
      qualification,
      school,
      loanRate,
      studentName,
      ceoName,
      date,
      agree
    } = req.body;

    // Validate required fields
    if (!studentNumber || !studentName || !institution || !program || !year) {
      return res.status(400).json({ 
        message: "Missing required fields: studentNumber, studentName, institution, program, year" 
      });
    }

    // Check if agreement already exists for this student
    const existingAgreement = await Agreement.findOne({ studentNumber });
    if (existingAgreement) {
      return res.status(409).json({ 
        message: "An agreement already exists for this student number." 
      });
    }

    // Create new agreement
    const newAgreement = new Agreement({
      receiptNumber,
      bankName,
      accountName,
      branchName,
      studentLoanNo,
      nrcNo,
      bankAccountNo,
      zraTpin,
      napsaNo,
      program,
      year,
      institution,
      studentNumber,
      qualification,
      school,
      loanRate,
      studentName,
      ceoName,
      date: date || new Date(),
      agree: agree === true || agree === "true",
      status: "Pending"
    });

    await newAgreement.save();
    
    console.log("Agreement saved successfully for:", studentNumber);
    
    res.status(201).json({ 
      message: "Agreement submitted successfully!", 
      agreement: newAgreement 
    });

  } catch (err) {
    console.error("Agreement submission error:", err);
    
    if (err.code === 11000) {
      return res.status(409).json({ 
        message: "An agreement already exists for this student number." 
      });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(err.errors).map(e => e.message).join(', ') 
      });
    }
    
    res.status(500).json({ 
      message: "Server error submitting agreement. Please try again." 
    });
  }
});

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