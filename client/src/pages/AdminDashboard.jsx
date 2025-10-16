// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import Swal from "sweetalert2";
import UserManagement from "../components/UserManagement";
import SystemActivity from "../components/SystemActivity";

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
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 ml-64 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          HELSB Admin Dashboard
        </h2>

        {/* Dashboard Stats */}
        {activeTab === "Dashboard" && (
          <div className="space-y-8">
            {/* Loan Applications Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Loan Applications Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <h4 className="text-gray-500">Total Loan Applications</h4>
                  <p className="text-3xl font-bold">{loanApplications.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                  <h4 className="text-gray-500">Pending Loans</h4>
                  <p className="text-3xl font-bold">{loanPendingCount}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <h4 className="text-gray-500">Approved Loans</h4>
                  <p className="text-3xl font-bold">{loanApprovedCount}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                  <h4 className="text-gray-500">Rejected Loans</h4>
                  <p className="text-3xl font-bold">{loanRejectedCount}</p>
                </div>
              </div>
            </div>

            {/* Agreements Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Screening Agreements Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                  <h4 className="text-gray-500">Total Agreements</h4>
                  <p className="text-3xl font-bold">{agreements.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                  <h4 className="text-gray-500">Pending Agreements</h4>
                  <p className="text-3xl font-bold">{agreementPendingCount}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <h4 className="text-gray-500">Approved Agreements</h4>
                  <p className="text-3xl font-bold">{agreementApprovedCount}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                  <h4 className="text-gray-500">Rejected Agreements</h4>
                  <p className="text-3xl font-bold">{agreementRejectedCount}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Applications - Both Tables */}
        {activeTab === "All Applications" && (
          <div className="space-y-8">
            {/* Search and Filter Controls */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Application Management</h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Search by name, NRC, student number, university..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border rounded w-64"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    onClick={fetchAllData}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Refresh All
                  </button>
                </div>
              </div>
            </div>

            {/* Loan Applications Table */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-700">
                  📋 Loan Applications ({filteredLoans.length})
                </h3>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading loan applications...</p>
                </div>
              ) : filteredLoans.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No loan applications found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-gray-600 uppercase">
                      <tr>
                        <th className="px-4 py-3">App Number</th>
                        <th className="px-4 py-3">Full Name</th>
                        <th className="px-4 py-3">NRC Number</th>
                        <th className="px-4 py-3">Student Number</th>
                        <th className="px-4 py-3">University</th>
                        <th className="px-4 py-3">Program</th>
                        <th className="px-4 py-3">Loan Rate</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date Applied</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLoans.map((application) => {
                        // Extract values using the CORRECT field names from your database
                        const fullName = `${application.personalDetails?.firstName || ''} ${application.personalDetails?.otherName || ''} ${application.personalDetails?.surname || ''}`.trim() || "Not Provided";
                        const nrcNumber = application.personalDetails?.nrcNumber || "Not Provided";
                        const studentNumber = application.university?.studentNumber || "Not Provided";
                        const university = application.university?.selectUniversity || "Not Provided";
                        const program = application.university?.enterProgram || "Not Provided";
                        const loanRate = application.university?.rateOfApplication ? `${application.university.rateOfApplication}%` : "Not Specified";
                        const phoneNumber = application.personalDetails?.phoneNumber || "Not Provided";

                        return (
                          <tr key={application._id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-blue-600">
                              {application.applicationNumber || "N/A"}
                            </td>
                            <td className="px-4 py-3 font-medium">{fullName}</td>
                            <td className="px-4 py-3 font-mono">{nrcNumber}</td>
                            <td className="px-4 py-3 font-mono text-blue-600">{studentNumber}</td>
                            <td className="px-4 py-3">{university}</td>
                            <td className="px-4 py-3">{program}</td>
                            <td className="px-4 py-3 font-medium">{loanRate}</td>
                            <td className="px-4 py-3">{phoneNumber}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(application.status)}`}>
                                {application.status || "Pending"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {application.submittedAt ? formatDate(application.submittedAt) : 
                              application.createdAt ? formatDate(application.createdAt) : "—"}
                            </td>
                            <td className="px-4 py-3 space-x-2">
                              <button
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm transition-colors"
                                onClick={() => updateLoanStatus(
                                  application._id, 
                                  "Approved", 
                                  studentNumber, 
                                  fullName
                                )}
                                disabled={application.status === "Approved"}
                              >
                                {application.status === "Approved" ? "✅ Approved" : "✅ Approve"}
                              </button>
                              <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition-colors"
                                onClick={() => updateLoanStatus(
                                  application._id, 
                                  "Rejected", 
                                  studentNumber, 
                                  fullName
                                )}
                                disabled={application.status === "Rejected"}
                              >
                                {application.status === "Rejected" ? "❌ Rejected" : "❌ Reject"}
                              </button>
                              <button
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm transition-colors"
                                onClick={() => updateLoanStatus(
                                  application._id, 
                                  "Under Review", 
                                  studentNumber, 
                                  fullName
                                )}
                                disabled={application.status === "Under Review"}
                              >
                                {application.status === "Under Review" ? "🔍 Reviewing" : "🔍 Review"}
                              </button>
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
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-green-700">
                  📄 Screening Agreements ({filteredAgreements.length})
                </h3>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading agreements...</p>
                </div>
              ) : filteredAgreements.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No screening agreements found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-gray-600 uppercase">
                      <tr>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Student Number</th>
                        <th className="px-4 py-3">Program</th>
                        <th className="px-4 py-3">Institution</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAgreements.map((agreement) => (
                        <tr key={agreement._id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{agreement.studentName}</td>
                          <td className="px-4 py-3 font-mono text-blue-600">{agreement.studentNumber}</td>
                          <td className="px-4 py-3">{agreement.program}</td>
                          <td className="px-4 py-3">{agreement.institution}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              agreement.status === "Approved" ? "bg-green-100 text-green-800" :
                              agreement.status === "Rejected" ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {agreement.status || "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {agreement.createdAt ? formatDate(agreement.createdAt) : "—"}
                          </td>
                          <td className="px-4 py-3 space-x-2">
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm transition-colors"
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
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition-colors"
                              onClick={() => updateAgreementStatus(
                                agreement._id, 
                                "Rejected", 
                                agreement.studentNumber, 
                                agreement.studentName
                              )}
                            >
                              ❌ Reject
                            </button>
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

        {/* System Activity Tab */}
        {activeTab === "System Activity" && (
          <SystemActivity />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;