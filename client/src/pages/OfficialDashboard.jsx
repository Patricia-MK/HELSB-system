// src/pages/OfficialDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import OfficialSidebar from "../components/OfficialSidebar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
  const [documents, setDocuments] = useState([]);
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
  const viewUploads = async (studentNumber, studentName, studentId) => {
    try {
      setLoadingDocuments(true);
      
      // Use the actual student ID from the agreement or fallback to student number
      const targetStudentId = studentId || studentNumber;
      
      console.log("🔍 Fetching documents for:", {
        studentId: targetStudentId,
        studentName,
        studentNumber
      });

      if (!targetStudentId) {
        console.error("❌ Student ID is undefined");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Student ID not found.",
        });
        return;
      }

      const res = await axios.get(`http://localhost:5000/api/upload/student-id/${targetStudentId}`);
      
      console.log("✅ Documents response:", res.data);
      
      // Handle both array and object responses
      if (Array.isArray(res.data)) {
        if (res.data.length > 0) {
          setDocuments(res.data);
          setUploads(res.data[0].documents || {});
        } else {
          setDocuments([]);
          setUploads({});
        }
      } else {
        setDocuments([res.data]);
        setUploads(res.data.documents || {});
      }
      
      setSelectedStudent(studentName);
      setSelectedStudentNumber(studentNumber);
      setShowUploadsModal(true);
      
    } catch (err) {
      console.error("❌ Error fetching documents:", err);
      
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
    setDocuments([]);
    setSelectedStudent(null);
    setSelectedStudentNumber("");
  };

  // Get document icon based on file type
  const getDocumentIcon = (fileName) => {
    if (fileName.includes('nrc') || fileName.includes('guardian')) return '🆔';
    if (fileName.includes('academic') || fileName.includes('results') || fileName.includes('grade')) return '📚';
    if (fileName.includes('admission')) return '🎓';
    if (fileName.includes('bank') || fileName.includes('payment')) return '💳';
    if (fileName.includes('confirmation')) return '✅';
    if (fileName.includes('passport')) return '📷';
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

  // Get file type from URL
  const getFileType = (url) => {
    if (!url) return 'Unknown';
    const extension = url.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return 'PDF';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'Image';
    if (['doc', 'docx'].includes(extension)) return 'Word Document';
    return 'File';
  };

  const pendingCount = agreements.filter(a => !a.status || a.status === "Pending").length;
  const approvedCount = agreements.filter(a => a.status === "Approved").length;
  const rejectedCount = agreements.filter(a => a.status === "Rejected").length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <OfficialSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          HELSB Official Dashboard
        </h2>

        {/* Official Stats */}
        {activeTab === "My Assignments" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h4 className="text-gray-500">Total Assigned</h4>
              <p className="text-3xl font-bold">{agreements.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <h4 className="text-gray-500">Pending Review</h4>
              <p className="text-3xl font-bold">{pendingCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h4 className="text-gray-500">Approved</h4>
              <p className="text-3xl font-bold">{approvedCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <h4 className="text-gray-500">Rejected</h4>
              <p className="text-3xl font-bold">{rejectedCount}</p>
            </div>
          </div>
        )}

        {/* Applications Table */}
        {(activeTab === "My Assignments" || activeTab === "All Applications") && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {activeTab === "My Assignments" ? "My Assigned Applications" : "All Applications"} ({filteredAgreements.length})
              </h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search by student or program..."
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
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading applications...</p>
              </div>
            ) : filteredAgreements.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No applications found.</p>
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
                    {filteredAgreements.map((agr) => (
                      <tr key={agr._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{agr.studentName}</td>
                        <td className="px-4 py-3 font-mono text-blue-600">{agr.studentNumber}</td>
                        <td className="px-4 py-3">{agr.program}</td>
                        <td className="px-4 py-3">{agr.institution}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            agr.status === "Approved" ? "bg-green-100 text-green-800" :
                            agr.status === "Rejected" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {agr.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {agr.createdAt ? new Date(agr.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3 space-x-2">
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm transition-colors"
                            onClick={() => updateStatus(agr._id, "Approved", agr.studentNumber, agr.studentName)}
                          >
                            ✅ Approve
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition-colors"
                            onClick={() => updateStatus(agr._id, "Rejected", agr.studentNumber, agr.studentName)}
                          >
                            ❌ Reject
                          </button>
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm transition-colors flex items-center space-x-1"
                            onClick={() => viewUploads(agr.studentNumber, agr.studentName, agr.studentId)}
                            disabled={loadingDocuments}
                          >
                            {loadingDocuments ? (
                              <>
                                <span className="animate-spin">⏳</span>
                                <span>Loading...</span>
                              </>
                            ) : (
                              <>
                                <span>📁</span>
                                <span>View Docs</span>
                              </>
                            )}
                          </button>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    📁 Student Documents
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {selectedStudent} • {selectedStudentNumber}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Found {Object.keys(uploads).length} document(s)
                  </p>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-800 text-xl bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                  onClick={closeModal}
                >
                  ✕
                </button>
              </div>

              {/* Documents List */}
              {Object.keys(uploads).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 text-lg">No documents uploaded yet.</p>
                  <p className="text-gray-400 text-sm mt-2">
                    This student hasn't uploaded any documents for review.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      ✅ Ready for Review
                    </span>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(uploads).map(([key, url]) => (
                      <div key={key} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <span className="text-2xl mt-1">{getDocumentIcon(key)}</span>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">
                                {formatDocumentName(key)}
                              </h4>
                              <p className="text-gray-500 text-sm mt-1">
                                {getFileType(url)} • Click to view
                              </p>
                            </div>
                          </div>
                          <a
                            href={`http://localhost:5000${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm transition-colors whitespace-nowrap"
                          >
                            View Document
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Documents are securely stored and can be viewed by authorized officials only.
                  </p>
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialDashboard;