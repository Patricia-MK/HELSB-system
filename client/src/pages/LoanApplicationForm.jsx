import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoanApplicationForm.css";

const LoanApplicationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Information
    personalInfo: {
      fullName: "",
      nrcNumber: "",
      dateOfBirth: "",
      gender: "",
      phoneNumber: "",
      email: "",
      address: "",
      province: "",
      district: ""
    },
    
    // Academic Information
    academicInfo: {
      institution: "",
      program: "",
      yearOfStudy: "",
      studentNumber: "",
      expectedGraduationYear: "",
      previousLoanHistory: "None"
    },
    
    // Financial Information
    financialInfo: {
      requestedAmount: "",
      loanPurpose: "",
      familyIncome: "",
      numberOfDependents: 0,
      hasGuarantor: false,
      guarantorInfo: {
        name: "",
        relationship: "",
        occupation: "",
        phoneNumber: "",
        address: ""
      }
    }
  });

  // Load user data on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.fullName) {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: user.fullName,
          email: user.email,
          nrcNumber: user.nrcNo || "",
          studentNumber: user.studentID || ""
        },
        academicInfo: {
          ...prev.academicInfo,
          institution: user.institution || "",
          program: user.program || "",
          yearOfStudy: user.year || ""
        }
      }));
    }
  }, []);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleGuarantorInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      financialInfo: {
        ...prev.financialInfo,
        guarantorInfo: {
          ...prev.financialInfo.guarantorInfo,
          [field]: value
        }
      }
    }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(4, prev + 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const validateCurrentStep = () => {
    setError("");
    
    if (currentStep === 1) {
      const { personalInfo } = formData;
      const required = ["nrcNumber", "dateOfBirth", "gender", "phoneNumber", "address", "province", "district"];
      const missing = required.filter(field => !personalInfo[field]);
      
      if (missing.length > 0) {
        setError(`Please fill in all required fields: ${missing.join(", ")}`);
        return false;
      }
    }
    
    if (currentStep === 2) {
      const { academicInfo } = formData;
      const required = ["institution", "program", "yearOfStudy", "studentNumber", "expectedGraduationYear"];
      const missing = required.filter(field => !academicInfo[field]);
      
      if (missing.length > 0) {
        setError(`Please fill in all required fields: ${missing.join(", ")}`);
        return false;
      }
    }
    
    if (currentStep === 3) {
      const { financialInfo } = formData;
      const required = ["requestedAmount", "loanPurpose", "familyIncome"];
      const missing = required.filter(field => !financialInfo[field]);
      
      if (missing.length > 0) {
        setError(`Please fill in all required fields: ${missing.join(", ")}`);
        return false;
      }
      
      if (financialInfo.hasGuarantor) {
        const guarantorRequired = ["name", "relationship", "occupation", "phoneNumber", "address"];
        const guarantorMissing = guarantorRequired.filter(field => !financialInfo.guarantorInfo[field]);
        
        if (guarantorMissing.length > 0) {
          setError(`Please fill in all guarantor fields: ${guarantorMissing.join(", ")}`);
          return false;
        }
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/loan-applications",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      setSuccess("Loan application created successfully!");
      setTimeout(() => {
        navigate("/loan-dashboard");
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create loan application");
    } finally {
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
    "University of Zambia", "Copperbelt University", "Mulungushi University",
    "Chalimbana University", "Kwame Nkrumah University", "Mukuba University",
    "Kapasa Makasa University", "Palabana University", "Zambia University College of Technology"
  ];

  const programs = [
    "Computer Science", "Civil Engineering", "Mechanical Engineering",
    "Medicine", "Law", "Economics", "Education", "Nursing",
    "Agricultural Science", "Mathematics", "Business Administration"
  ];

  return (
    <div className="loan-application-container">
      <div className="loan-application-header">
        <h1>Student Loan Application</h1>
        <p>Complete all sections to apply for a student loan</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-steps">
          {[1, 2, 3, 4].map(step => (
            <div
              key={step}
              className={`progress-step ${currentStep >= step ? "active" : ""}`}
            >
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && "Personal Info"}
                {step === 2 && "Academic Info"}
                {step === 3 && "Financial Info"}
                {step === 4 && "Review & Submit"}
              </div>
            </div>
          ))}
        </div>
        <div className="progress-line">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Form Steps */}
      <div className="form-content">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="form-step">
            <h2>Personal Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.personalInfo.fullName}
                  onChange={(e) => handleInputChange("personalInfo", "fullName", e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>NRC Number *</label>
                <input
                  type="text"
                  value={formData.personalInfo.nrcNumber}
                  onChange={(e) => handleInputChange("personalInfo", "nrcNumber", e.target.value)}
                  placeholder="123456/78/9"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange("personalInfo", "dateOfBirth", e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Gender *</label>
                <select
                  value={formData.personalInfo.gender}
                  onChange={(e) => handleInputChange("personalInfo", "gender", e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={formData.personalInfo.phoneNumber}
                  onChange={(e) => handleInputChange("personalInfo", "phoneNumber", e.target.value)}
                  placeholder="0977123456"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group full-width">
                <label>Address *</label>
                <textarea
                  value={formData.personalInfo.address}
                  onChange={(e) => handleInputChange("personalInfo", "address", e.target.value)}
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Province *</label>
                <select
                  value={formData.personalInfo.province}
                  onChange={(e) => handleInputChange("personalInfo", "province", e.target.value)}
                  required
                >
                  <option value="">Select Province</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>District *</label>
                <input
                  type="text"
                  value={formData.personalInfo.district}
                  onChange={(e) => handleInputChange("personalInfo", "district", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic Information */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2>Academic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Institution *</label>
                <select
                  value={formData.academicInfo.institution}
                  onChange={(e) => handleInputChange("academicInfo", "institution", e.target.value)}
                  required
                >
                  <option value="">Select Institution</option>
                  {institutions.map(institution => (
                    <option key={institution} value={institution}>{institution}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Program of Study *</label>
                <select
                  value={formData.academicInfo.program}
                  onChange={(e) => handleInputChange("academicInfo", "program", e.target.value)}
                  required
                >
                  <option value="">Select Program</option>
                  {programs.map(program => (
                    <option key={program} value={program}>{program}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Year of Study *</label>
                <select
                  value={formData.academicInfo.yearOfStudy}
                  onChange={(e) => handleInputChange("academicInfo", "yearOfStudy", e.target.value)}
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                  <option value="5">Year 5</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Student Number *</label>
                <input
                  type="text"
                  value={formData.academicInfo.studentNumber}
                  onChange={(e) => handleInputChange("academicInfo", "studentNumber", e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Expected Graduation Year *</label>
                <input
                  type="number"
                  value={formData.academicInfo.expectedGraduationYear}
                  onChange={(e) => handleInputChange("academicInfo", "expectedGraduationYear", e.target.value)}
                  min="2024"
                  max="2030"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Previous Loan History</label>
                <select
                  value={formData.academicInfo.previousLoanHistory}
                  onChange={(e) => handleInputChange("academicInfo", "previousLoanHistory", e.target.value)}
                >
                  <option value="None">None</option>
                  <option value="Previous HELSB Loan">Previous HELSB Loan</option>
                  <option value="Other Loan">Other Loan</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Financial Information */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2>Financial Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Requested Loan Amount (ZMW) *</label>
                <input
                  type="number"
                  value={formData.financialInfo.requestedAmount}
                  onChange={(e) => handleInputChange("financialInfo", "requestedAmount", e.target.value)}
                  min="1000"
                  max="50000"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Loan Purpose *</label>
                <select
                  value={formData.financialInfo.loanPurpose}
                  onChange={(e) => handleInputChange("financialInfo", "loanPurpose", e.target.value)}
                  required
                >
                  <option value="">Select Purpose</option>
                  <option value="Tuition">Tuition Fees</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Books">Books & Materials</option>
                  <option value="Living Expenses">Living Expenses</option>
                  <option value="All">All of the Above</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Family Monthly Income (ZMW) *</label>
                <input
                  type="number"
                  value={formData.financialInfo.familyIncome}
                  onChange={(e) => handleInputChange("financialInfo", "familyIncome", e.target.value)}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Number of Dependents</label>
                <input
                  type="number"
                  value={formData.financialInfo.numberOfDependents}
                  onChange={(e) => handleInputChange("financialInfo", "numberOfDependents", e.target.value)}
                  min="0"
                  max="10"
                />
              </div>
              
              <div className="form-group full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.financialInfo.hasGuarantor}
                    onChange={(e) => handleInputChange("financialInfo", "hasGuarantor", e.target.checked)}
                  />
                  I have a guarantor
                </label>
              </div>
              
              {formData.financialInfo.hasGuarantor && (
                <>
                  <div className="form-group">
                    <label>Guarantor Name *</label>
                    <input
                      type="text"
                      value={formData.financialInfo.guarantorInfo.name}
                      onChange={(e) => handleGuarantorInfoChange("name", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Relationship *</label>
                    <select
                      value={formData.financialInfo.guarantorInfo.relationship}
                      onChange={(e) => handleGuarantorInfoChange("relationship", e.target.value)}
                      required
                    >
                      <option value="">Select Relationship</option>
                      <option value="Parent">Parent</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Relative">Relative</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Occupation *</label>
                    <input
                      type="text"
                      value={formData.financialInfo.guarantorInfo.occupation}
                      onChange={(e) => handleGuarantorInfoChange("occupation", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.financialInfo.guarantorInfo.phoneNumber}
                      onChange={(e) => handleGuarantorInfoChange("phoneNumber", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Address *</label>
                    <textarea
                      value={formData.financialInfo.guarantorInfo.address}
                      onChange={(e) => handleGuarantorInfoChange("address", e.target.value)}
                      rows="3"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review and Submit */}
        {currentStep === 4 && (
          <div className="form-step">
            <h2>Review Your Application</h2>
            <div className="review-section">
              <h3>Personal Information</h3>
              <div className="review-grid">
                <div><strong>Name:</strong> {formData.personalInfo.fullName}</div>
                <div><strong>NRC:</strong> {formData.personalInfo.nrcNumber}</div>
                <div><strong>Phone:</strong> {formData.personalInfo.phoneNumber}</div>
                <div><strong>Email:</strong> {formData.personalInfo.email}</div>
                <div><strong>Address:</strong> {formData.personalInfo.address}</div>
                <div><strong>Province:</strong> {formData.personalInfo.province}</div>
              </div>
              
              <h3>Academic Information</h3>
              <div className="review-grid">
                <div><strong>Institution:</strong> {formData.academicInfo.institution}</div>
                <div><strong>Program:</strong> {formData.academicInfo.program}</div>
                <div><strong>Year:</strong> {formData.academicInfo.yearOfStudy}</div>
                <div><strong>Student Number:</strong> {formData.academicInfo.studentNumber}</div>
                <div><strong>Graduation Year:</strong> {formData.academicInfo.expectedGraduationYear}</div>
              </div>
              
              <h3>Financial Information</h3>
              <div className="review-grid">
                <div><strong>Requested Amount:</strong> ZMW {formData.financialInfo.requestedAmount}</div>
                <div><strong>Purpose:</strong> {formData.financialInfo.loanPurpose}</div>
                <div><strong>Family Income:</strong> ZMW {formData.financialInfo.familyIncome}</div>
                <div><strong>Dependents:</strong> {formData.financialInfo.numberOfDependents}</div>
                {formData.financialInfo.hasGuarantor && (
                  <>
                    <div><strong>Guarantor:</strong> {formData.financialInfo.guarantorInfo.name}</div>
                    <div><strong>Relationship:</strong> {formData.financialInfo.guarantorInfo.relationship}</div>
                  </>
                )}
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
        
        {currentStep < 4 ? (
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
  );
};

export default LoanApplicationForm;
