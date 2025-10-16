const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Upload = require("../models/Upload");
const User = require("../models/User");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error("Invalid file type"));
  },
});

// Upload documents - NO AGREEMENT CHECK
router.post("/documents", 
  upload.fields([
    { name: "confirmationSlip" }, { name: "paymentHistory" }, { name: "results" },
    { name: "proofOfPayment" }, { name: "nrc" }, { name: "bankStatement" },
    { name: "grade12Results" }, { name: "guardianNrc" }, { name: "passportPhotos" }
  ]),
  async (req, res) => {
    try {
      const { studentId, loanType } = req.body;
      console.log("📁 UPLOAD REQUEST - Student ID:", studentId);
      
      if (!studentId) {
        return res.status(400).json({ message: "Missing studentId" });
      }

      // ONLY CHECK IF USER EXISTS - NO AGREEMENT REQUIRED
      const user = await User.findById(studentId);
      if (!user) {
        console.log("❌ User not found with ID:", studentId);
        return res.status(404).json({ message: "User not found. Please log in again." });
      }

      console.log("✅ Found user:", user.fullName, "Student ID:", user.studentID);

      // Process files
      const docs = {};
      for (const key in req.files) {
        if (req.files[key] && req.files[key][0]) {
          docs[key] = `/uploads/${req.files[key][0].filename}`;
          console.log(`✅ Processed ${key}: ${docs[key]}`);
        }
      }

      // Check if we have any files
      if (Object.keys(docs).length === 0) {
        return res.status(400).json({ message: "No files were uploaded." });
      }

      console.log("📁 Files to save:", Object.keys(docs));

      // Create/update upload record - NO AGREEMENT CHECK
      let uploadRecord = await Upload.findOne({ studentId: studentId });
      
      if (uploadRecord) {
        // Update existing record
        uploadRecord.documents = { ...uploadRecord.documents, ...docs };
        uploadRecord.loanType = loanType;
        uploadRecord.studentNumber = user.studentID;
        await uploadRecord.save();
        console.log("✅ Updated existing upload record");
      } else {
        // Create new record
        uploadRecord = new Upload({
          studentId: studentId,
          studentNumber: user.studentID,
          loanType: loanType || "first-timer",
          documents: docs
        });
        await uploadRecord.save();
        console.log("✅ Created new upload record");
      }

      console.log("🎉 Documents saved successfully for student:", user.studentID);
      
      res.json({ 
        message: "Documents uploaded successfully!",
        status: "success",
        upload: uploadRecord 
      });

    } catch (err) {
      console.error("❌ Upload error:", err);
      res.status(500).json({ 
        message: "Server error uploading documents: " + err.message 
      });
    }
  }
);

// ✅ NEW ROUTE: Get uploads by student ID (for StudentProfile component)
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log("🔍 Fetching uploads for student ID:", studentId);
    
    if (!studentId || studentId === 'undefined') {
      console.log("❌ Student ID is undefined");
      return res.status(400).json({ 
        message: "Student ID is required",
        uploads: [] 
      });
    }

    // Find the user first to get student info
    const user = await User.findById(studentId);
    if (!user) {
      console.log("❌ User not found with ID:", studentId);
      return res.status(404).json({ 
        message: "Student not found",
        uploads: [] 
      });
    }

    console.log("✅ Found student:", user.fullName, "Type:", user.studentType);

    // Determine required uploads based on student type
    let requiredUploads = [];
    
    if (user.studentType === 'firstYear' || user.studentType === 'first-timer') {
      // First years need more documents
      requiredUploads = [
        'confirmationSlip',
        'paymentHistory', 
        'proofOfPayment',
        'nrc',
        'passportPhotos',
        'grade12Results',
        'guardianNrc',
        'bankStatement'
      ];
      console.log("🎓 First year student - more documents required");
    } else {
      // Returning students need fewer documents
      requiredUploads = [
        'confirmationSlip',
        'paymentHistory',
        'results', // academic results from previous years
        'proofOfPayment',
        'nrc',
        'passportPhotos'
      ];
      console.log("📚 Returning student - standard documents required");
    }

    // Find existing uploads
    const uploadRecord = await Upload.findOne({ studentId: studentId });
    const existingUploads = uploadRecord?.documents ? Object.keys(uploadRecord.documents) : [];
    
    console.log("✅ Required uploads:", requiredUploads);
    console.log("✅ Existing uploads:", existingUploads);

    res.json({ 
      uploads: requiredUploads,
      existingUploads: existingUploads,
      studentType: user.studentType,
      studentName: user.fullName
    });
    
  } catch (err) {
    console.error("❌ Error fetching uploads by student ID:", err);
    res.status(500).json({ 
      message: "Server error fetching upload requirements.",
      uploads: [] 
    });
  }
});

// Get uploads by student number - EXISTING ROUTE (keep this for OfficialDashboard)
router.get("/student-id:studentNumber", async (req, res) => {
  try {
    const { studentNumber } = req.params;
    console.log("🔍 Fetching uploads for student:", studentNumber);
    
    if (!studentNumber) {
      return res.status(400).json({ message: "Student number is required" });
    }

    // Find upload by studentNumber
    const upload = await Upload.findOne({ studentNumber: studentNumber });
    
    if (!upload) {
      console.log("❌ No upload record found for student:", studentNumber);
      return res.status(404).json({ message: "No uploaded documents found for this student." });
    }

    if (!upload.documents || Object.keys(upload.documents).length === 0) {
      console.log("❌ No documents in upload record for student:", studentNumber);
      return res.status(404).json({ message: "No documents found in upload record." });
    }

    console.log("✅ Found uploads:", Object.keys(upload.documents));
    
    // Return the documents object directly for compatibility
    res.json(upload.documents);
    
  } catch (err) {
    console.error("❌ Error fetching uploads:", err);
    res.status(500).json({ message: "Server error fetching documents." });
  }
});

module.exports = router;