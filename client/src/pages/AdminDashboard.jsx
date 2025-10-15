// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState({});
  const [showUploadsModal, setShowUploadsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch applicants
  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/agreements");
      setApplicants(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch applicants:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // Approve / Reject applicant - FIXED VERSION
  const updateStatus = async (id, status, studentNumber, studentName) => {
    try {
      console.log(`🔄 Admin: Updating status for ${studentName} (${studentNumber}) to: ${status}`);
      
      // First update the agreement status
      const statusResponse = await axios.put(`http://localhost:5000/api/agreements/${id}/status`, { status });
      console.log("✅ Status update response:", statusResponse.data);
      
      // Then create notification
      try {
        const notificationResponse = await axios.post(`http://localhost:5000/api/notifications`, {
          studentNumber: studentNumber,
          message: `Your loan application has been ${status.toLowerCase()} by the administrator.`,
          type: status === "Approved" ? "success" : "warning"
        });
        console.log("✅ Notification created:", notificationResponse.data);
      } catch (notificationError) {
        console.error("❌ Failed to create notification:", notificationError);
        // Don't fail the whole operation if notification fails
      }

      // Update local state
      setApplicants((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `${studentName}'s application has been ${status.toLowerCase()}`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("❌ Update status error:", err);
      
      let errorMessage = "Could not update status. Try again.";
      if (err.response) {
        errorMessage = err.response.data?.message || errorMessage;
        console.error("Server response:", err.response.data);
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  // View uploaded documents - FIXED ROUTE
  const viewUploads = async (studentNumber, studentName) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/upload/student-number/${studentNumber}`);
      setUploads(res.data);
      setSelectedStudent(studentName);
      setShowUploadsModal(true);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "No Documents",
        text: "No uploaded documents found for this student.",
      });
    }
  };

  // Filtered and searched applicants
  const filteredApplicants = applicants
    .filter((app) =>
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.program.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((app) => filterStatus === "All" || app.status === filterStatus);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">HELSB Admin Dashboard</h2>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or program..."
            className="border p-2 rounded w-full sm:w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border p-2 rounded w-full sm:w-1/4"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Applicants Table */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredApplicants.length === 0 ? (
          <p className="text-gray-500">No applicants found.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
            <table className="min-w-full text-left text-gray-700 border">
              <thead className="bg-blue-50 text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-2 border">Student Name</th>
                  <th className="px-4 py-2 border">Student Number</th>
                  <th className="px-4 py-2 border">Program</th>
                  <th className="px-4 py-2 border">Institution</th>
                  <th className="px-4 py-2 border">Loan No</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((app) => (
                  <tr key={app._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 border">{app.studentName}</td>
                    <td className="px-4 py-2 border">{app.studentNumber}</td>
                    <td className="px-4 py-2 border">{app.program}</td>
                    <td className="px-4 py-2 border">{app.institution}</td>
                    <td className="px-4 py-2 border">{app.studentLoanNo}</td>
                    <td className="px-4 py-2 border">
                      <span className={`px-2 py-1 rounded text-xs ${
                        app.status === "Approved" ? "bg-green-100 text-green-800" :
                        app.status === "Rejected" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {app.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">
                      {app.date ? new Date(app.date).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                        onClick={() => updateStatus(app._id, "Approved", app.studentNumber, app.studentName)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        onClick={() => updateStatus(app._id, "Rejected", app.studentNumber, app.studentName)}
                      >
                        Reject
                      </button>
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                        onClick={() => viewUploads(app.studentNumber, app.studentName)}
                      >
                        View Uploads
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                X
              </button>
              {Object.keys(uploads).length === 0 ? (
                <p>No documents uploaded.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(uploads).map(([key, url]) => (
                    <div key={key} className="flex items-center justify-between p-2 border rounded">
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

export default AdminDashboard;