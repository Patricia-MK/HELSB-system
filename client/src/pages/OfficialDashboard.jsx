// src/pages/OfficialDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import OfficialSidebar from "../components/OfficialSidebar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./OfficialDashboard.css";

const OfficialDashboard = () => {
  const [agreements, setAgreements] = useState([]);
  const [filteredAgreements, setFilteredAgreements] = useState([]);
  const [activeTab, setActiveTab] = useState("My Assignments");
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState({});
  const [showUploadsModal, setShowUploadsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentNumber, setSelectedStudentNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const navigate = useNavigate();

  // Fetch agreements
  const fetchAgreements = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/agreements");
      setAgreements(res.data);
      setFilteredAgreements(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch agreements:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("official");
    navigate("/login");
  };

  // Search & filter
  useEffect(() => {
    let filtered = agreements;
    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.program.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus) {
      filtered = filtered.filter((a) => a.status === filterStatus);
    }
    setFilteredAgreements(filtered);
  }, [searchTerm, filterStatus, agreements]);

  // Update status
  const updateStatus = async (id, status, studentNumber, studentName) => {
    try {
      await axios.put(`http://localhost:5000/api/agreements/${id}/status`, { status });
      
      // Create notification
      try {
        await axios.post(`http://localhost:5000/api/notifications`, {
          studentNumber: studentNumber,
          message: `Your loan application has been ${status.toLowerCase()} by HELSB officials.`,
          type: status === "Approved" ? "success" : "warning"
        });
      } catch (notificationError) {
        console.error("Notification failed:", notificationError);
      }

      setAgreements(prev => prev.map(agr => agr._id === id ? { ...agr, status } : agr));
      
      Swal.fire({
        icon: "success",
        title: `Application ${status}`,
        text: `${studentName}'s application has been ${status.toLowerCase()}.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not update status. Try again.",
      });
    }
  };

  // View uploads - FIXED VERSION
  const viewUploads = async (studentNumber, studentName) => {
    try {
      setLoadingDocuments(true);
      
      console.log("🔍 Fetching documents for student:", studentNumber);

      if (!studentNumber) {
        console.error("❌ Student number is undefined");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Student number not found.",
        });
        return;
      }

      // Use the correct URL format with colon instead of slash
      const res = await axios.get(`http://localhost:5000/api/upload/student-id${studentNumber}`);
      
      console.log("✅ Documents response:", res.data);
      
      // Set the documents directly
      setUploads(res.data);
      setSelectedStudent(studentName);
      setSelectedStudentNumber(studentNumber);
      setShowUploadsModal(true);
      
      // Debug: Log all document URLs
      console.log("📁 All document URLs:", Object.entries(res.data).map(([key, url]) => ({
        document: key,
        url: url,
        fullUrl: `http://localhost:5000${url}`
      })));
      
    } catch (err) {
      console.error("❌ Error fetching documents:", err);
      console.error("Error details:", err.response?.data);
      
      if (err.response?.status === 404) {
        Swal.fire({
          icon: "info",
          title: "No Documents Found",
          text: err.response.data?.message || "This student hasn't uploaded any documents yet.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch documents. Please try again.",
        });
      }
    } finally {
      setLoadingDocuments(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowUploadsModal(false);
    setUploads({});
    setSelectedStudent(null);
    setSelectedStudentNumber("");
  };

  // Get document icon based on file type
  const getDocumentIcon = (key) => {
    if (key.includes('nrc') || key.includes('guardian')) return '🆔';
    if (key.includes('academic') || key.includes('results') || key.includes('grade')) return '📚';
    if (key.includes('admission')) return '🎓';
    if (key.includes('bank') || key.includes('payment')) return '💳';
    if (key.includes('confirmation')) return '✅';
    if (key.includes('passport')) return '📷';
    return '📄';
  };

  // Format document name
  const formatDocumentName = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get file type from URL - UPDATED
  const getFileType = (url) => {
    if (!url) return 'Unknown';
    const filename = url.split('/').pop(); // Get just the filename
    const extension = filename.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return 'PDF';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'Image';
    if (['doc', 'docx'].includes(extension)) return 'Word Document';
    return 'File';
  };

  const pendingCount = agreements.filter(a => !a.status || a.status === "Pending").length;
  const approvedCount = agreements.filter(a => a.status === "Approved").length;
  const rejectedCount = agreements.filter(a => a.status === "Rejected").length;

  return (
    <div className="official-dashboard">
      <OfficialSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>HELSB Official Dashboard</h2>
        </div>

        {/* Official Stats */}
        {activeTab === "My Assignments" && (
          <div className="stats-grid">
            <div className="stat-card blue">
              <h4>Total Screened</h4>
              <p className="stat-number">{agreements.length}</p>
            </div>
            <div className="stat-card yellow">
              <h4>Pending Review</h4>
              <p className="stat-number">{pendingCount}</p>
            </div>
            <div className="stat-card green">
              <h4>Approved</h4>
              <p className="stat-number">{approvedCount}</p>
            </div>
            <div className="stat-card red">
              <h4>Rejected</h4>
              <p className="stat-number">{rejectedCount}</p>
            </div>
          </div>
        )}

        {/* Applications Table */}
        {(activeTab === "My Assignments" || activeTab === "All Applications") && (
          <div className="applications-section">
            <div className="section-header">
              <h3>
                {activeTab === "My Assignments" ? "Screened Students" : "All Students"} ({filteredAgreements.length})
              </h3>
              <div className="controls">
                <input
                  type="text"
                  placeholder="Search by student or program..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading applications...</p>
              </div>
            ) : filteredAgreements.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No applications found.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="applications-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Student Number</th>
                      <th>Program</th>
                      <th>Institution</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgreements.map((agr) => (
                      <tr key={agr._id}>
                        <td>{agr.studentName}</td>
                        <td className="student-number">{agr.studentNumber}</td>
                        <td>{agr.program}</td>
                        <td>{agr.institution}</td>
                        <td>
                          <span className={`status-badge ${
                            agr.status === "Approved" ? "status-approved" :
                            agr.status === "Rejected" ? "status-rejected" :
                            "status-pending"
                          }`}>
                            {agr.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          {agr.createdAt ? new Date(agr.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-approve"
                              onClick={() => updateStatus(agr._id, "Approved", agr.studentNumber, agr.studentName)}
                            >
                              ✅ Approve
                            </button>
                            <button
                              className="btn btn-reject"
                              onClick={() => updateStatus(agr._id, "Rejected", agr.studentNumber, agr.studentName)}
                            >
                              ❌ Reject
                            </button>
                            <button
                              className="btn btn-view"
                              onClick={() => viewUploads(agr.studentNumber, agr.studentName)}
                              disabled={loadingDocuments}
                            >
                              {loadingDocuments ? (
                                <>
                                  <span className="spinner"></span>
                                  Loading...
                                </>
                              ) : (
                                <>
                                  📁 View Docs
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Uploads Modal */}
        {showUploadsModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <div>
                  <h3>📁 Student Documents</h3>
                  <p>{selectedStudent} • {selectedStudentNumber}</p>
                  <p>Found {Object.keys(uploads).length} document(s)</p>
                </div>
                <button className="close-modal" onClick={closeModal}>
                  ✕
                </button>
              </div>

              {/* Documents List - FIXED VERSION */}
              <div className="modal-body">
                {Object.keys(uploads).length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>No documents uploaded yet.</p>
                    <p>This student hasn't uploaded any documents for review.</p>
                  </div>
                ) : (
                  <div>
                    <div className="documents-grid">
                      {Object.entries(uploads).map(([key, url]) => {
                        // Ensure URL has the correct format
                        const fullUrl = url.startsWith('http') ? url : `http://localhost:5000${url}`;
                        
                        return (
                          <div key={key} className="document-card">
                            <div className="document-header">
                              <span className="document-icon">{getDocumentIcon(key)}</span>
                              <div className="document-info">
                                <h4>{formatDocumentName(key)}</h4>
                                <p>{getFileType(url)} • Click to view</p>
                              </div>
                            </div>
                            <div className="document-actions">
                              <button
                                onClick={() => {
                                  console.log(`Opening document: ${fullUrl}`);
                                  window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                }}
                                className="btn-view-document"
                              >
                                📎 View Document
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialDashboard;