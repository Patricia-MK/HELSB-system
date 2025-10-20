// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import Swal from "sweetalert2";
import UserManagement from "../components/UserManagement";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [loanApplications, setLoanApplications] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [filteredAgreements, setFilteredAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Fetch loan applications
  const fetchLoanApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/loan-applications");
      const applications = res.data.data || res.data;
      setLoanApplications(applications);
      setFilteredLoans(applications);
    } catch (err) {
      console.error("Failed to fetch loan applications:", err);
    }
  };

  // Fetch agreements
  const fetchAgreements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/agreements");
      setAgreements(res.data);
      setFilteredAgreements(res.data);
    } catch (err) {
      console.error("Failed to fetch agreements:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchLoanApplications(), fetchAgreements()]);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === "All Applications" || activeTab === "Dashboard") {
      fetchAllData();
    }
  }, [activeTab]);

  // Search & filter for both loan applications and agreements
  useEffect(() => {
    // Filter loan applications - UPDATED SEARCH FIELDS
    let filteredLoans = loanApplications;
    if (searchTerm) {
      filteredLoans = filteredLoans.filter(
        (app) =>
          // Search in personal details
          `${app.personalDetails?.firstName || ''} ${app.personalDetails?.otherName || ''} ${app.personalDetails?.surname || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.personalDetails?.nrcNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          // Search in university details
          app.university?.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.university?.selectUniversity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.university?.enterProgram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          // Search application number
          app.applicationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus) {
      filteredLoans = filteredLoans.filter((app) => app.status === filterStatus);
    }
    setFilteredLoans(filteredLoans);

    // Filter agreements
    let filteredAgreements = agreements;
    if (searchTerm) {
      filteredAgreements = filteredAgreements.filter(
        (agr) =>
          agr.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agr.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agr.program?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus) {
      filteredAgreements = filteredAgreements.filter((agr) => agr.status === filterStatus);
    }
    setFilteredAgreements(filteredAgreements);
  }, [searchTerm, filterStatus, loanApplications, agreements]);

  // Update loan application status
  const updateLoanStatus = async (id, status, studentNumber, studentName) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/loan-applications/${id}/status`, { 
        status 
      });
      
      // Create notification for student
      try {
        await axios.post(`http://localhost:5000/api/notifications`, {
          studentNumber: studentNumber,
          message: `Your loan application has been ${status.toLowerCase()} by HELSB admin.`,
          type: status === "Approved" ? "success" : "warning"
        });
      } catch (notificationError) {
        console.error("Notification failed:", notificationError);
      }

      // Update local state
      setLoanApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app));
      
      Swal.fire({
        icon: "success",
        title: `Loan Application ${status}`,
        text: `${studentName}'s loan application has been ${status.toLowerCase()}.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to update loan status:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not update loan application status. Try again.",
      });
    }
  };

  // Update agreement status
  const updateAgreementStatus = async (id, status, studentNumber, studentName) => {
    try {
      await axios.put(`http://localhost:5000/api/agreements/${id}/status`, { status });
      
      // Create notification for student
      try {
        await axios.post(`http://localhost:5000/api/notifications`, {
          studentNumber: studentNumber,
          message: `Your screening agreement has been ${status.toLowerCase()} by HELSB admin.`,
          type: status === "Approved" ? "success" : "warning"
        });
      } catch (notificationError) {
        console.error("Notification failed:", notificationError);
      }

      // Update local state
      setAgreements(prev => prev.map(agr => agr._id === id ? { ...agr, status } : agr));
      
      Swal.fire({
        icon: "success",
        title: `Agreement ${status}`,
        text: `${studentName}'s screening agreement has been ${status.toLowerCase()}.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to update agreement status:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not update agreement status. Try again.",
      });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Under Review": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate statistics
  const loanPendingCount = loanApplications.filter(app => !app.status || app.status === "Pending").length;
  const loanApprovedCount = loanApplications.filter(app => app.status === "Approved").length;
  const loanRejectedCount = loanApplications.filter(app => app.status === "Rejected").length;
  
  const agreementPendingCount = agreements.filter(agr => !agr.status || agr.status === "Pending").length;
  const agreementApprovedCount = agreements.filter(agr => agr.status === "Approved").length;
  const agreementRejectedCount = agreements.filter(agr => agr.status === "Rejected").length;

  return (
    <div className="admin-dashboard">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>HELSB Admin Dashboard</h2>
        </div>

        {/* Dashboard Stats */}
        {activeTab === "Dashboard" && (
          <div>
            {/* Loan Applications Stats */}
            <div className="content-section">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Loan Applications Overview</h3>
              <div className="stats-grid">
                <div className="stat-card blue">
                  <h4>Total Loan Applications</h4>
                  <p className="stat-number">{loanApplications.length}</p>
                </div>
                <div className="stat-card green">
                  <h4>Approved Loans</h4>
                  <p className="stat-number">{loanApprovedCount}</p>
                </div>
                <div className="stat-card red">
                  <h4>Rejected Loans</h4>
                  <p className="stat-number">{loanRejectedCount}</p>
                </div>
              </div>
            </div>

            {/* Agreements Stats */}
            <div className="content-section">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Screening Agreements Overview</h3>
              <div className="stats-grid">
                <div className="stat-card purple">
                  <h4>Total Agreements</h4>
                  <p className="stat-number">{agreements.length}</p>
                </div>
                <div className="stat-card yellow">
                  <h4>Pending Agreements</h4>
                  <p className="stat-number">{agreementPendingCount}</p>
                </div>
                <div className="stat-card green">
                  <h4>Approved Agreements</h4>
                  <p className="stat-number">{agreementApprovedCount}</p>
                </div>
                <div className="stat-card red">
                  <h4>Rejected Agreements</h4>
                  <p className="stat-number">{agreementRejectedCount}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Applications - Both Tables */}
        {activeTab === "All Applications" && (
          <div>
            {/* Search and Filter Controls */}
            <div className="content-section">
              <div className="section-header">
                <h3>Application Management</h3>
                <div className="controls">
                  <input
                    type="text"
                    placeholder="Search by name, NRC, student number, university..."
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
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    onClick={fetchAllData}
                    className="btn btn-primary"
                  >
                    Refresh All
                  </button>
                </div>
              </div>
            </div>

            {/* Loan Applications Table */}
<div className="content-section">
  <div className="section-header">
    <h3>📋 Loan Applications ({filteredLoans.length})</h3>
  </div>

  {loading ? (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading loan applications...</p>
    </div>
  ) : filteredLoans.length === 0 ? (
    <div className="empty-state">
      <div className="empty-icon">📋</div>
      <p>No loan applications found.</p>
    </div>
  ) : (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>App #</th>
            <th>Student Name</th>
            <th>Student No.</th>
            <th>Program</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLoans.map((application) => {
            const fullName = `${application.personalDetails?.firstName || ''} ${application.personalDetails?.otherName || ''} ${application.personalDetails?.surname || ''}`.trim() || "N/A";
            const studentNumber = application.university?.studentNumber || "N/A";
            const program = application.university?.enterProgram || "N/A";

            return (
              <tr key={application._id}>
                <td className="app-number">
                  {application.applicationNumber || "N/A"}
                </td>
                <td className="student-name">{fullName}</td>
                <td className="student-number">{studentNumber}</td>
                <td className="program">{program}</td>
                <td>
                  <span className={`status-badge ${
                    application.status === "Approved" ? "status-approved" :
                    application.status === "Rejected" ? "status-rejected" :
                    "status-pending"
                  }`}>
                    {application.status || "Pending"}
                  </span>
                </td>
                <td className="date">
                  {application.submittedAt ? formatDate(application.submittedAt) : 
                  application.createdAt ? formatDate(application.createdAt) : "—"}
                </td>
                <td>
                  <div className="compact-actions">
                    <button
                      className="btn-action btn-approve"
                      onClick={() => updateLoanStatus(
                        application._id, 
                        "Approved", 
                        studentNumber, 
                        fullName
                      )}
                      disabled={application.status === "Approved"}
                      title="Approve"
                    >
                      ✓
                    </button>
                    <button
                      className="btn-action btn-reject"
                      onClick={() => updateLoanStatus(
                        application._id, 
                        "Rejected", 
                        studentNumber, 
                        fullName
                      )}
                      disabled={application.status === "Rejected"}
                      title="Reject"
                    >
                      ✕
                    </button>
                    <button
                      className="btn-action btn-review"
                      onClick={() => updateLoanStatus(
                        application._id, 
                        "Under Review", 
                        studentNumber, 
                        fullName
                      )}
                      disabled={application.status === "Under Review"}
                      title="Mark for Review"
                    >
                      🔍
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>


            {/* Agreements Table */}
            <div className="content-section">
              <div className="section-header">
                <h3>📄 Screening Agreements ({filteredAgreements.length})</h3>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading agreements...</p>
                </div>
              ) : filteredAgreements.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <p>No screening agreements found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="admin-table">
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
                      {filteredAgreements.map((agreement) => (
                        <tr key={agreement._id}>
                          <td>{agreement.studentName}</td>
                          <td className="user-number">{agreement.studentNumber}</td>
                          <td>{agreement.program}</td>
                          <td>{agreement.institution}</td>
                          <td>
                            <span className={`status-badge ${
                              agreement.status === "Approved" ? "status-approved" :
                              agreement.status === "Rejected" ? "status-rejected" :
                              "status-pending"
                            }`}>
                              {agreement.status || "Pending"}
                            </span>
                          </td>
                          <td>
                            {agreement.createdAt ? formatDate(agreement.createdAt) : "—"}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn btn-success"
                                onClick={() => updateAgreementStatus(
                                  agreement._id, 
                                  "Approved", 
                                  agreement.studentNumber, 
                                  agreement.studentName
                                )}
                              >
                                ✅ Approve
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => updateAgreementStatus(
                                  agreement._id, 
                                  "Rejected", 
                                  agreement.studentNumber, 
                                  agreement.studentName
                                )}
                              >
                                ❌ Reject
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
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === "User Management" && (
          <UserManagement />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;