const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema(
  {
    // Application Status
    status: {
      type: String,
      enum: ["Draft", "Submitted", "Under Review", "Approved", "Rejected", "Disbursed"],
      default: "Submitted",
    },

    // Personal Details
    personalDetails: {
      firstName: { type: String, required: true },
      otherName: { type: String, default: "" },
      surname: { type: String, required: true },
      nrcNumber: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
      gender: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      districtOfResidence: { type: String, required: true },
      province: { type: String, required: true },
    },

    // Education Background
    educationBackground: {
      lastSchoolAttended: { type: String, required: true },
      examinationNumber: { type: String, required: true },
      yearOfCompletion: { type: Number, required: true },
      schoolDistrict: { type: String, required: true },
    },

    // Guardian Information
    guardian: {
      firstName: { type: String, required: true },
      surname: { type: String, required: true },
      nrcNumber: { type: String, required: true },
      gender: { type: String, required: true },
      occupation: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      nationality: { type: String, required: true },
      districtOfResidence: { type: String, required: true },
      relationshipToApplicant: { type: String, required: true },
    },

    // University Details
    university: {
      studentNumber: { type: String, required: true },
      selectUniversity: { type: String, required: true },
      enterSchool: { type: String, required: true },
      enterProgram: { type: String, required: true },
      rateOfApplication: { type: String, required: true },
      acceptanceLetter: {
        filename: { type: String },
        originalName: { type: String },
        mimetype: { type: String },
        size: { type: Number },
        uploadDate: { type: Date, default: Date.now },
      },
    },

    // Document Uploads
    documents: {
      certifiedNrc: {
        filename: { type: String },
        originalName: { type: String },
        mimetype: { type: String },
        size: { type: Number },
        uploadDate: { type: Date, default: Date.now },
      },
      certifiedGuardianNrc: {
        filename: { type: String },
        originalName: { type: String },
        mimetype: { type: String },
        size: { type: Number },
        uploadDate: { type: Date, default: Date.now },
      },
      certifiedGrade12Results: {
        filename: { type: String },
        originalName: { type: String },
        mimetype: { type: String },
        size: { type: Number },
        uploadDate: { type: Date, default: Date.now },
      },
      otherSupportingDocuments: {
        filename: { type: String },
        originalName: { type: String },
        mimetype: { type: String },
        size: { type: Number },
        uploadDate: { type: Date, default: Date.now },
      },
      receiptOfPayment: {
        filename: { type: String },
        originalName: { type: String },
        mimetype: { type: String },
        size: { type: Number },
        uploadDate: { type: Date, default: Date.now },
      },
    },

    // Application Metadata
    submittedAt: { type: Date, default: Date.now },
    applicationNumber: { type: String, unique: true },
    
    // Review Information
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewDate: { type: Date },
    reviewRemarks: { type: String },
    approvedAmount: { type: Number },
    disbursementDate: { type: Date },
  },
  { timestamps: true }
);

// Generate application number before saving
loanApplicationSchema.pre("save", async function (next) {
  if (!this.applicationNumber) {
    const count = await this.constructor.countDocuments();
    this.applicationNumber = `HELSB-${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

module.exports = mongoose.model("LoanApplication", loanApplicationSchema);