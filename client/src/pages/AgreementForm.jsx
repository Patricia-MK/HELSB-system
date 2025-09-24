import React, { useState, useEffect } from "react";
import "./AgreementForm.css";
import capBackground from "../assets/images/cap.jpg"; // Correct path
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
    loanRate: "100%", // default
    studentName: "",
    ceoName: "Dr John Machayi",
    date: "",
    agree: false,
  });

  // Pre-fill student details from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData((prev) => ({
        ...prev,
        studentName: user.fullName || "",
        studentNumber: user.studentID || "",
        studentLoanNo: user.loanNumber || "",
        nrcNo: user.nrcNo || "",
        program: user.program || "",
        school: user.school || "",
        qualification: user.qualification || "",
        institution: user.institution || "",
        year: user.year || "",
      }));
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

    try {
      const res = await axios.post("http://localhost:5000/api/agreements", formData);
      alert(res.data.message);

      // Save student to localStorage for uploads page
      localStorage.setItem("student", JSON.stringify({
        studentId: res.data.studentId, // backend should return saved student _id
        studentNumber: formData.studentNumber,
        fullName: formData.studentName,
        year: formData.year,
      }));

      // Redirect based on year
      if (formData.year === 1) {
        navigate("/upload-first-timer");
      } else {
        navigate("/upload-returning");
      }

      // Reset form except prefilled
      setFormData((prev) => ({
        ...prev,
        receiptNumber: "",
        bankName: "",
        accountName: "",
        branchName: "",
        nrcNo: "",
        bankAccountNo: "",
        zraTpin: "",
        napsaNo: "",
        loanRate: "10%",
        date: "",
        agree: false,
      }));

    } catch (err) {
      alert(err.response?.data?.message || "Server error. Please try again later.");
    }
  };

  return (
    <div className="agreement-page" style={{ backgroundImage: `url(${capBackground})` }}>
      <div className="agreement-container">
        <h2>Student Loan Agreement Form (Undergraduate)</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="section grid-3">
            <input type="text" name="receiptNumber" placeholder="Receipt Number" value={formData.receiptNumber} onChange={handleChange} required />
            <input type="text" name="bankName" placeholder="Bank Name" value={formData.bankName} onChange={handleChange} required />
            <input type="text" name="accountName" placeholder="Account Name" value={formData.accountName} onChange={handleChange} required />
            <input type="text" name="program" placeholder="Programme of Study" value={formData.program} onChange={handleChange} readOnly />
            <input type="text" name="year" placeholder="Current Year of Study" value={formData.year} onChange={handleChange} readOnly />
            <input type="text" name="studentNumber" placeholder="University Student Identity No" value={formData.studentNumber} readOnly />
            <input type="text" name="branchName" placeholder="Branch Name" value={formData.branchName} onChange={handleChange} />
            <input type="text" name="studentLoanNo" placeholder="Student Loan No" value={formData.studentLoanNo} readOnly />
            <input type="text" name="nrcNo" placeholder="NRC No" value={formData.nrcNo} readOnly />
            <input type="text" name="bankAccountNo" placeholder="Bank Account No" value={formData.bankAccountNo} onChange={handleChange} />
            <input type="text" name="zraTpin" placeholder="ZRA TPIN" value={formData.zraTpin} onChange={handleChange} />
            <input type="text" name="napsaNo" placeholder="NAPSA Social Security No" value={formData.napsaNo} onChange={handleChange} />
          </div>

          <h3>STUDENT AGREEMENT</h3>
          <div className="agreement-text" style={{ maxHeight: "300px", overflowY: "scroll" }}>
            <p>
              An Agreement made and entered into by and between{" "}
              <input type="text" name="ceoName" placeholder="CEO Name" value={formData.ceoName} readOnly />{" "}
              in his/her capacity as Chief Executive Officer, HELSB, and{" "}
              <input type="text" name="studentName" placeholder="Student Name" value={formData.studentName} readOnly />{" "}
              for the purpose of providing a student loan at the rate of{" "}
              <input type="text" name="loanRate" placeholder="Loan Rate" value={formData.loanRate} readOnly />.
            </p>
            <p>
              The student wishes to pursue a course of study at{" "}
              <input type="text" name="institution" placeholder="Institution Name" value={formData.institution} readOnly />{" "}
              for the qualification of{" "}
              <input type="text" name="qualification" placeholder="Qualification" value={formData.qualification} readOnly />{" "}
              in the School of{" "}
              <input type="text" name="school" placeholder="School" value={formData.school} readOnly />.
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
              Terms may change based on availability and Sponsor’s discretion.
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
              <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} required />
              I have read and agree to the terms and conditions
            </label>
          </div>

          <div className="date-section">
            <label>
              Date:
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </label>
          </div>

          <button type="submit" className="submit-btn">
            Submit Agreement
          </button>
        </form>
      </div>
    </div>
  );
}

export default AgreementForm;
