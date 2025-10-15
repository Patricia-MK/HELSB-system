// server/routes/upload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Upload = require("../models/Upload");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

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

// POST upload documents
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
      console.log("📁 Upload request received");
      console.log("Body:", req.body);
      console.log("Files:", req.files);

      const { studentId, loanType } = req.body;
<<<<<<< HEAD
      if (!studentId) {
        return res.status(400).json({ 
          status: "error", 
          message: "Missing studentId." 
        });
      }
      
      if (!loanType) {
        return res.status(400).json({ 
          status: "error", 
          message: "Missing loanType." 
        });
      }
=======
      if (!studentId || !loanType) return res.status(400).json({ message: "Missing studentId or loanType" });
>>>>>>> 921d91b (Updated OfficialDashboard and AdminDashboard with new features)

      const docs = {};
      if (req.files) {
        for (const key in req.files) {
          if (req.files[key] && req.files[key][0]) {
            docs[key] = `/uploads/${req.files[key][0].filename}`;
          }
        }
      }

      console.log("Processed documents:", docs);

      let existing = await Upload.findOne({ studentId: studentId });
      if (existing) {
        existing.documents = { ...existing.documents, ...docs };
        existing.loanType = loanType;
        await existing.save();
        return res.json({ 
          status: "success", 
          message: "Documents updated successfully", 
          upload: existing 
        });
      }

      const uploadRecord = new Upload({ studentId, loanType, documents: docs });
      await uploadRecord.save();
      
      console.log("✅ Upload saved successfully");
      
      res.json({ 
        status: "success", 
        message: "Documents uploaded successfully", 
        upload: uploadRecord 
      });
      
    } catch (err) {
      console.error("❌ Upload error:", err);
      res.status(500).json({ 
        status: "error", 
        message: "Server error uploading documents: " + err.message 
      });
    }
  }
);

// GET uploads by studentId
router.get("/:studentId", async (req, res) => {
  try {
<<<<<<< HEAD
    const upload = await Upload.findOne({ studentId: req.params.studentId });
    if (!upload) return res.json({ documents: {} }); // Return empty object instead of 404
    
=======
    const { studentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid studentId" });
    }

    const upload = await Upload.findOne({ studentId });
    if (!upload) return res.status(404).json({ message: "No documents found" });

>>>>>>> 921d91b (Updated OfficialDashboard and AdminDashboard with new features)
    res.json(upload.documents || {});
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Error fetching documents" });
  }
});

module.exports = router;