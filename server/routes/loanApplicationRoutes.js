const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const LoanApplication = require("../models/LoanApplication");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'));
    }
  }
});

// Create a new loan application
router.post("/", async (req, res) => {
  try {
    const applicationData = req.body;
    
    // Create new loan application
    const loanApplication = new LoanApplication(applicationData);
    await loanApplication.save();
    
    res.status(201).json({
      success: true,
      message: "Loan application submitted successfully",
      data: {
        applicationNumber: loanApplication.applicationNumber,
        id: loanApplication._id,
        status: loanApplication.status
      }
    });
  } catch (error) {
    console.error("Error creating loan application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit loan application",
      error: error.message
    });
  }
});

// Upload documents for an application
router.post("/:id/documents", upload.fields([
  { name: 'acceptanceLetter', maxCount: 1 },
  { name: 'certifiedNrc', maxCount: 1 },
  { name: 'certifiedGuardianNrc', maxCount: 1 },
  { name: 'certifiedGrade12Results', maxCount: 1 },
  { name: 'otherSupportingDocuments', maxCount: 1 },
  { name: 'receiptOfPayment', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;
    
    // Find the application
    const application = await LoanApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }
    
    // Update document information
    const updateData = {};
    
    if (files.acceptanceLetter) {
      updateData['university.acceptanceLetter'] = {
        filename: files.acceptanceLetter[0].filename,
        originalName: files.acceptanceLetter[0].originalname,
        mimetype: files.acceptanceLetter[0].mimetype,
        size: files.acceptanceLetter[0].size,
        uploadDate: new Date()
      };
    }
    
    if (files.certifiedNrc) {
      updateData['documents.certifiedNrc'] = {
        filename: files.certifiedNrc[0].filename,
        originalName: files.certifiedNrc[0].originalname,
        mimetype: files.certifiedNrc[0].mimetype,
        size: files.certifiedNrc[0].size,
        uploadDate: new Date()
      };
    }
    
    if (files.certifiedGuardianNrc) {
      updateData['documents.certifiedGuardianNrc'] = {
        filename: files.certifiedGuardianNrc[0].filename,
        originalName: files.certifiedGuardianNrc[0].originalname,
        mimetype: files.certifiedGuardianNrc[0].mimetype,
        size: files.certifiedGuardianNrc[0].size,
        uploadDate: new Date()
      };
    }
    
    if (files.certifiedGrade12Results) {
      updateData['documents.certifiedGrade12Results'] = {
        filename: files.certifiedGrade12Results[0].filename,
        originalName: files.certifiedGrade12Results[0].originalname,
        mimetype: files.certifiedGrade12Results[0].mimetype,
        size: files.certifiedGrade12Results[0].size,
        uploadDate: new Date()
      };
    }
    
    if (files.otherSupportingDocuments) {
      updateData['documents.otherSupportingDocuments'] = {
        filename: files.otherSupportingDocuments[0].filename,
        originalName: files.otherSupportingDocuments[0].originalname,
        mimetype: files.otherSupportingDocuments[0].mimetype,
        size: files.otherSupportingDocuments[0].size,
        uploadDate: new Date()
      };
    }
    
    if (files.receiptOfPayment) {
      updateData['documents.receiptOfPayment'] = {
        filename: files.receiptOfPayment[0].filename,
        originalName: files.receiptOfPayment[0].originalname,
        mimetype: files.receiptOfPayment[0].mimetype,
        size: files.receiptOfPayment[0].size,
        uploadDate: new Date()
      };
    }
    
    // Update the application with document information
    const updatedApplication = await LoanApplication.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    
    res.json({
      success: true,
      message: "Documents uploaded successfully",
      data: updatedApplication
    });
    
  } catch (error) {
    console.error("Error uploading documents:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload documents",
      error: error.message
    });
  }
});

// Get all loan applications (for admin)
router.get("/", async (req, res) => {
  try {
    const applications = await LoanApplication.find()
      .sort({ submittedAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message
    });
  }
});

// Get a single loan application by ID
router.get("/:id", async (req, res) => {
  try {
    const application = await LoanApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }
    
    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch application",
      error: error.message
    });
  }
});

// Update application status (for admin)
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewRemarks, approvedAmount } = req.body;
    
    const updateData = {
      status,
      reviewDate: new Date()
    };
    
    if (reviewRemarks) updateData.reviewRemarks = reviewRemarks;
    if (approvedAmount) updateData.approvedAmount = approvedAmount;
    
    const updatedApplication = await LoanApplication.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    res.json({
      success: true,
      message: "Application status updated successfully",
      data: updatedApplication
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message
    });
  }
});

// Delete a loan application
router.delete("/:id", async (req, res) => {
  try {
    const application = await LoanApplication.findByIdAndDelete(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }
    
    res.json({
      success: true,
      message: "Application deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete application",
      error: error.message
    });
  }
});

module.exports = router;