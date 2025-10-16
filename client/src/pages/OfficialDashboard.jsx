// src/pages/OfficialDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import OfficialSidebar from "../components/OfficialSidebar";
import Swal from "sweetalert2";

const OfficialDashboard = () => {
  const [agreements, setAgreements] = useState([]);
  const [filteredAgreements, setFilteredAgreements] = useState([]);
  const [activeTab, setActiveTab] = useState("My Assignments");
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState({});
  const [showUploadsModal, setShowUploadsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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

  // View uploads
  const viewUploads = async (studentNumber, studentName) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/upload/student-number/${studentNumber}`);
      setUploads(res.data);
      setSelectedStudent(studentName);
      setShowUploadsModal(true);
    } catch (err) {
      Swal.fire({
        icon: "info",
        title: "No uploaded documents found",
        text: "This student hasn't uploaded any documents yet.",
      });
    }
  };

  const pendingCount = agreements.filter(a => !a.status || a.status === "Pending").length;
  const approvedCount = agreements.filter(a => a.status === "Approved").length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <OfficialSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          HELSB Official Dashboard
        </h2>

        {/* Official Stats */}
        {activeTab === "My Assignments" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <p>Loading...</p>
            ) : filteredAgreements.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No applications found.</p>
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
                        <td className="px-4 py-3">{agr.studentName}</td>
                        <td className="px-4 py-3 font-mono">{agr.studentNumber}</td>
                        <td className="px-4 py-3">{agr.program}</td>
                        <td className="px-4 py-3">{agr.institution}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            agr.status === "Approved" ? "bg-green-100 text-green-800" :
                            agr.status === "Rejected" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {agr.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {agr.createdAt ? new Date(agr.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3 space-x-2">
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                            onClick={() => updateStatus(agr._id, "Approved", agr.studentNumber, agr.studentName)}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                            onClick={() => updateStatus(agr._id, "Rejected", agr.studentNumber, agr.studentName)}
                          >
                            Reject
                          </button>
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                            onClick={() => viewUploads(agr.studentNumber, agr.studentName)}
                          >
                            View Docs
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

        {/* Uploads Modal */}
        {showUploadsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full overflow-y-auto max-h-[80vh] relative">
              <h3 className="text-xl font-semibold mb-4">
                Uploaded Documents for {selectedStudent}
              </h3>
              <button
                className="absolute top-2 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setShowUploadsModal(false)}
              >
                ✕
              </button>
              {Object.keys(uploads).length === 0 ? (
                <p>No documents uploaded.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(uploads).map(([key, url]) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <a
                        href={`http://localhost:5000${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialDashboard;