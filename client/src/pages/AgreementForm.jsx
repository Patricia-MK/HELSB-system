import React, { useState, useEffect } from "react";
import "./AgreementForm.css";
import capBackground from "../assets/images/cap.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AgreementForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    receiptNumber: "",
    bankName: "",
    accountName: "",
    branchName: "",
    studentLoanNo: "",
    nrcNo: "",
    bankAccountNo: "",
    zraTpin: "",
    napsaNo: "",
    program: "",
    year: "",
    institution: "",
    studentNumber: "",
    qualification: "",
    school: "",
    loanRate: "100%",
    studentName: "",
    ceoName: "Dr John Machayi",
    date: new Date().toISOString().split('T')[0],
    agree: false,
  });

  const [loading, setLoading] = useState(false);

  // Pre-fill student details from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored user data:", storedUser);
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log("Parsed user object:", user);
        
        setFormData((prev) => ({
          ...prev,
          studentName: user.name || user.fullName || user.studentName || "",
          studentNumber: user.studentNumber || user.studentID || user.studentId || "",
          studentLoanNo: user.studentLoanNo || user.loanNumber || "",
          nrcNo: user.nrcNo || user.nrc || "",
          program: user.program || user.programme || "",
          school: user.school || user.faculty || "",
          qualification: user.qualification || user.degree || "",
          institution: user.institution || user.university || user.college || "",
          year: user.year || user.currentYear || "1",
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agree) {
      alert("Please agree to the terms before submitting.");
      return;
    }

    // Validate required fields
    const requiredFields = [
      'studentNumber', 'studentName', 'institution', 'program', 
      'year', 'bankName', 'accountName', 'bankAccountNo', 'date'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      console.log("Submitting agreement data:", formData);

      const res = await axios.post("http://localhost:5000/api/agreements", formData);

alert(res.data.message || "Agreement submitted successfully!");
console.log("Server response:", res.data);

// CRITICAL FIX: Make sure we're getting the agreement ID correctly
if (!res.data.agreement || !res.data.agreement._id) {
  console.error("No agreement ID in response:", res.data);
  alert("Error: Could not get agreement ID from server response");
  return;
}

const studentInfo = {
  studentId: res.data.agreement._id, // This MUST be the agreement ID
  studentNumber: formData.studentNumber,
  fullName: formData.studentName,
  year: formData.year,
  loanType: (formData.year === "1" || formData.year === 1) ? "first-timer" : "returning"
  };

     localStorage.setItem("student", JSON.stringify(studentInfo));
     console.log("Saved student info for uploads - Agreement ID:", studentInfo.studentId);

    
      if (formData.year === "1" || formData.year === 1) {
        navigate("/upload-first-timer");
      } else {
        navigate("/upload-returning");
      }

    } catch (err) {
      console.error("Agreement submission error:", err);
      
      if (err.response) {
        console.error("Server response error:", err.response.data);
        if (err.response.status === 400) {
          alert(`Error: ${err.response.data.message || "Invalid data. Please check all fields."}`);
        } else if (err.response.status === 409) {
          alert(`Error: ${err.response.data.message || "An agreement already exists for this student."}`);
        } else {
          alert(`Error: ${err.response.data.message || "Server error. Please try again."}`);
        }
      } else if (err.request) {
        console.error("Network error - no response:", err.request);
        alert("Network error. Please check your internet connection and ensure the server is running.");
      } else {
        console.error("Unexpected error:", err.message);
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agreement-page" style={{ backgroundImage: `url(${capBackground})` }}>
      <div className="agreement-container">
        <h2>Student Loan Agreement Form (Undergraduate)</h2>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="section grid-3">
            <input 
              type="text" 
              name="receiptNumber" 
              placeholder="Receipt Number" 
              value={formData.receiptNumber} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="text" 
              name="bankName" 
              placeholder="Bank Name *" 
              value={formData.bankName} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="text" 
              name="accountName" 
              placeholder="Account Name *" 
              value={formData.accountName} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="text" 
              name="program" 
              placeholder="Programme of Study *" 
              value={formData.program} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="text" 
              name="year" 
              placeholder="Current Year of Study *" 
              value={formData.year} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="text" 
              name="studentNumber" 
              placeholder="University Student Identity No *" 
              value={formData.studentNumber} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="text" 
              name="branchName" 
              placeholder="Branch Name" 
              value={formData.branchName} 
              onChange={handleChange} 
            />
            <input 
              type="text" 
              name="studentLoanNo" 
              placeholder="Student Loan No" 
              value={formData.studentLoanNo} 
              onChange={handleChange} 
            />
            <input 
              type="text" 
              name="nrcNo" 
              placeholder="NRC No" 
              value={formData.nrcNo} 
              onChange={handleChange} 
            />
            <input 
              type="text" 
              name="bankAccountNo" 
              placeholder="Bank Account No *" 
              value={formData.bankAccountNo} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="text" 
              name="zraTpin" 
              placeholder="ZRA TPIN" 
              value={formData.zraTpin} 
              onChange={handleChange} 
            />
            <input 
              type="text" 
              name="napsaNo" 
              placeholder="NAPSA Social Security No" 
              value={formData.napsaNo} 
              onChange={handleChange} 
            />
          </div>

          <h3>STUDENT AGREEMENT</h3>
          <div className="agreement-text" style={{ maxHeight: "300px", overflowY: "scroll" }}>
            <p>
              An Agreement made and entered into by and between{" "}
              <input 
                type="text" 
                name="ceoName" 
                placeholder="CEO Name" 
                value={formData.ceoName} 
                readOnly 
              />{" "}
              in his/her capacity as Chief Executive Officer, HELSB, and{" "}
              <input 
                type="text" 
                name="studentName" 
                placeholder="Student Name *" 
                value={formData.studentName} 
                onChange={handleChange} 
                required 
              />{" "}
              for the purpose of providing a student loan at the rate of{" "}
              <input 
                type="text" 
                name="loanRate" 
                placeholder="Loan Rate" 
                value={formData.loanRate} 
                readOnly 
              />.
            </p>
            <p>
              The student wishes to pursue a course of study at{" "}
              <input 
                type="text" 
                name="institution" 
                placeholder="Institution Name *" 
                value={formData.institution} 
                onChange={handleChange} 
                required 
              />{" "}
              for the qualification of{" "}
              <input 
                type="text" 
                name="qualification" 
                placeholder="Qualification" 
                value={formData.qualification} 
                onChange={handleChange} 
              />{" "}
              in the School of{" "}
              <input 
                type="text" 
                name="school" 
                placeholder="School" 
                value={formData.school} 
                onChange={handleChange} 
              />.
            </p>
            <p>
              NOW THEREFORE, the Sponsor commits to the student such a loan for
              tuition, registration, accommodation, books, and meal allowances
              as determined.
            </p>
            <ul>
              <li>Tuition fees paid directly to the Institution</li>
              <li>Registration fees paid directly to the Institution</li>
              <li>Accommodation fees or allowance to student</li>
              <li>Books/research allowance to student</li>
              <li>Meal allowance to student</li>
            </ul>
            <p>
              Terms may change based on availability and Sponsor's discretion.
            </p>
          </div>

          <div className="terms-section">
            <h4>Terms & Conditions</h4>
            <div className="terms-text">
              <p>
                I understand that this is a student loan and I agree to abide by
                the conditions stated above. Any false information may result
                in disqualification. The loan includes a 10% interest rate and
                may include insurance premiums as determined by HELSB.
              </p>
              <p>
                I further undertake to repay the loan in order to ensure
                continuity of the Student Loan Scheme for future students.
              </p>
            </div>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="agree" 
                checked={formData.agree} 
                onChange={handleChange} 
                required 
              />
              I have read and agree to the terms and conditions *
            </label>
          </div>

          <div className="date-section">
            <label>
              Date: *
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                required 
              />
            </label>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Agreement"}
          </button>

          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            * Required fields
          </p>
        </form>
      </div>
    </div>
  );
}

export default AgreementForm;