const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Upload = require("../models/Upload");

// Get student profile by email
router.get("/email/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ NEW ROUTE: Get required uploads for student by ID
router.get("/uploads/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log("🔍 StudentProfile: Fetching uploads for student ID:", studentId);
    
    if (!studentId || studentId === 'undefined') {
      return res.status(400).json({ 
        message: "Valid student ID is required",
        uploads: [] 
      });
    }

    // Use the new upload route we created
    const response = await fetch(`http://localhost:5000/api/upload/student/${studentId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("✅ StudentProfile: Received uploads data:", data);
    
    res.json(data);
  } catch (error) {
    console.error("❌ StudentProfile: Error fetching uploads:", error);
    res.status(500).json({ 
      message: "Server error fetching upload requirements",
      uploads: [] 
    });
  }
});

// Get student documents by student ID - FIXED VERSION
router.get("/documents/:studentId", async (req, res) => {
  try {
    const uploads = await Upload.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    
    if (!uploads || uploads.length === 0) {
      return res.json({ documents: [] });
    }

    // Get the latest upload
    const latestUpload = uploads[0];
    
    if (latestUpload.documents && typeof latestUpload.documents === 'object') {
      const documents = Object.entries(latestUpload.documents)
        .filter(([name, url]) => url && url !== '' && url !== null && url !== undefined)
        .map(([name, url]) => ({
          name: name.replace(/([A-Z])/g, ' $1').replace(/([a-z])([A-Z])/g, '$1 $2').trim(),
          url: url.startsWith('http') ? url : `http://localhost:5000${url}`
        }));
      
      res.json({ documents });
    } else {
      res.json({ documents: [] });
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: "Server error", documents: [] });
  }
});

// Calculate loan balance based on year
router.get("/loan-calculation/:studentId", async (req, res) => {
  try {
    const user = await User.findById(req.params.studentId);
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Use pre-calculated loan details from seed or calculate fresh
    if (user.loanDetails && user.loanDetails.totalDisbursed) {
      res.json(user.loanDetails);
    } else {
      // Fallback calculation
      const year = user.year || 1;
      const tuitionPerYear = 25808;
      const accommodationPerYear = 3900;
      const mealAllowancePerYear = 9000;
      const totalPerYear = tuitionPerYear + accommodationPerYear + mealAllowancePerYear;
      
      const totalDisbursed = totalPerYear * year;
      const totalRepaid = tuitionPerYear * (year - 1);
      const remainingBalance = totalDisbursed - totalRepaid;

      const loanInfo = {
        totalDisbursed,
        totalRepaid,
        remainingBalance,
        currentYearAllocation: {
          tuition: tuitionPerYear,
          accommodation: accommodationPerYear,
          mealAllowance: mealAllowancePerYear,
          total: totalPerYear
        }
      };

      res.json(loanInfo);
    }
  } catch (error) {
    console.error("Error calculating loan:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;