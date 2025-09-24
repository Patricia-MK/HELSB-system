const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Upload = require("../models/Upload");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload documents route
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
      const { studentId } = req.body;
      if (!studentId) {
        return res.status(400).json({ message: "Missing studentId" });
      }

      const docPaths = {};
      for (const key in req.files) {
        docPaths[key] = `/uploads/${req.files[key][0].filename}`; // public URL
      }

      const newUpload = new Upload({
        studentId,
        documents: docPaths,
      });

      await newUpload.save();
      res.status(200).json({ status: "success", upload: newUpload, message: "Documents uploaded successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
