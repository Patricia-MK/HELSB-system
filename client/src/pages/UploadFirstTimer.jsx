import React, { useState } from "react";
import "./UploadDocuments.css";
import capBg from "../assets/images/cap.jpg";

const UploadFirstTimer = () => {
  const [files, setFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      setFiles({ ...files, [name]: fileList[0] });
      setUploadProgress(prev => ({ ...prev, [name]: 'ready' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate that we have at least one file
    if (Object.keys(files).length === 0) {
      alert("❌ Please select at least one document to upload.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
        setUploadProgress(prev => ({ ...prev, [key]: 'uploading' }));
      }
    });

    // Get student ID from localStorage
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const userData = JSON.parse(stored);
        if (userData._id) {
          formData.append("studentId", userData._id);
          console.log("Using student ID:", userData._id);
        } else {
          throw new Error("No student ID found in user data");
        }
      } else {
        throw new Error("No user data found in localStorage");
      }
      formData.append("loanType", "first-timer");
    } catch (error) {
      console.error("Error preparing form data:", error);
      alert(`❌ Error: ${error.message}. Please log in again.`);
      setSubmitting(false);
      return;
    }

    try {
      console.log("Starting upload...");
      const response = await fetch("http://localhost:5000/api/upload/documents", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError);
        throw new Error("Server returned invalid response. Please try again.");
      }
      
      if (!response.ok) {
        throw new Error(data.message || `Upload failed with status ${response.status}`);
      }

      if (data.status === "success") {
        // Update all progress to completed
        Object.keys(files).forEach(key => {
          setUploadProgress(prev => ({ ...prev, [key]: 'completed' }));
        });
        
        setTimeout(() => {
          alert("🎉 " + data.message);
          // Trigger profile refresh
          window.dispatchEvent(new Event('profileRefresh'));
          window.location.href = "/student-dashboard";
        }, 1000);
      } else {
        throw new Error(data.message || "Upload failed");
      }

    } catch (err) {
      console.error("Upload error:", err);
      alert(`❌ Upload failed: ${err.message}`);
      // Reset progress on error
      Object.keys(files).forEach(key => {
        setUploadProgress(prev => ({ ...prev, [key]: 'error' }));
      });
      setSubmitting(false);
    }
  };

  const documentRequirements = [
    { name: "grade12Results", label: " Grade 12 Results", required: true },
    { name: "guardianNrc", label: " Guardian NRC", required: true },
    { name: "passportPhotos", label: "Passport Photo", required: true },
    { name: "confirmationSlip", label: " Confirmation Slip", required: true },
    { name: "paymentHistory", label: " Payment History", required: true },
    { name: "results", label: "Academic Results", required: true },
    { name: "proofOfPayment", label: "Proof of Payment", required: true },
    { name: "nrc", label: " Your NRC", required: true },
    { name: "bankStatement", label: "Bank Statement", required: true }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'uploading': return '⏳';
      case 'ready': return '📁';
      case 'error': return '❌';
      default: return '📄';
    }
  };

  return (
    <div className="upload-page" style={{ backgroundImage: `url(${capBg})` }}>
      <div className="upload-overlay">
        <main className="upload-container modern-upload">
          <div className="upload-header">
            <h2>🎓 First-Year Student Screening</h2>
            <p>Upload all required documents to complete your screening process</p>
          </div>

          <form onSubmit={handleSubmit} className="upload-form-grid">
            <div className="documents-grid">
              {documentRequirements.map((doc, index) => (
                <div key={doc.name} className="document-card" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="document-header">
                    <span className="doc-icon">{getStatusIcon(uploadProgress[doc.name])}</span>
                    <label className="doc-label">{doc.label}</label>
                    {doc.required && <span className="required-badge">Required</span>}
                  </div>
                  <input 
                    type="file" 
                    name={doc.name} 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    onChange={handleFileChange} 
                    required={doc.required}
                    className="file-input"
                  />
                  {files[doc.name] && (
                    <div className="file-info">
                      <span className="file-name">{files[doc.name].name}</span>
                      <span className="file-size">({(files[doc.name].size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="upload-actions">
              <button type="submit" disabled={submitting} className="submit-btn">
                {submitting ? (
                  <>
                    <span className="spinner"></span>
                    Uploading Documents...
                  </>
                ) : (
                  " Submit All Documents"
                )}
              </button>
              <p className="upload-note">
               All documents will be securely stored and processed by HELSB
              </p>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default UploadFirstTimer;