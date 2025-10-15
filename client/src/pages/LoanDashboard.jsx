import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoanDashboard.css";

const LoanDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/loan-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setApplications(response.data);
    } catch (err) {
      setError("Failed to fetch loan applications");
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Draft": return "status-draft";
      case "Submitted": return "status-submitted";
      case "Under Review": return "status-review";
      case "Approved": return "status-approved";
      case "Rejected": return "status-rejected";
      case "Disbursed": return "status-disbursed";
      default: return "status-default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Draft": return "📝";
      case "Submitted": return "📤";
      case "Under Review": return "🔍";
      case "Approved": return "✅";
      case "Rejected": return "❌";
      case "Disbursed": return "💰";
      default: return "❓";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-ZM", {
      style: "currency",
      currency: "ZMW"
    }).format(amount);
  };

  const handleNewApplication = () => {
    navigate("/loan-application-form");
  };

  const handleViewApplication = (applicationId) => {
    navigate(`/loan-application-details/${applicationId}`);
  };

  const handleEditApplication = (applicationId) => {
    navigate(`/loan-application-edit/${applicationId}`);
  };

  const handleDeleteApplication = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/loan-applications/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setApplications(applications.filter(app => app._id !== applicationId));
    } catch (err) {
      setError("Failed to delete application");
      console.error("Error deleting application:", err);
    }
  };

  const handleSubmitApplication = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/loan-applications/${applicationId}/submit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh applications
      fetchApplications();
    } catch (err) {
      setError("Failed to submit application");
      console.error("Error submitting application:", err);
    }
  };

  if (loading) {
    return (
      <div className="loan-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your loan applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loan-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Loan Application Dashboard</h1>
          <p>Welcome back, {user?.fullName || "Student"}</p>
        </div>
        <button 
          className="btn-new-application"
          onClick={handleNewApplication}
        >
          + New Application
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-number">{applications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <div className="stat-number">
              {applications.filter(app => app.status === "Submitted" || app.status === "Under Review").length}
            </div>
            <div className="stat-label">Under Review</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">
              {applications.filter(app => app.status === "Approved").length}
            </div>
            <div className="stat-label">Approved</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">
              {applications.filter(app => app.status === "Disbursed").length}
            </div>
            <div className="stat-label">Disbursed</div>
          </div>
        </div>
      </div>

      <div className="applications-section">
        <h2>Your Loan Applications</h2>
        
        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Applications Yet</h3>
            <p>You haven't submitted any loan applications yet. Start by creating a new application.</p>
            <button 
              className="btn-primary"
              onClick={handleNewApplication}
            >
              Create First Application
            </button>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              <div key={application._id} className="application-card">
                <div className="card-header">
                  <div className="application-id">
                    #{application._id.slice(-8).toUpperCase()}
                  </div>
                  <div className={`status-badge ${getStatusColor(application.status)}`}>
                    <span className="status-icon">{getStatusIcon(application.status)}</span>
                    {application.status}
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="application-info">
                    <div className="info-row">
                      <span className="info-label">Institution:</span>
                      <span className="info-value">{application.academicInfo?.institution || "N/A"}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Program:</span>
                      <span className="info-value">{application.academicInfo?.program || "N/A"}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Amount:</span>
                      <span className="info-value">{formatCurrency(application.financialInfo?.requestedAmount)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Submitted:</span>
                      <span className="info-value">{formatDate(application.submittedAt)}</span>
                    </div>
                  </div>
                  
                  {application.reviewInfo?.reviewComments && (
                    <div className="review-comments">
                      <strong>Review Comments:</strong>
                      <p>{application.reviewInfo.reviewComments}</p>
                    </div>
                  )}
                </div>
                
                <div className="card-actions">
                  <button 
                    className="btn-view"
                    onClick={() => handleViewApplication(application._id)}
                  >
                    View Details
                  </button>
                  
                  {application.status === "Draft" && (
                    <>
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditApplication(application._id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-submit"
                        onClick={() => handleSubmitApplication(application._id)}
                      >
                        Submit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteApplication(application._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="help-section">
        <h3>Need Help?</h3>
        <div className="help-links">
          <a href="#" className="help-link">
            📖 Application Guidelines
          </a>
          <a href="#" className="help-link">
            ❓ Frequently Asked Questions
          </a>
          <a href="#" className="help-link">
            📞 Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoanDashboard;
