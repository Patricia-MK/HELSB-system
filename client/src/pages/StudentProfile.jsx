import React, { useState, useEffect } from "react";
import "./StudentProfile.css";

const StudentProfile = ({ closeProfile, onCloseRefresh }) => {
  const [student, setStudent] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requiredUploads, setRequiredUploads] = useState([]); // NEW: Track required uploads
  const [loanInfo, setLoanInfo] = useState({
    outstandingBalance: 0,
    currentYearAllocation: {
      tuition: 0,
      accommodation: 0,
      mealAllowance: 0,
      total: 0
    }
  });

  // Load student info from localStorage
  useEffect(() => {
    const loadStudentData = () => {
      setLoading(true);
      console.log("🔍 Loading student data from localStorage...");
      
      try {
        const storedUser = localStorage.getItem("user");
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log("✅ User data found:", userData);
          
          if (userData && userData.email) {
            setStudent(userData);
            calculateLoanInfo(userData);
            
            // Fetch documents if student has ID
            if (userData._id) {
              fetchDocuments(userData._id);
              fetchRequiredUploads(userData._id); // NEW: Fetch required uploads
            } else {
              setLoading(false);
            }
            return;
          }
        }
        
        // If no user data found
        console.log("❌ No valid user data found in localStorage");
        setStudent(null);
        setLoading(false);
        
      } catch (error) {
        console.error("Error loading student data:", error);
        setStudent(null);
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  // NEW: Fetch required uploads based on student type
  const fetchRequiredUploads = async (studentId) => {
    try {
      console.log("🔍 Fetching required uploads for student:", studentId);
      const response = await fetch(`http://localhost:5000/api/student/uploads/${studentId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("✅ Required uploads received:", data.uploads);
      console.log("🎓 Student type:", data.studentType);
      
      setRequiredUploads(data.uploads || []);
    } catch (error) {
      console.error("❌ Error fetching required uploads:", error);
      setRequiredUploads([]);
    }
  };

  // Calculate loan information
  const calculateLoanInfo = (studentData) => {
    if (!studentData) return;

    const year = studentData.year || 1;
    
    // Base amounts per year (HELSB rates)
    const tuitionPerYear = 25808;
    const accommodationPerYear = 3900;
    const mealAllowancePerYear = 9000; // 750 * 12 months
    
    const totalPerYear = tuitionPerYear + accommodationPerYear + mealAllowancePerYear;
    
    // Calculate outstanding balance based on years completed
    const outstandingBalance = totalPerYear * year;

    const loanInfo = {
      outstandingBalance,
      currentYearAllocation: {
        tuition: tuitionPerYear,
        accommodation: accommodationPerYear,
        mealAllowance: mealAllowancePerYear,
        total: totalPerYear
      }
    };

    console.log("💰 Calculated loan info:", loanInfo);
    setLoanInfo(loanInfo);
  };

  // Fetch uploaded documents
  const fetchDocuments = async (studentId) => {
    try {
      console.log("📁 Fetching documents for student:", studentId);
      const res = await fetch(`http://localhost:5000/api/student/documents/${studentId}`);
      
      if (res.ok) {
        const data = await res.json();
        console.log("✅ Documents received:", data.documents);
        setDocuments(data.documents || []);
      } else {
        console.log("📭 No documents found");
        setDocuments([]);
      }
    } catch (err) {
      console.error("❌ Error fetching documents:", err);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onCloseRefresh) onCloseRefresh();
    closeProfile();
  };

  // Handle resubmit documents
  const handleResubmitDocuments = () => {
    // Close profile modal
    closeProfile();
    
    // Navigate to upload page after a short delay
    setTimeout(() => {
      // Get student data to determine if first-timer or returning
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const isFirstTimer = userData.year === 1;
        
        if (isFirstTimer) {
          window.location.href = "/upload-first-timer";
        } else {
          window.location.href = "/upload-returning";
        }
      } else {
        // Fallback to first-timer if user data not available
        window.location.href = "/upload-first-timer";
      }
    }, 300);
  };

  const getStatus = () => {
    if (documents.length > 0) return { text: "Screening Completed", color: "#28a745" };
    if (student) return { text: "Ready for Screening", color: "#f39c12" };
    return { text: "Not Started", color: "#e74c3c" };
  };

  // NEW: Calculate progress based on required uploads vs uploaded documents
  const getProgressInfo = () => {
    if (requiredUploads.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    const uploadedDocNames = documents.map(doc => 
      doc.name.toLowerCase().replace(/ /g, '')
    );
    
    const completed = requiredUploads.filter(upload => 
      uploadedDocNames.some(docName => 
        docName.includes(upload.toLowerCase().replace(/ /g, ''))
      )
    ).length;
    
    const total = requiredUploads.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  const status = getStatus();
  const progress = getProgressInfo(); // NEW: Progress information

  if (loading) {
    return (
      <div className="profile-overlay">
        <div className="profile-container">
          <div className="loading-state">
            <div className="spinner"></div>
            Loading your profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-overlay">
      <div className="profile-container">
        <button className="close-btn" onClick={handleClose}>×</button>

        <div className="profile-header">
          <h2>Student Profile</h2>
          <div className="status-wrapper">
            <span className="status-label">Status:</span>
            <span className="status-badge" style={{ backgroundColor: status.color }}>
              {status.text}
            </span>
          </div>
        </div>

        <div className="tabs">
          <input type="radio" name="tab" id="detailsTab" defaultChecked />
          <label htmlFor="detailsTab">Student Details</label>

          <input type="radio" name="tab" id="documentsTab" />
          <label htmlFor="documentsTab">Documents</label>

          <input type="radio" name="tab" id="loanTab" />
          <label htmlFor="loanTab">Loan Information</label>

          {/* Details Tab */}
          <div className="tab-content details-content">
            {student ? (
              <div className="student-details">
                <div className="detail-section">
                  <h4>Personal Information</h4>
                  <div className="detail-item">
                    <strong>Full Name:</strong> {student.fullName}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {student.email}
                  </div>
                  <div className="detail-item">
                    <strong>NRC:</strong> {student.nrcNo}
                  </div>
                  <div className="detail-item">
                    <strong>Student Type:</strong> {student.studentType === 'firstYear' ? 'First Year' : 'Returning Student'}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Academic Information</h4>
                  <div className="detail-item">
                    <strong>University:</strong> {student.institution}
                  </div>
                  <div className="detail-item">
                    <strong>Program:</strong> {student.program}
                  </div>
                  <div className="detail-item">
                    <strong>Year:</strong> {student.year}
                  </div>
                  <div className="detail-item">
                    <strong>Qualification:</strong> {student.qualification}
                  </div>
                  <div className="detail-item">
                    <strong>School:</strong> {student.school}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Loan Information</h4>
                  <div className="detail-item">
                    <strong>Student Number:</strong> {student.studentID}
                  </div>
                  <div className="detail-item">
                    <strong>Loan Number:</strong> {student.loanNumber}
                  </div>
                </div>
              </div>
            ) : (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <h4>Profile Not Available</h4>
                <p>Please log in again to access your profile.</p>
              </div>
            )}
          </div>

          {/* Documents Tab */}
          <div className="tab-content documents-content">
            {documents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h4>No Documents Uploaded</h4>
                <p>You haven't uploaded any documents yet.</p>
                <small>Complete the screening process to upload your documents.</small>
                
                {/* NEW: Show required uploads list */}
                {requiredUploads.length > 0 && (
                  <div className="required-uploads">
                    <h5>Required Documents:</h5>
                    <ul>
                      {requiredUploads.map((upload, index) => (
                        <li key={index}>• {upload.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="documents-list">
                <div className="documents-header">
                  <h4>Uploaded Documents ({documents.length})</h4>
                  <button 
                    className="resubmit-btn"
                    onClick={handleResubmitDocuments}
                  >
                    📎 Resubmit Documents
                  </button>
                </div>
                {documents.map((doc, idx) => (
                  <div key={idx} className="document-item">
                    <div className="document-info">
                      <span className="document-icon">📄</span>
                      <span className="document-name">{doc.name}</span>
                    </div>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="view-document-btn">
                      View
                    </a>
                  </div>
                ))}
                <div className="resubmit-note">
                  <p>📝 <strong>Need to update your documents?</strong> Click "Resubmit Documents" to upload new versions. Your previous documents will be replaced.</p>
                </div>
              </div>
            )}
          </div>

          {/* Loan Tab */}
          <div className="tab-content loan-content">
            {student ? (
              <>
                <div className="loan-section">
                  <h4>Current Year Allocation</h4>
                  <div className="loan-breakdown">
                    <div className="loan-item">
                      <span>Tuition Fee:</span>
                      <strong>K{loanInfo.currentYearAllocation.tuition.toLocaleString()}</strong>
                    </div>
                    <div className="loan-item">
                      <span>Accommodation:</span>
                      <strong>K{loanInfo.currentYearAllocation.accommodation.toLocaleString()}</strong>
                    </div>
                    <div className="loan-item">
                      <span>Meal Allowance:</span>
                      <strong>K{loanInfo.currentYearAllocation.mealAllowance.toLocaleString()}</strong>
                    </div>
                    <div className="loan-total">
                      <span>Total This Year:</span>
                      <strong>K{loanInfo.currentYearAllocation.total.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
                
                <div className="loan-section">
                  <h4>Outstanding Balance</h4>
                  <div className="outstanding-balance">
                    <div className="balance-amount">K{loanInfo.outstandingBalance.toLocaleString()}</div>
                    <p>Total loan amount allocated for your studies</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="error-state">
                <div className="error-icon">💰</div>
                <h4>Loan Information Unavailable</h4>
                <p>Please log in to view loan details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;