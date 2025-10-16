import React, { useState, useRef } from "react";
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
  const [validationErrors, setValidationErrors] = useState({});
  const [tempErrors, setTempErrors] = useState({});
  
  // Refs for phone number inputs
  const phoneNumberRef = useRef(null);
  const guardianPhoneNumberRef = useRef(null);

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
      phoneNumber: "+260",
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
      phoneNumber: "+260",
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

  // Validation functions
  const validateName = (name) => {
    // Only allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return nameRegex.test(name);
  };

  const validateNRC = (nrc) => {
    // NRC format: 123456/78/9 (6 digits/2 digits/1 digit)
    const nrcRegex = /^\d{6}\/\d{2}\/\d{1}$/;
    return nrcRegex.test(nrc);
  };

  const validatePhoneNumber = (phone) => {
    // Phone number format: +260 followed by 9 digits
    const phoneRegex = /^\+260[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const validateStudentNumber = (studentNumber) => {
    // Student number should be alphanumeric
    const studentRegex = /^[a-zA-Z0-9]+$/;
    return studentRegex.test(studentNumber);
  };

  const validateExaminationNumber = (examNumber) => {
    // Examination number should be exactly 10 digits
    const examRegex = /^\d{10}$/;
    return examRegex.test(examNumber);
  };

  const validateYear = (year) => {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 10; // Not more than 10 years old
    return year >= minYear && year <= currentYear;
  };

  const validateDateOfBirth = (dateString) => {
    if (!dateString) return true; // Allow empty dates for optional fields
    
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;
    
    // Check if date is in the future
    if (birthDate > today) {
      return { isValid: false, message: "Date of birth cannot be in the future" };
    }
    
    // Check age range (14-40 years)
    if (actualAge < 14) {
      return { isValid: false, message: "You must be at least 14 years old to apply" };
    }
    
    if (actualAge > 40) {
      return { isValid: false, message: "You must be 40 years old or younger to apply" };
    }
    
    return { isValid: true, message: "" };
  };

  // Special handler for phone number inputs
  const handlePhoneInputChange = (section, field, value, inputRef) => {
    // If the value already starts with +260, extract only the digits after it
    let digitsOnly = '';
    
    if (value.startsWith('+260')) {
      // Extract digits after +260
      digitsOnly = value.substring(4).replace(/[^0-9]/g, '');
    } else {
      // Extract all digits from the input
      digitsOnly = value.replace(/[^0-9]/g, '');
    }
    
    // Limit to 9 digits
    if (digitsOnly.length > 9) {
      digitsOnly = digitsOnly.substring(0, 9);
    }
    
    // Always show +260 prefix with user's digits
    const formattedValue = '+260' + digitsOnly;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: formattedValue
      }
    }));
    
    // Set cursor position after +260
    setTimeout(() => {
      if (inputRef.current) {
        const cursorPosition = 4 + digitsOnly.length; // +260 + digits
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  const handleInputChange = (section, field, value) => {
    // Clear validation error for this field
    const errorKey = `${section}.${field}`;
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[errorKey];
      return newErrors;
    });

    // Filter input based on field type to prevent invalid characters
    let filteredValue = value;
    
    if (field === "firstName" || field === "surname" || field === "otherName" || 
        (section === "guardian" && (field === "firstName" || field === "surname")) ||
        (section === "educationBackground" && field === "lastSchoolAttended")) {
      // Only allow letters, spaces, hyphens, and apostrophes
      filteredValue = value.replace(/[^a-zA-Z\s\-']/g, '');
      
      // Show temporary error if user tried to type invalid characters
      if (value !== filteredValue) {
        setTempErrors(prev => ({
          ...prev,
          [errorKey]: "Name can only contain letters, spaces, hyphens, and apostrophes"
        }));
        
        // Clear temporary error after 3 seconds
        setTimeout(() => {
          setTempErrors(prev => {
            const newTempErrors = { ...prev };
            delete newTempErrors[errorKey];
            return newTempErrors;
          });
        }, 3000);
      }
    } else if (field === "nrcNumber" || (section === "guardian" && field === "nrcNumber")) {
      // Format NRC number with automatic slashes: xxxxxx/xx/x
      let formattedValue = value.replace(/[^0-9]/g, ''); // Remove all non-digits
      
      // Add slashes at appropriate positions
      if (formattedValue.length > 6) {
        formattedValue = formattedValue.substring(0, 6) + '/' + formattedValue.substring(6);
      }
      if (formattedValue.length > 9) {
        formattedValue = formattedValue.substring(0, 9) + '/' + formattedValue.substring(9, 10);
      }
      
      filteredValue = formattedValue;
      
      // Show temporary error if user tried to type invalid characters
      if (value !== value.replace(/[^0-9\/]/g, '')) {
        setTempErrors(prev => ({
          ...prev,
          [errorKey]: "NRC can only contain numbers (slashes are added automatically)"
        }));
        
        setTimeout(() => {
          setTempErrors(prev => {
            const newTempErrors = { ...prev };
            delete newTempErrors[errorKey];
            return newTempErrors;
          });
        }, 3000);
      }
    // Phone number handling is done by handlePhoneInputChange function
    } else if (field === "studentNumber") {
      // Allow only alphanumeric characters
      filteredValue = value.replace(/[^a-zA-Z0-9]/g, '');
      
      if (value !== filteredValue) {
        setTempErrors(prev => ({
          ...prev,
          [errorKey]: "Student number can only contain letters and numbers"
        }));
        
        setTimeout(() => {
          setTempErrors(prev => {
            const newTempErrors = { ...prev };
            delete newTempErrors[errorKey];
            return newTempErrors;
          });
        }, 3000);
      }
    } else if (field === "examinationNumber") {
      // Allow only digits for examination number
      filteredValue = value.replace(/[^0-9]/g, '');
      
      // Limit to 10 digits
      if (filteredValue.length > 10) {
        filteredValue = filteredValue.substring(0, 10);
      }
      
      // Show temporary error if user tried to type invalid characters
      if (value !== value.replace(/[^0-9]/g, '')) {
        setTempErrors(prev => ({
          ...prev,
          [errorKey]: "Examination number can only contain 10 digits"
        }));
        
        setTimeout(() => {
          setTempErrors(prev => {
            const newTempErrors = { ...prev };
            delete newTempErrors[errorKey];
            return newTempErrors;
          });
        }, 3000);
      }
    }

    // Additional validation for format checking
    let isValid = true;
    let errorMessage = "";

    if (field === "nrcNumber" && filteredValue) {
      if (filteredValue.length === 10 && !validateNRC(filteredValue)) {
        isValid = false;
        errorMessage = "NRC format should be: 123456/78/9";
      }
    } else if (field === "phoneNumber" && filteredValue) {
      if (filteredValue === "+260" || !validatePhoneNumber(filteredValue)) {
        isValid = false;
        errorMessage = "Please enter 9 digits after +260";
      }
    } else if (field === "examinationNumber" && filteredValue) {
      if (!validateExaminationNumber(filteredValue)) {
        isValid = false;
        errorMessage = "Examination number must be exactly 10 digits";
      }
    } else if (field === "yearOfCompletion" && filteredValue) {
      if (!validateYear(parseInt(filteredValue))) {
        isValid = false;
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 10;
        errorMessage = `Year must be between ${minYear} and ${currentYear} (not more than 10 years old)`;
      }
    } else if (field === "dateOfBirth" && filteredValue) {
      const dateValidation = validateDateOfBirth(filteredValue);
      if (!dateValidation.isValid) {
        isValid = false;
        errorMessage = dateValidation.message;
      }
    }

    // Set validation error if invalid format
    if (!isValid) {
      setValidationErrors(prev => ({
        ...prev,
        [errorKey]: errorMessage
      }));
    }

    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: filteredValue
      }
    }));
  };

  // Helper function to get validation error
  const getValidationError = (section, field) => {
    const errorKey = `${section}.${field}`;
    return validationErrors[errorKey] || tempErrors[errorKey] || "";
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
      {/* Navigation Bar */}
      <nav className="application-navbar">
        <div className="navbar-container">
          <div className="navbar-left">
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
               <button className="nav-link" onClick={() => navigate("/contact")}>
                 Contact
               </button>
             </div>
           </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="main-content-container">
        {/* Left Side - Image/Visual */}
        <div className="left-visual-section">
          <div className="visual-content">
            <div className="visual-main">
              <div className="logo-section">
                <img src={helsbLogo} alt="HELSB Logo" className="main-logo" />
                <h1 className="main-title">Student Loan Application</h1>
                <p className="main-subtitle">Higher Education Loans and Scholarships Board</p>
              </div>
              
              <div className="visual-features">
                <div className="feature-item">
                  <div className="feature-icon">🎓</div>
                  <div className="feature-text">
                    <h3>Educational Support</h3>
                    <p>Comprehensive financial assistance for higher education</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📋</div>
                  <div className="feature-text">
                    <h3>Easy Application</h3>
                    <p>Simple step-by-step application process</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔒</div>
                  <div className="feature-text">
                    <h3>Secure & Safe</h3>
                    <p>Your information is protected and confidential</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form (70% width) */}
        <div className="right-form-section">
          <div className="form-container">
            {/* Progress Indicator */}
            <div className="progress-indicator">
              <div className="progress-title">
                <h2>Application Form</h2>
                <div className="progress-line"></div>
              </div>
              <div className="progress-steps">
                {[
                  { number: 1, title: "Personal Details" },
                  { number: 2, title: "Education Background" },
                  { number: 3, title: "Guardian Information" },
                  { number: 4, title: "University Details" },
                  { number: 5, title: "Document Upload" },
                  { number: 6, title: "Review & Submit" }
                ].map((step, index) => (
                  <div
                    key={step.number}
                    className={`progress-step ${currentStep >= step.number ? "active" : ""} ${currentStep === step.number ? "current" : ""}`}
                  >
                    <div className="step-indicator">
                      <div className="step-number">{step.number}</div>
                      {currentStep > step.number && <div className="checkmark">✓</div>}
                    </div>
                    <div className="step-title">{step.title}</div>
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
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        value={formData.personalDetails.firstName}
                        onChange={(e) => handleInputChange("personalDetails", "firstName", e.target.value)}
                        placeholder="Enter your first name"
                        className={`form-input ${getValidationError("personalDetails", "firstName") ? "error" : ""}`}
                        required
                      />
                      {getValidationError("personalDetails", "firstName") && (
                        <div className={`validation-error ${tempErrors["personalDetails.firstName"] ? "temp-error" : ""}`}>
                          {getValidationError("personalDetails", "firstName")}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="otherName">Other Name</label>
                      <input
                        type="text"
                        id="otherName"
                        value={formData.personalDetails.otherName}
                        onChange={(e) => handleInputChange("personalDetails", "otherName", e.target.value)}
                        placeholder="Enter your other name (optional)"
                        className={`form-input ${getValidationError("personalDetails", "otherName") ? "error" : ""}`}
                      />
                      {getValidationError("personalDetails", "otherName") && (
                        <div className={`validation-error ${tempErrors["personalDetails.otherName"] ? "temp-error" : ""}`}>
                          {getValidationError("personalDetails", "otherName")}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="surname">Surname</label>
                      <input
                        type="text"
                        id="surname"
                        value={formData.personalDetails.surname}
                        onChange={(e) => handleInputChange("personalDetails", "surname", e.target.value)}
                        placeholder="Enter your surname"
                        className={`form-input ${getValidationError("personalDetails", "surname") ? "error" : ""}`}
                        required
                      />
                      {getValidationError("personalDetails", "surname") && (
                        <div className={`validation-error ${tempErrors["personalDetails.surname"] ? "temp-error" : ""}`}>
                          {getValidationError("personalDetails", "surname")}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="nrcNumber">NRC Number</label>
                      <input
                        type="text"
                        id="nrcNumber"
                        value={formData.personalDetails.nrcNumber}
                        onChange={(e) => handleInputChange("personalDetails", "nrcNumber", e.target.value)}
                        placeholder="1234567890 (slashes added automatically)"
                        className={`form-input ${getValidationError("personalDetails", "nrcNumber") ? "error" : ""}`}
                        required
                      />
                      {getValidationError("personalDetails", "nrcNumber") && (
                        <div className={`validation-error ${tempErrors["personalDetails.nrcNumber"] ? "temp-error" : ""}`}>
                          {getValidationError("personalDetails", "nrcNumber")}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="dateOfBirth">Date of Birth</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        value={formData.personalDetails.dateOfBirth}
                        onChange={(e) => handleInputChange("personalDetails", "dateOfBirth", e.target.value)}
                        className={`form-input ${getValidationError("personalDetails", "dateOfBirth") ? "error" : ""}`}
                        max={new Date().toISOString().split('T')[0]}
                        min={new Date(new Date().getFullYear() - 40, 0, 1).toISOString().split('T')[0]}
                        required
                      />
                      {getValidationError("personalDetails", "dateOfBirth") && (
                        <div className={`validation-error ${tempErrors["personalDetails.dateOfBirth"] ? "temp-error" : ""}`}>
                          {getValidationError("personalDetails", "dateOfBirth")}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        value={formData.personalDetails.gender}
                        onChange={(e) => handleInputChange("personalDetails", "gender", e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        ref={phoneNumberRef}
                        value={formData.personalDetails.phoneNumber}
                        onChange={(e) => handlePhoneInputChange("personalDetails", "phoneNumber", e.target.value, phoneNumberRef)}
                        onKeyDown={(e) => {
                          // Prevent backspace from deleting +260
                          if (e.key === 'Backspace' && phoneNumberRef.current.selectionStart <= 4) {
                            e.preventDefault();
                          }
                        }}
                        placeholder="Enter 9 digits after +260"
                        className={`form-input ${getValidationError("personalDetails", "phoneNumber") ? "error" : ""}`}
                        required
                      />
                      {getValidationError("personalDetails", "phoneNumber") && (
                        <div className={`validation-error ${tempErrors["personalDetails.phoneNumber"] ? "temp-error" : ""}`}>
                          {getValidationError("personalDetails", "phoneNumber")}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="districtOfResidence">District of Residence</label>
                      <input
                        type="text"
                        id="districtOfResidence"
                        value={formData.personalDetails.districtOfResidence}
                        onChange={(e) => handleInputChange("personalDetails", "districtOfResidence", e.target.value)}
                        placeholder="Enter your district"
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="province">Province</label>
                      <select
                        id="province"
                        value={formData.personalDetails.province}
                        onChange={(e) => handleInputChange("personalDetails", "province", e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Select Province</option>
                        {provinces.map(province => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Education Background */}
              {currentStep === 2 && (
                <div className="form-step">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="lastSchoolAttended">Last School Attended</label>
                      <input
                        type="text"
                        id="lastSchoolAttended"
                        value={formData.educationBackground.lastSchoolAttended}
                        onChange={(e) => handleInputChange("educationBackground", "lastSchoolAttended", e.target.value)}
                        placeholder="Enter the name of your last school"
                        className={`form-input ${getValidationError("educationBackground", "lastSchoolAttended") ? "error" : ""}`}
                        required
                      />
                      {getValidationError("educationBackground", "lastSchoolAttended") && (
                        <div className={`validation-error ${tempErrors["educationBackground.lastSchoolAttended"] ? "temp-error" : ""}`}>
                          {getValidationError("educationBackground", "lastSchoolAttended")}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="examinationNumber">Examination Number</label>
                      <input
                        type="text"
                        id="examinationNumber"
                        value={formData.educationBackground.examinationNumber}
                        onChange={(e) => handleInputChange("educationBackground", "examinationNumber", e.target.value)}
                        placeholder="Enter 10-digit examination number"
                        className={`form-input ${getValidationError("educationBackground", "examinationNumber") ? "error" : ""}`}
                        required
                      />
                      {getValidationError("educationBackground", "examinationNumber") && (
                        <div className={`validation-error ${tempErrors["educationBackground.examinationNumber"] ? "temp-error" : ""}`}>
                          {getValidationError("educationBackground", "examinationNumber")}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="yearOfCompletion">Year of Completion</label>
                      <input
                        type="number"
                        id="yearOfCompletion"
                        value={formData.educationBackground.yearOfCompletion}
                        onChange={(e) => handleInputChange("educationBackground", "yearOfCompletion", e.target.value)}
                        placeholder="e.g., 2023"
                        min={new Date().getFullYear() - 10}
                        max={new Date().getFullYear()}
                        className={`form-input ${getValidationError("educationBackground", "yearOfCompletion") ? "error" : ""}`}
                        required
                      />
                      {getValidationError("educationBackground", "yearOfCompletion") && (
                        <div className={`validation-error ${tempErrors["educationBackground.yearOfCompletion"] ? "temp-error" : ""}`}>
                          {getValidationError("educationBackground", "yearOfCompletion")}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="schoolDistrict">School District</label>
                      <input
                        type="text"
                        id="schoolDistrict"
                        value={formData.educationBackground.schoolDistrict}
                        onChange={(e) => handleInputChange("educationBackground", "schoolDistrict", e.target.value)}
                        placeholder="Enter the district of your school"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Guardian Information */}
              {currentStep === 3 && (
                <div className="form-step">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="guardianFirstName">Guardian First Name</label>
                      <input
                        type="text"
                        id="guardianFirstName"
                        value={formData.guardian.firstName}
                        onChange={(e) => handleInputChange("guardian", "firstName", e.target.value)}
                        placeholder="Enter guardian's first name"
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="guardianSurname">Guardian Surname</label>
                      <input
                        type="text"
                        id="guardianSurname"
                        value={formData.guardian.surname}
                        onChange={(e) => handleInputChange("guardian", "surname", e.target.value)}
                        placeholder="Enter guardian's surname"
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="guardianNrcNumber">Guardian NRC Number</label>
                      <input
                        type="text"
                        id="guardianNrcNumber"
                        value={formData.guardian.nrcNumber}
                        onChange={(e) => handleInputChange("guardian", "nrcNumber", e.target.value)}
                        placeholder="1234567890 (slashes added automatically)"
                        className={`form-input ${getValidationError("guardian", "nrcNumber") ? "error" : ""}`}
                        required
                      />
                      {getValidationError("guardian", "nrcNumber") && (
                        <div className={`validation-error ${tempErrors["guardian.nrcNumber"] ? "temp-error" : ""}`}>
                          {getValidationError("guardian", "nrcNumber")}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="guardianGender">Guardian Gender</label>
                      <select
                        id="guardianGender"
                        value={formData.guardian.gender}
                        onChange={(e) => handleInputChange("guardian", "gender", e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="guardianOccupation">Guardian Occupation</label>
                      <input
                        type="text"
                        id="guardianOccupation"
                        value={formData.guardian.occupation}
                        onChange={(e) => handleInputChange("guardian", "occupation", e.target.value)}
                        placeholder="Enter guardian's occupation"
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="guardianPhoneNumber">Guardian Phone Number</label>
                      <input
                        type="tel"
                        id="guardianPhoneNumber"
                        ref={guardianPhoneNumberRef}
                        value={formData.guardian.phoneNumber}
                        onChange={(e) => handlePhoneInputChange("guardian", "phoneNumber", e.target.value, guardianPhoneNumberRef)}
                        onKeyDown={(e) => {
                          // Prevent backspace from deleting +260
                          if (e.key === 'Backspace' && guardianPhoneNumberRef.current.selectionStart <= 4) {
                            e.preventDefault();
                          }
                        }}
                        placeholder="Enter 9 digits after +260"
                        className={`form-input ${getValidationError("guardian", "phoneNumber") ? "error" : ""}`}
                        required
                      />
                      {getValidationError("guardian", "phoneNumber") && (
                        <div className={`validation-error ${tempErrors["guardian.phoneNumber"] ? "temp-error" : ""}`}>
                          {getValidationError("guardian", "phoneNumber")}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="guardianNationality">Guardian Nationality</label>
                      <input
                        type="text"
                        id="guardianNationality"
                        value={formData.guardian.nationality}
                        onChange={(e) => handleInputChange("guardian", "nationality", e.target.value)}
                        placeholder="Enter guardian's nationality"
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="guardianDistrict">Guardian District</label>
                      <input
                        type="text"
                        id="guardianDistrict"
                        value={formData.guardian.districtOfResidence}
                        onChange={(e) => handleInputChange("guardian", "districtOfResidence", e.target.value)}
                        placeholder="Enter guardian's district"
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="guardianRelationship">Relationship to Applicant</label>
                      <select
                        id="guardianRelationship"
                        value={formData.guardian.relationshipToApplicant}
                        onChange={(e) => handleInputChange("guardian", "relationshipToApplicant", e.target.value)}
                        className="form-input"
                        required
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
              )}

              {/* Step 4: University Details */}
              {currentStep === 4 && (
                <div className="form-step">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="studentNumber">Student Number</label>
                      <input
                        type="text"
                        id="studentNumber"
                        value={formData.university.studentNumber}
                        onChange={(e) => handleInputChange("university", "studentNumber", e.target.value)}
                        placeholder="Enter your student number"
                        className="form-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="selectUniversity">Select University</label>
                      <select
                        id="selectUniversity"
                        value={formData.university.selectUniversity}
                        onChange={(e) => handleInputChange("university", "selectUniversity", e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Select University</option>
                        {institutions.map(institution => (
                          <option key={institution} value={institution}>{institution}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="enterSchool">Enter School</label>
                      <select
                        id="enterSchool"
                        value={formData.university.enterSchool}
                        onChange={(e) => handleInputChange("university", "enterSchool", e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Select School</option>
                        {institutions.map(institution => (
                          <option key={institution} value={institution}>{institution}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="enterProgram">Enter Program</label>
                      <select
                        id="enterProgram"
                        value={formData.university.enterProgram}
                        onChange={(e) => handleInputChange("university", "enterProgram", e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Select Program</option>
                        {programs.map(program => (
                          <option key={program} value={program}>{program}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="rateOfApplication">Rate of Application</label>
                      <select
                        id="rateOfApplication"
                        value={formData.university.rateOfApplication}
                        onChange={(e) => handleInputChange("university", "rateOfApplication", e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Select Rate</option>
                        <option value="25">25%</option>
                        <option value="50">50%</option>
                        <option value="75">75%</option>
                        <option value="100">100%</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="acceptanceLetter">Acceptance Letter</label>
                      <input
                        type="file"
                        id="acceptanceLetter"
                        accept=".pdf"
                        onChange={(e) => handleFileChange("acceptanceLetter", e.target.files[0])}
                        className="form-input file-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Document Upload */}
              {currentStep === 5 && (
                <div className="form-step">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="certifiedNrc">Certified NRC Copy</label>
                      <input
                        type="file"
                        id="certifiedNrc"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange("certifiedNrc", e.target.files[0])}
                        className="form-input file-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="certifiedGuardianNrc">Certified Guardian NRC Copy</label>
                      <input
                        type="file"
                        id="certifiedGuardianNrc"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange("certifiedGuardianNrc", e.target.files[0])}
                        className="form-input file-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="certifiedGrade12Results">Certified Grade 12 Results</label>
                      <input
                        type="file"
                        id="certifiedGrade12Results"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange("certifiedGrade12Results", e.target.files[0])}
                        className="form-input file-input"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="otherSupportingDocuments">Other Supporting Documents</label>
                      <input
                        type="file"
                        id="otherSupportingDocuments"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange("otherSupportingDocuments", e.target.files[0])}
                        className="form-input file-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="receiptOfPayment">Receipt of Payment</label>
                      <input
                        type="file"
                        id="receiptOfPayment"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange("receiptOfPayment", e.target.files[0])}
                        className="form-input file-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Review and Submit */}
              {currentStep === 6 && (
                <div className="form-step">
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

                  <div className="confirmation-section">
                    <div className="confirmation-checkboxes">
                      <div className="confirmation-item">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.confirmations.validDetails}
                            onChange={(e) => handleInputChange("confirmations", "validDetails", e.target.checked)}
                            className="confirmation-checkbox"
                          />
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
            <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="btn-secondary">
                  Previous
                </button>
              )}
              
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
