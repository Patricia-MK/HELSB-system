import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import helsbLogo from "../assets/images/helsblogo.jpg";
import "./StudentApplicationForm.css";

const StudentApplicationForm = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Details
    personalDetails: {
      firstName: "",
      otherName: "",
      surname: "",
      nrcNumber: "",
      dateOfBirth: "",
      gender: "",
      phoneNumber: "",
      districtOfResidence: "",
      province: ""
    },
    
    // Education Background
    educationBackground: {
      lastSchoolAttended: "",
      examinationNumber: "",
      yearOfCompletion: "",
      schoolDistrict: ""
    },
    
    // Guardian Information
    guardian: {
      firstName: "",
      surname: "",
      nrcNumber: "",
      gender: "",
      occupation: "",
      phoneNumber: "",
      nationality: "",
      districtOfResidence: "",
      relationshipToApplicant: ""
    },
    
    // University Information
    university: {
      studentNumber: "",
      selectUniversity: "",
      enterSchool: "",
      enterProgram: "",
      rateOfApplication: "",
      acceptanceLetter: null
    },
    
    // Document Uploads
    documents: {
      certifiedNrc: null,
      certifiedGuardianNrc: null,
      certifiedGrade12Results: null,
      otherSupportingDocuments: null,
      receiptOfPayment: null
    },
    
    // Confirmation Checkboxes
    confirmations: {
      validDetails: false,
      termsAccepted: false
    }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileChange = (field, file) => {
    if (field === "acceptanceLetter") {
      setFormData(prev => ({
        ...prev,
        university: {
          ...prev.university,
          [field]: file
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: file
        }
      }));
    }
  };



  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(6, prev + 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const validateCurrentStep = () => {
    // For Step 6 (Review), check if confirmation checkboxes are checked
    if (currentStep === 6) {
      if (!formData.confirmations.validDetails) {
        setError("Please confirm that all information provided is accurate and valid.");
        return false;
      }
      if (!formData.confirmations.termsAccepted) {
        setError("Please accept the terms and conditions to proceed.");
        return false;
      }
    }
    
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Prepare form data for submission
      const submissionData = {
        personalDetails: formData.personalDetails,
        educationBackground: formData.educationBackground,
        guardian: formData.guardian,
        university: {
          studentNumber: formData.university.studentNumber,
          selectUniversity: formData.university.selectUniversity,
          enterSchool: formData.university.enterSchool,
          enterProgram: formData.university.enterProgram,
          rateOfApplication: formData.university.rateOfApplication,
        },
        documents: {
          // Document file information will be uploaded separately
        }
      };

      // Submit application data
      const response = await fetch("http://localhost:5000/api/loan-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit application");
      }

      // Upload documents if any files are selected
      const applicationId = result.data.id;
      const formDataToUpload = new FormData();

      // Add files to FormData
      if (formData.university.acceptanceLetter) {
        formDataToUpload.append("acceptanceLetter", formData.university.acceptanceLetter);
      }
      if (formData.documents.certifiedNrc) {
        formDataToUpload.append("certifiedNrc", formData.documents.certifiedNrc);
      }
      if (formData.documents.certifiedGuardianNrc) {
        formDataToUpload.append("certifiedGuardianNrc", formData.documents.certifiedGuardianNrc);
      }
      if (formData.documents.certifiedGrade12Results) {
        formDataToUpload.append("certifiedGrade12Results", formData.documents.certifiedGrade12Results);
      }
      if (formData.documents.otherSupportingDocuments) {
        formDataToUpload.append("otherSupportingDocuments", formData.documents.otherSupportingDocuments);
      }
      if (formData.documents.receiptOfPayment) {
        formDataToUpload.append("receiptOfPayment", formData.documents.receiptOfPayment);
      }

      // Upload documents if any files exist
      const hasFiles = formDataToUpload.has("acceptanceLetter") || 
                      formDataToUpload.has("certifiedNrc") || 
                      formDataToUpload.has("certifiedGuardianNrc") || 
                      formDataToUpload.has("certifiedGrade12Results") || 
                      formDataToUpload.has("otherSupportingDocuments") || 
                      formDataToUpload.has("receiptOfPayment");

      if (hasFiles) {
        const uploadResponse = await fetch(`http://localhost:5000/api/loan-applications/${applicationId}/documents`, {
          method: "POST",
          body: formDataToUpload,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          console.warn("Documents upload failed:", uploadResult.message);
          // Don't throw error here, application was still submitted successfully
        }
      }
      
      // Show success modal
      setApplicationNumber(result.data.applicationNumber);
      setShowSuccessModal(true);
      setLoading(false);
    } catch (error) {
      console.error("Submission error:", error);
      setError(`Failed to submit application: ${error.message}`);
      setLoading(false);
    }
  };

  const provinces = [
    "Central Province", "Copperbelt Province", "Eastern Province",
    "Luapula Province", "Lusaka Province", "Muchinga Province",
    "Northern Province", "North-Western Province", "Southern Province",
    "Western Province"
  ];

  const institutions = [
    "University", "University of Zambia", "Copperbelt University", "Mulungushi University",
    "Chalimbana University", "Kwame Nkrumah University", "Mukuba University",
    "Kapasa Makasa University", "Palabana University", "Zambia University College of Technology"
  ];

  const programs = [
    "Computer Science", "Civil Engineering", "Mechanical Engineering",
    "Medicine", "Law", "Economics", "Education", "Nursing",
    "Agricultural Science", "Mathematics", "Business Administration"
  ];

  return (
    <div className="student-application-form">
      {/* Persistent Navigation Bar */}
      <nav className="application-navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            {/* Back Button */}
            <button className="back-button" onClick={handleBackClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>

            <div className="navbar-logo" onClick={() => navigate("/student-application")}>
              <img src={helsbLogo} alt="HELSB Logo" className="logo-img" />
              <span className="logo-text">HELSB</span>
            </div>
          </div>

          <div className="navbar-right">
            <div className="navbar-menu">
              <button className="nav-link" onClick={() => navigate("/")}>
                Home
              </button>
              <button className="nav-link" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="nav-link" onClick={() => navigate("/contact")}>
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Combined Progress and Form Container */}
      <div className="progress-container">
        <div className="progress-wrapper">
          <div className="progress-steps">
            {[
              { number: 1, title: "Personal Details", description: "Basic information" },
              { number: 2, title: "Education Background", description: "School information" },
              { number: 3, title: "Guardian Information", description: "Guardian details" },
              { number: 4, title: "University Details", description: "University information" },
              { number: 5, title: "Document Upload", description: "Required attachments" },
              { number: 6, title: "Review & Submit", description: "Final confirmation" }
            ].map((step, index) => (
              <div
                key={step.number}
                className={`progress-step ${currentStep >= step.number ? "active" : ""} ${currentStep === step.number ? "current" : ""}`}
              >
                <div className="step-indicator">
                  <div className="step-number">{step.number}</div>
                  {currentStep > step.number && <div className="checkmark">✓</div>}
                </div>
                <div className="step-content">
                  <div className="step-title">{step.title}</div>
                  <div className="step-description">{step.description}</div>
                </div>
                {index < 4 && <div className={`step-connector ${currentStep > step.number ? "completed" : ""}`}></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Main Form Content */}
        <div className="form-content">
        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div className="form-step">
            <div className="step-header">
              <h2>Personal Details</h2>
              <p>Please provide your personal information for identification purposes.</p>
            </div>
            <div className="form-sections">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={formData.personalDetails.firstName}
                      onChange={(e) => handleInputChange("personalDetails", "firstName", e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Other Name</label>
                    <input
                      type="text"
                      value={formData.personalDetails.otherName}
                      onChange={(e) => handleInputChange("personalDetails", "otherName", e.target.value)}
                      placeholder="Enter your other name (if any)"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Surname</label>
                    <input
                      type="text"
                      value={formData.personalDetails.surname}
                      onChange={(e) => handleInputChange("personalDetails", "surname", e.target.value)}
                      placeholder="Enter your surname"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>NRC Number</label>
                    <input
                      type="text"
                      value={formData.personalDetails.nrcNumber}
                      onChange={(e) => handleInputChange("personalDetails", "nrcNumber", e.target.value)}
                      placeholder="123456/78/9"
                    />
                    <small>Format: 6 digits/2 digits/1 digit</small>
                  </div>
                  
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.personalDetails.dateOfBirth}
                      onChange={(e) => handleInputChange("personalDetails", "dateOfBirth", e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={formData.personalDetails.gender}
                      onChange={(e) => handleInputChange("personalDetails", "gender", e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="phone-input-group">
                      <span className="country-code">+260</span>
                      <input
                        type="tel"
                        value={formData.personalDetails.phoneNumber}
                        onChange={(e) => handleInputChange("personalDetails", "phoneNumber", e.target.value)}
                        placeholder="977123456"
                      />
                    </div>
                    <small>Enter 9 digits without the +260 prefix</small>
                  </div>
                  
                  <div className="form-group">
                    <label>District of Residence</label>
                    <input
                      type="text"
                      value={formData.personalDetails.districtOfResidence}
                      onChange={(e) => handleInputChange("personalDetails", "districtOfResidence", e.target.value)}
                      placeholder="Enter your district of residence"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Province</label>
                    <select
                      value={formData.personalDetails.province}
                      onChange={(e) => handleInputChange("personalDetails", "province", e.target.value)}
                    >
                      <option value="">Select Province</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Education Background */}
        {currentStep === 2 && (
          <div className="form-step">
            <div className="step-header">
              <h2>Education Background</h2>
              <p>Please provide information about your previous education.</p>
            </div>
            <div className="form-sections">
              <div className="form-section">
                <h3>School Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Last School Attended</label>
                    <input
                      type="text"
                      value={formData.educationBackground.lastSchoolAttended}
                      onChange={(e) => handleInputChange("educationBackground", "lastSchoolAttended", e.target.value)}
                      placeholder="Enter the name of your last school"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Examination Number</label>
                    <input
                      type="text"
                      value={formData.educationBackground.examinationNumber}
                      onChange={(e) => handleInputChange("educationBackground", "examinationNumber", e.target.value)}
                      placeholder="Enter your examination number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Year of Completion</label>
                    <input
                      type="number"
                      value={formData.educationBackground.yearOfCompletion}
                      onChange={(e) => handleInputChange("educationBackground", "yearOfCompletion", e.target.value)}
                      placeholder="e.g., 2023"
                      min="1990"
                      max="2024"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>School District</label>
                    <input
                      type="text"
                      value={formData.educationBackground.schoolDistrict}
                      onChange={(e) => handleInputChange("educationBackground", "schoolDistrict", e.target.value)}
                      placeholder="Enter the district where your school is located"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Guardian Information */}
        {currentStep === 3 && (
          <div className="form-step">
            <div className="step-header">
              <h2>Guardian Information</h2>
              <p>Please provide information about your guardian or parent.</p>
            </div>
            <div className="form-sections">
              <div className="form-section">
                <h3>Guardian Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={formData.guardian.firstName}
                      onChange={(e) => handleInputChange("guardian", "firstName", e.target.value)}
                      placeholder="Enter guardian's first name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Surname</label>
                    <input
                      type="text"
                      value={formData.guardian.surname}
                      onChange={(e) => handleInputChange("guardian", "surname", e.target.value)}
                      placeholder="Enter guardian's surname"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>NRC Number</label>
                    <input
                      type="text"
                      value={formData.guardian.nrcNumber}
                      onChange={(e) => handleInputChange("guardian", "nrcNumber", e.target.value)}
                      placeholder="123456/78/9"
                    />
                    <small>Format: 6 digits/2 digits/1 digit</small>
                  </div>
                  
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={formData.guardian.gender}
                      onChange={(e) => handleInputChange("guardian", "gender", e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Occupation</label>
                    <input
                      type="text"
                      value={formData.guardian.occupation}
                      onChange={(e) => handleInputChange("guardian", "occupation", e.target.value)}
                      placeholder="Enter guardian's occupation"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="phone-input-group">
                      <span className="country-code">+260</span>
                      <input
                        type="tel"
                        value={formData.guardian.phoneNumber}
                        onChange={(e) => handleInputChange("guardian", "phoneNumber", e.target.value)}
                        placeholder="977123456"
                      />
                    </div>
                    <small>Enter 9 digits without the +260 prefix</small>
                  </div>
                  
                  <div className="form-group">
                    <label>Nationality</label>
                    <input
                      type="text"
                      value={formData.guardian.nationality}
                      onChange={(e) => handleInputChange("guardian", "nationality", e.target.value)}
                      placeholder="Enter guardian's nationality"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>District of Residence</label>
                    <input
                      type="text"
                      value={formData.guardian.districtOfResidence}
                      onChange={(e) => handleInputChange("guardian", "districtOfResidence", e.target.value)}
                      placeholder="Enter guardian's district of residence"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Relationship to Applicant</label>
                    <select
                      value={formData.guardian.relationshipToApplicant}
                      onChange={(e) => handleInputChange("guardian", "relationshipToApplicant", e.target.value)}
                    >
                      <option value="">Select Relationship</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Aunt">Aunt</option>
                      <option value="Grandfather">Grandfather</option>
                      <option value="Grandmother">Grandmother</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: University Details */}
        {currentStep === 4 && (
          <div className="form-step">
            <div className="step-header">
              <h2>University Details</h2>
              <p>Please provide information about your university enrollment.</p>
            </div>
            <div className="form-sections">
              <div className="form-section">
                <h3>University Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Student Number</label>
                    <input
                      type="text"
                      value={formData.university.studentNumber}
                      onChange={(e) => handleInputChange("university", "studentNumber", e.target.value)}
                      placeholder="Enter your student number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Select University</label>
                    <select
                      value={formData.university.selectUniversity}
                      onChange={(e) => handleInputChange("university", "selectUniversity", e.target.value)}
                    >
                      <option value="">Select University</option>
                      {institutions.map(institution => (
                        <option key={institution} value={institution}>{institution}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Enter School</label>
                    <select
                      value={formData.university.enterSchool}
                      onChange={(e) => handleInputChange("university", "enterSchool", e.target.value)}
                    >
                      <option value="">Select School</option>
                      {institutions.map(institution => (
                        <option key={institution} value={institution}>{institution}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Enter Program</label>
                    <select
                      value={formData.university.enterProgram}
                      onChange={(e) => handleInputChange("university", "enterProgram", e.target.value)}
                    >
                      <option value="">Select Program</option>
                      {programs.map(program => (
                        <option key={program} value={program}>{program}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Rate of Application</label>
                    <select
                      value={formData.university.rateOfApplication}
                      onChange={(e) => handleInputChange("university", "rateOfApplication", e.target.value)}
                    >
                      <option value="">Select Rate</option>
                      <option value="25">25%</option>
                      <option value="50">50%</option>
                      <option value="75">75%</option>
                      <option value="100">100%</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Acceptance Letter</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange("acceptanceLetter", e.target.files[0])}
                    />
                    <small>PDF only (Max 5MB)</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Document Upload */}
        {currentStep === 5 && (
          <div className="form-step">
            <div className="step-header">
              <h2>Document Upload</h2>
              <p>Please upload all required documents for your loan application.</p>
            </div>
            <div className="form-sections">
              <div className="form-section">
                <h3>Required Documents</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Certified NRC Copy</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("certifiedNrc", e.target.files[0])}
                    />
                    <small>PDF, JPG, PNG (Max 5MB)</small>
                  </div>
                  
                  <div className="form-group">
                    <label>Certified Guardian NRC Copy</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("certifiedGuardianNrc", e.target.files[0])}
                    />
                    <small>PDF, JPG, PNG (Max 5MB)</small>
                  </div>
                  
                  <div className="form-group">
                    <label>Certified Grade 12 Results</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("certifiedGrade12Results", e.target.files[0])}
                    />
                    <small>PDF, JPG, PNG (Max 5MB)</small>
                  </div>
                  
                  <div className="form-group">
                    <label>Other Supporting Documents</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("otherSupportingDocuments", e.target.files[0])}
                    />
                    <small>PDF, JPG, PNG (Max 5MB) - Optional</small>
                  </div>
                  
                  <div className="form-group">
                    <label>Receipt of Payment</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("receiptOfPayment", e.target.files[0])}
                    />
                    <small>PDF, JPG, PNG (Max 5MB)</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Review and Submit */}
        {currentStep === 6 && (
          <div className="form-step">
            <div className="step-header">
              <h2>Review Your Application</h2>
              <p>Please review all information before submitting your application.</p>
            </div>
            <div className="review-section">
              <h3>Personal Details</h3>
              <div className="review-grid">
                <div><strong>First Name:</strong> {formData.personalDetails.firstName}</div>
                <div><strong>Other Name:</strong> {formData.personalDetails.otherName || "N/A"}</div>
                <div><strong>Surname:</strong> {formData.personalDetails.surname}</div>
                <div><strong>NRC Number:</strong> {formData.personalDetails.nrcNumber}</div>
                <div><strong>Date of Birth:</strong> {formData.personalDetails.dateOfBirth}</div>
                <div><strong>Gender:</strong> {formData.personalDetails.gender}</div>
                <div><strong>Phone Number:</strong> +260 {formData.personalDetails.phoneNumber}</div>
                <div><strong>District of Residence:</strong> {formData.personalDetails.districtOfResidence}</div>
                <div><strong>Province:</strong> {formData.personalDetails.province}</div>
              </div>
              
              <h3>Education Background</h3>
              <div className="review-grid">
                <div><strong>Last School Attended:</strong> {formData.educationBackground.lastSchoolAttended}</div>
                <div><strong>Examination Number:</strong> {formData.educationBackground.examinationNumber}</div>
                <div><strong>Year of Completion:</strong> {formData.educationBackground.yearOfCompletion}</div>
                <div><strong>School District:</strong> {formData.educationBackground.schoolDistrict}</div>
              </div>
              
              <h3>Guardian Information</h3>
              <div className="review-grid">
                <div><strong>First Name:</strong> {formData.guardian.firstName}</div>
                <div><strong>Surname:</strong> {formData.guardian.surname}</div>
                <div><strong>NRC Number:</strong> {formData.guardian.nrcNumber}</div>
                <div><strong>Gender:</strong> {formData.guardian.gender}</div>
                <div><strong>Occupation:</strong> {formData.guardian.occupation}</div>
                <div><strong>Phone Number:</strong> +260 {formData.guardian.phoneNumber}</div>
                <div><strong>Nationality:</strong> {formData.guardian.nationality}</div>
                <div><strong>District of Residence:</strong> {formData.guardian.districtOfResidence}</div>
                <div><strong>Relationship to Applicant:</strong> {formData.guardian.relationshipToApplicant}</div>
              </div>
              
              <h3>University Details</h3>
              <div className="review-grid">
                <div><strong>Student Number:</strong> {formData.university.studentNumber}</div>
                <div><strong>Select University:</strong> {formData.university.selectUniversity}</div>
                <div><strong>Enter School:</strong> {formData.university.enterSchool}</div>
                <div><strong>Program:</strong> {formData.university.enterProgram}</div>
                <div><strong>Rate of Application:</strong> {formData.university.rateOfApplication ? `${formData.university.rateOfApplication}%` : "Not selected"}</div>
                <div><strong>Acceptance Letter:</strong> {formData.university.acceptanceLetter ? formData.university.acceptanceLetter.name : "Not uploaded"}</div>
              </div>
              
              <h3>Uploaded Documents</h3>
              <div className="review-grid">
                <div><strong>Certified NRC Copy:</strong> {formData.documents.certifiedNrc ? formData.documents.certifiedNrc.name : "Not uploaded"}</div>
                <div><strong>Certified Guardian NRC Copy:</strong> {formData.documents.certifiedGuardianNrc ? formData.documents.certifiedGuardianNrc.name : "Not uploaded"}</div>
                <div><strong>Certified Grade 12 Results:</strong> {formData.documents.certifiedGrade12Results ? formData.documents.certifiedGrade12Results.name : "Not uploaded"}</div>
                <div><strong>Other Supporting Documents:</strong> {formData.documents.otherSupportingDocuments ? formData.documents.otherSupportingDocuments.name : "Not uploaded"}</div>
                <div><strong>Receipt of Payment:</strong> {formData.documents.receiptOfPayment ? formData.documents.receiptOfPayment.name : "Not uploaded"}</div>
              </div>
            </div>

            {/* Confirmation Checkboxes */}
            <div className="confirmation-section">
              <h3>Confirmation</h3>
              <div className="confirmation-checkboxes">
                <div className="confirmation-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.confirmations.validDetails}
                      onChange={(e) => handleInputChange("confirmations", "validDetails", e.target.checked)}
                      className="confirmation-checkbox"
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-text">
                      I confirm that all the information provided above is accurate and valid to the best of my knowledge.
                    </span>
                  </label>
                </div>
                
                <div className="confirmation-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.confirmations.termsAccepted}
                      onChange={(e) => handleInputChange("confirmations", "termsAccepted", e.target.checked)}
                      className="confirmation-checkbox"
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-text">
                      I understand and agree to the terms and conditions of the HELSB student loan program.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Navigation Buttons */}
        <div className={`form-navigation ${currentStep === 1 ? 'step-1-layout' : ''}`}>
          {/* Previous Button */}
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              Previous
            </button>
          )}
          
          {/* Next/Submit Button */}
          {currentStep < 6 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit} 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-modal-content">
              <div className="success-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#28a745"/>
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="success-title">Application Submitted Successfully!</h2>
              <p className="success-message">
                Your student loan application has been successfully submitted.
              </p>
              <div className="application-number">
                <strong>Application Number: {applicationNumber}</strong>
              </div>
              <div className="success-modal-buttons">
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("/student-application");
                  }}
                >
                  Return to Application Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentApplicationForm;
