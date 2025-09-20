import React, { useState, useEffect } from "react"; 
import "./StudentProfile.css";
import capImage from "../assets/images/cap.jpg";

const StudentProfile = ({ closeProfile }) => {
  const [studentData, setStudentData] = useState({});
  const [documents, setDocuments] = useState([]);
  const [loanStatus, setLoanStatus] = useState("Pending");
  const [loanBalance, setLoanBalance] = useState(0);

  // Mock load student data from localStorage
  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student") || "{}");
    const uploadedDocs = JSON.parse(localStorage.getItem("uploadedDocuments") || "[]");
    const balance = parseFloat(localStorage.getItem("loanBalance") || "1500");

    setStudentData(student);
    setDocuments(uploadedDocs);
    setLoanBalance(balance);
  }, []);

  const statusColor = {
    Pending: "#f0ad4e",
    Approved: "#28a745",
    Rejected: "#dc3545"
  }[loanStatus];

  return (
    <div className="profile-overlay">
      <div className="profile-container">
        <button className="close-btn" onClick={closeProfile}>X</button>
        <div className="profile-header">
          <h2>Student Profile</h2>
          <div className="status-wrapper">
            <span className="status-label">Status:</span>
            <span className="status-badge" style={{ backgroundColor: statusColor }}>{loanStatus}</span>
          </div>
        </div>

        <div className="tabs">
          <input type="radio" name="tab" id="detailsTab" defaultChecked />
          <label htmlFor="detailsTab">Details</label>

          <input type="radio" name="tab" id="documentsTab" />
          <label htmlFor="documentsTab">Documents</label>

          <input type="radio" name="tab" id="loanTab" />
          <label htmlFor="loanTab">Loan</label>

          <div className="tab-content details-content">
            <p><strong>Full Name:</strong> {studentData.fullName || "N/A"}</p>
            <p><strong>University:</strong> {studentData.university || "N/A"}</p>
            <p><strong>Program:</strong> {studentData.program || "N/A"}</p>
            <p><strong>Year:</strong> {studentData.year || "N/A"}</p>
            <p><strong>Student Number:</strong> {studentData.computerNumber || "N/A"}</p>
            <p><strong>NRC:</strong> {studentData.nrc || "N/A"}</p>
            <p><strong>Bank:</strong> {studentData.bankName || "N/A"}</p>
            <p><strong>Account Name:</strong> {studentData.accountName || "N/A"}</p>
          </div>

          <div className="tab-content documents-content">
            {documents.length === 0 && <p>No documents uploaded yet.</p>}
            {documents.map((doc, idx) => (
              <div key={idx} className="document-item">
                <span>{doc.name}</span>
                <a href={doc.url || "#"} target="_blank" rel="noopener noreferrer">View</a>
              </div>
            ))}
          </div>

          <div className="tab-content loan-content">
            <p><strong>Outstanding Loan Balance:</strong> ${loanBalance.toFixed(2)}</p>
            <div className="loan-bar-container">
              <div className="loan-bar" style={{ width: `${(loanBalance/5000)*100}%` }}></div>
            </div>
            <p>Loan repayment progress</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
