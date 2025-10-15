// src/pages/OfficialDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import OfficialSidebar from "../components/OfficialSidebar";
import Swal from "sweetalert2";

const OfficialDashboard = () => {
  const [agreements, setAgreements] = useState([]);
  const [filteredAgreements, setFilteredAgreements] = useState([]);
  const [activeTab, setActiveTab] = useState("All Agreement Forms");
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

    // Search by student name or program
    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.program.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter((a) => a.status === filterStatus);
    }

    setFilteredAgreements(filtered);
  }, [searchTerm, filterStatus, agreements]);

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/agreements/${id}/status`, { status });
      setAgreements((prev) =>
        prev.map((agr) => (agr._id === id ? { ...agr, status } : agr))
      );

      Swal.fire({
        icon: "success",
        title: `Agreement ${status}`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      Swal.fire({
        icon: "error",
        title: "Could not update status",
        text: "Try again",
      });
    }
  };

  // View uploads
  const viewUploads = async (studentId, studentName) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/upload/${studentId}`);
      setUploads(res.data);
      setSelectedStudent(studentName);
      setShowUploadsModal(true);
    } catch (err) {
      console.error("Fetch error:", err);
      Swal.fire({
        icon: "info",
        title: "No uploaded documents found",
      });
    }
  };

  const totalAgreements = agreements.length;
  const totalFirstYears = agreements.filter((a) => a.year === "1" || a.year === 1).length;
  const totalReturning = totalAgreements - totalFirstYears;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <OfficialSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          HELSB Official Dashboard
        </h2>

        {/* Search & Filter */}
        {activeTab === "All Agreement Forms" && (
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search by student or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded"
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
        )}

        {/* Summary Stats */}
        {activeTab === "Summary Stats" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
              <h4 className="text-gray-500">Total Agreements</h4>
              <p className="text-3xl font-bold">{totalAgreements}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
              <h4 className="text-gray-500">First-Year Students</h4>
              <p className="text-3xl font-bold">{totalFirstYears}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-500">
              <h4 className="text-gray-500">Returning Students</h4>
              <p className="text-3xl font-bold">{totalReturning}</p>
            </div>
          </div>
        )}

        {/* All Agreement Forms Table */}
        {activeTab === "All Agreement Forms" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Submitted Student Agreements
            </h3>

            {loading ? (
              <p>Loading...</p>
            ) : filteredAgreements.length === 0 ? (
              <p className="text-gray-500">No agreements found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-700 border">
                  <thead className="bg-blue-50 text-gray-600 uppercase">
                    <tr>
                      <th className="px-4 py-2 border">Student Name</th>
                      <th className="px-4 py-2 border">Loan No</th>
                      <th className="px-4 py-2 border">Program</th>
                      <th className="px-4 py-2 border">Institution</th>
                      <th className="px-4 py-2 border">Year</th>
                      <th className="px-4 py-2 border">Status</th>
                      <th className="px-4 py-2 border">Date</th>
                      <th className="px-4 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgreements.map((agr) => (
                      <tr key={agr._id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 border">{agr.studentName}</td>
                        <td className="px-4 py-2 border">{agr.studentLoanNo}</td>
                        <td className="px-4 py-2 border">{agr.program}</td>
                        <td className="px-4 py-2 border">{agr.institution}</td>
                        <td className="px-4 py-2 border">{agr.year}</td>
                        <td className="px-4 py-2 border">{agr.status || "Pending"}</td>
                        <td className="px-4 py-2 border">
                          {agr.date ? new Date(agr.date).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-2 border space-x-2">
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            onClick={() => updateStatus(agr._id, "Approved")}
                          >
                            ✅
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            onClick={() => updateStatus(agr._id, "Rejected")}
                          >
                            ❌
                          </button>
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            onClick={() => viewUploads(agr.studentNumber, agr.studentName)}
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
          </div>
        )}
      </div>

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
              <ul className="space-y-2">
                {Object.entries(uploads).map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {key}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficialDashboard;
