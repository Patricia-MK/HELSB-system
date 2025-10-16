const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Upload = require("../models/Upload");
const Agreement = require("../models/Agreement");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only PDF or image files are allowed."));
  },
});

// Upload documents - SIMPLIFIED VERSION
router.post(
  "/documents",
  upload.fields([
    { name: "confirmationSlip" },
    { name: "paymentHistory" },
    { name: "results" },
    { name: "proofOfPayment" },
    { name: "nrc" },
    { name: "bankStatement" },
    { name: "grade12Results" },
    { name: "guardianNrc" },
    { name: "passportPhotos" },
  ]),
  async (req, res) => {
    try {
      const { studentId, loanType } = req.body;
      console.log("=== UPLOAD DEBUG ===");
      console.log("Upload schema paths:", Object.keys(Upload.schema.paths));
      
      console.log("Uploading for studentId:", studentId);
      
      if (!studentId) {
        return res.status(400).json({ message: "Missing studentId" });
      }

      // Find the agreement
      const agreement = await Agreement.findById(studentId);
      if (!agreement) {
        console.log("No agreement found for ID:", studentId);
        return res.status(404).json({ message: "Agreement not found. Please submit agreement form first." });
      }

      console.log("Found agreement for:", agreement.studentNumber);

      const docs = {};
      for (const key in req.files) {
        if (req.files[key] && req.files[key][0]) {
          docs[key] = `/uploads/${req.files[key][0].filename}`;
        }
      }

      // Simple create/update without studentNumber
      let uploadRecord = await Upload.findOne({ studentId: studentId });
      
      if (uploadRecord) {
        uploadRecord.documents = { ...uploadRecord.documents, ...docs };
        uploadRecord.loanType = loanType;
        await uploadRecord.save();
      } else {
        uploadRecord = new Upload({ 
          studentId: studentId,
          loanType: loanType,
          documents: docs
        });
        await uploadRecord.save();
      }

      console.log("Documents saved successfully");
      res.json({ 
        message: "Documents saved successfully", 
        upload: uploadRecord 
      });

    } catch (err) {
      console.error("Upload error:", err);
      
      // More detailed error information
      if (err.name === 'ValidationError') {
        console.log("Validation errors:", err.errors);
        return res.status(400).json({ 
          message: "Validation error: " + Object.keys(err.errors).join(', ') 
        });
      }
      
      res.status(500).json({ message: "Server error uploading documents" });
    }
  }
);

// Fetch by studentNumber
router.get("/student-number/:studentNumber", async (req, res) => {
  try {
    const { studentNumber } = req.params;

    const agreement = await Agreement.findOne({ studentNumber });
    if (!agreement) {
      return res.status(404).json({ message: "Student not found in agreements." });
    }
    
    const upload = await Upload.findOne({ studentId: agreement._id.toString() });

    if (!upload || !upload.documents || Object.keys(upload.documents).length === 0) {
      return res.status(404).json({ message: "No uploaded documents found for this student." });
    }

    res.json(upload.documents || {});
  } catch (err) {
    console.error("Error fetching uploads:", err);
    res.status(500).json({ message: "Server error fetching documents." });
  }
});

module.exports = router;