const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
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

// POST /api/upload/documents
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
      if (!studentId) return res.status(400).json({ message: "Missing studentId." });
      if (!loanType) return res.status(400).json({ message: "Missing loanType." });

      const docs = {};
      for (const key in req.files) docs[key] = `/uploads/${req.files[key][0].filename}`;

      let existing = await Upload.findOne({ studentId });
      if (existing) {
        existing.documents = { ...existing.documents, ...docs };
        existing.loanType = loanType;
        await existing.save();
        return res.json({ message: "Documents updated successfully", upload: existing });
      }

      const uploadRecord = new Upload({ studentId, loanType, documents: docs });
      await uploadRecord.save();
      res.json({ message: "Documents uploaded successfully", upload: uploadRecord });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Server error uploading documents" });
    }
  }
);

// GET /api/upload/:studentId
router.get("/:studentId", async (req, res) => {
  try {
    const upload = await Upload.findOne({ studentId: req.params.studentId });
    if (!upload) return res.status(404).json({ message: "No documents found" });
    res.json(upload.documents || {});
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Error fetching documents" });
  }
});

module.exports = router;
