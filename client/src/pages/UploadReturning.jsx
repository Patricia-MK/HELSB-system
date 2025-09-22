import React, { useState } from "react";
import "./UploadDocuments.css";
import capBg from "../assets/images/cap.jpg";

const UploadReturning = () => {
  const [files, setFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    // Bind to student if available
    try {
      const stored = localStorage.getItem("student");
      if (stored) {
        const s = JSON.parse(stored);
        if (s.computerNumber) formData.append("computerNumber", s.computerNumber);
        if (s._id) formData.append("studentId", s._id);
      }
    } catch (_) {}

    try {
      const response = await fetch("/api/upload/documents", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("renewalStatus", result.status);
        alert("Documents uploaded successfully!");
        window.location.replace("/student-dashboard");
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while uploading documents.");
    }

    setSubmitting(false);
  };

  return (
    <div
      className="upload-page"
      style={{ backgroundImage: `url(${capBg})` }}
    >
      <div className="upload-overlay">
        <main className="upload-container">
          <h2>Upload Documents</h2>
          <p>Please upload all required documents carefully. All fields are required.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Confirmation Slip:</label>
              <input type="file" name="confirmationSlip" accept=".pdf,image/*" onChange={handleFileChange} required />
            </div>
            <div className="form-group">
              <label>Payment History:</label>
              <input type="file" name="paymentHistory" accept=".pdf,image/*" onChange={handleFileChange} required />
            </div>
            <div className="form-group">
              <label>Results:</label>
              <input type="file" name="results" accept=".pdf,image/*" onChange={handleFileChange} required />
            </div>
            <div className="form-group">
              <label>Proof of Payment / Receipt:</label>
              <input type="file" name="proofOfPayment" accept=".pdf,image/*" onChange={handleFileChange} required />
            </div>
            <div className="form-group">
              <label>NRC:</label>
              <input type="file" name="nrc" accept=".pdf,image/*" onChange={handleFileChange} required />
            </div>
            <div className="form-group">
              <label>Bank Statement:</label>
              <input type="file" name="bankStatement" accept=".pdf,image/*" onChange={handleFileChange} required />
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? "Uploading..." : "Upload Documents"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default UploadReturning;
