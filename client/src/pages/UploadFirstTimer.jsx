import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadFirstTimer = () => {
  const navigate = useNavigate();

  const [files, setFiles] = useState({
    confirmationSlip: null,
    paymentHistory: null,
    results: null,
    proofOfPayment: null,
    nrc: null,
    bankStatement: null,
    grade12Results: null,
    guardianNrc: null,
    passportPhotos: null,
  });

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const student = JSON.parse(localStorage.getItem("student"));
    if (!student || !student.studentId) {
      alert("Student info missing. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("studentId", student.studentId); // critical for backend
    // append files
    Object.keys(files).forEach((key) => {
      if (files[key]) formData.append(key, files[key]);
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload/documents",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Documents uploaded successfully!");

      // Redirect to StudentProfile.jsx
      navigate("/student-profile");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed. Please try again.");
    }
  };

  return (
    <div className="upload-page">
      <h2>Upload Documents</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Confirmation Slip:</label>
          <input type="file" name="confirmationSlip" onChange={handleFileChange} required />
        </div>
        <div>
          <label>Payment History:</label>
          <input type="file" name="paymentHistory" onChange={handleFileChange} required />
        </div>
        <div>
          <label>Results:</label>
          <input type="file" name="results" onChange={handleFileChange} required />
        </div>
        <div>
          <label>Proof of Payment:</label>
          <input type="file" name="proofOfPayment" onChange={handleFileChange} required />
        </div>
        <div>
          <label>NRC:</label>
          <input type="file" name="nrc" onChange={handleFileChange} required />
        </div>
        <div>
          <label>Bank Statement:</label>
          <input type="file" name="bankStatement" onChange={handleFileChange} required />
        </div>
        <div>
          <label>Grade 12 Results:</label>
          <input type="file" name="grade12Results" onChange={handleFileChange} required />
        </div>
        <div>
          <label>Guardian NRC:</label>
          <input type="file" name="guardianNrc" onChange={handleFileChange} required />
        </div>
        <div>
          <label>Passport Photos:</label>
          <input type="file" name="passportPhotos" onChange={handleFileChange} required />
        </div>
        <button type="submit">Upload Documents</button>
      </form>
    </div>
  );
};

export default UploadFirstTimer;
