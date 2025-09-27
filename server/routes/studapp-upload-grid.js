const express = require("express");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");

const router = express.Router();

// Storage to MongoDB GridFS using the existing connection
const storage = new GridFsStorage({
  db: mongoose.connection,
  file: (req, file) => {
    return {
      filename: Date.now() + "-" + file.originalname,
      bucketName: "uploads", // fs.files, fs.chunks under bucket name 'uploads'
      metadata: { user: req.body.user || null, purpose: req.body.purpose || null },
    };
  },
});

const upload = multer({ storage });

// POST /api/studapp/upload-grid - Upload single file to GridFS
router.post("/single", upload.single("file"), (req, res) => {
  if (!req.file || !req.file.id) {
    return res.status(400).json({ message: "Upload failed" });
  }
  res.json({ fileId: String(req.file.id), filename: req.file.filename, bucket: req.file.bucketName });
});

module.exports = router;


