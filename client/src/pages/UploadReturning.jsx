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

    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const s = JSON.parse(stored);
        if (s._id) formData.append("studentId", s._id);
      }
      formData.append("loanType", "returning");
    } catch (_) {}

    try {
      const response = await fetch("http://localhost:5000/api/upload/documents", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert("✅ Documents uploaded successfully!");
        window.location.replace("/student-dashboard");
      } else {
        alert(`❌ Upload failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while uploading documents.");
    }

    setSubmitting(false);
  };

  return (
    <div className="upload-page" style={{ backgroundImage: `url(${capBg})` }}>
      <div className="upload-overlay">
        <main className="upload-container modern-upload">
          <h2>📁 Returning Student Upload</h2>
          <p>Upload all the required documents below (PDF or image only)</p>
          <form onSubmit={handleSubmit} className="upload-form-grid">
            <label>📄 Confirmation Slip:</label>
            <input type="file" name="confirmationSlip" accept=".pdf,image/*" onChange={handleFileChange} required />
            <label>💳 Payment History:</label>
            <input type="file" name="paymentHistory" accept=".pdf,image/*" onChange={handleFileChange} required />
            <label>📘 Results:</label>
            <input type="file" name="results" accept=".pdf,image/*" onChange={handleFileChange} required />
            <label>🧾 Proof of Payment:</label>
            <input type="file" name="proofOfPayment" accept=".pdf,image/*" onChange={handleFileChange} required />
            <label>🪪 NRC:</label>
            <input type="file" name="nrc" accept=".pdf,image/*" onChange={handleFileChange} required />
            <label>🏦 Bank Statement:</label>
            <input type="file" name="bankStatement" accept=".pdf,image/*" onChange={handleFileChange} required />
            <button type="submit" disabled={submitting}>{submitting ? "Uploading..." : "Submit Documents"}</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default UploadReturning;
