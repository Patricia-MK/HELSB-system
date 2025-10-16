// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState({});
  const [showUploadsModal, setShowUploadsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // User Management State
  const [newOfficial, setNewOfficial] = useState({
    name: "",
    email: "",
    role: "official",
    department: "Screening"
  });

  // System Activity State
  const [systemActivity, setSystemActivity] = useState([]);
  const [performanceStats, setPerformanceStats] = useState({});

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [agreementsRes, officialsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/agreements"),
        axios.get("http://localhost:5000/api/admin/officials")
      ]);
      setApplicants(agreementsRes.data);
      setFilteredApplicants(agreementsRes.data);
      setOfficials(officialsRes.data);
      
      // Generate system activity and performance stats
      generateSystemActivity(agreementsRes.data, officialsRes.data);
      generatePerformanceStats(agreementsRes.data, officialsRes.data);
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      // Load mock data for demo
      setOfficials([
        { _id: "1", name: "Dr. John Machayi", email: "john.machayi@helsb.gov.zm", role: "super_admin", department: "Management", createdAt: new Date() },
        { _id: "2", name: "Sarah Banda", email: "sarah.banda@helsb.gov.zm", role: "official", department: "Screening", createdAt: new Date() },
        { _id: "3", name: "Mike Tembo", email: "mike.tembo@helsb.gov.zm", role: "official", department: "Verification", createdAt: new Date() }
      ]);
      generateSystemActivity(applicants, officials);
      generatePerformanceStats(applicants, officials);
      setLoading(false);
    }
  };

  // Generate system activity log
  const generateSystemActivity = (applications, officialsList) => {
    const activities = [];
    
    // Recent application submissions
    applications.slice(0, 5).forEach(app => {
      activities.push({
        id: `app-${app._id}`,
        type: "application_submitted",
        description: `New application from ${app.studentName}`,
        user: "System",
        timestamp: app.createdAt || new Date(),
        priority: "info"
      });
    });

    // Status updates
    applications.filter(app => app.status && app.status !== "Pending").slice(0, 5).forEach(app => {
      activities.push({
        id: `status-${app._id}`,
        type: "status_updated",
        description: `Application ${app.status.toLowerCase()} for ${app.studentName}`,
        user: "System",
        timestamp: app.updatedAt || new Date(),
        priority: app.status === "Approved" ? "success" : "warning"
      });
    });

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setSystemActivity(activities.slice(0, 8)); // Last 8 activities
  };

  // Generate performance statistics
  const generatePerformanceStats = (applications, officialsList) => {
    const stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => !app.status || app.status === "Pending").length,
      approvedApplications: applications.filter(app => app.status === "Approved").length,
      rejectedApplications: applications.filter(app => app.status === "Rejected").length,
      
      // Official performance
      officialPerformance: officialsList.map(off => ({
        name: off.name,
        department: off.department,
        totalReviewed: Math.floor(Math.random() * 50) + 10,
        approvalRate: Math.floor(Math.random() * 30) + 60,
        avgProcessingTime: Math.floor(Math.random() * 24) + 2
      })),
      
      // System metrics
      systemMetrics: {
        approvalRate: "72%",
        completionRate: "85%"
      }
    };
    
    setPerformanceStats(stats);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search & filter applicants
  useEffect(() => {
    let filtered = applicants;
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.program.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterStatus !== "All") {
      filtered = filtered.filter((app) => app.status === filterStatus);
    }
    setFilteredApplicants(filtered);
  }, [searchQuery, filterStatus, applicants]);

  // Add new official
  const addOfficial = async (e) => {
    e.preventDefault();
    // Mock success for demo
    const mockOfficial = {
      _id: Date.now().toString(),
      ...newOfficial,
      createdAt: new Date()
    };
    setOfficials([...officials, mockOfficial]);
    setNewOfficial({ name: "", email: "", role: "official", department: "Screening" });
    Swal.fire("Success", "Official added successfully", "success");
  };

  // Delete official
  const deleteOfficial = async (id) => {
    setOfficials(officials.filter(official => official._id !== id));
    Swal.fire("Deleted", "Official removed successfully", "success");
  };

  // Update application status
  const updateStatus = async (id, status, studentNumber, studentName) => {
    try {
      await axios.put(`http://localhost:5000/api/agreements/${id}/status`, { status });
      setApplicants(prev => prev.map(app => app._id === id ? { ...app, status } : app));
      Swal.fire("Success", `Application ${status.toLowerCase()}`, "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // View uploaded documents
  const viewUploads = async (studentNumber, studentName) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/upload/student-number/${studentNumber}`);
      setUploads(res.data);
      setSelectedStudent(studentName);
      setShowUploadsModal(true);
    } catch (err) {
      Swal.fire("Info", "No documents found for this student", "info");
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "success": return "border-l-green-500 bg-green-50";
      case "warning": return "border-l-yellow-500 bg-yellow-50";
      case "error": return "border-l-red-500 bg-red-50";
      default: return "border-l-blue-500 bg-blue-50";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          HELSB Admin Dashboard
        </h2>

        {/* Dashboard Overview */}
        {activeTab === "Dashboard" && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <div className="text-gray-500 text-sm">Total Applications</div>
                <div className="text-2xl font-bold mt-1">{performanceStats.totalApplications || 0}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                <div className="text-gray-500 text-sm">Pending Review</div>
                <div className="text-2xl font-bold mt-1">{performanceStats.pendingApplications || 0}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                <div className="text-gray-500 text-sm">Approved</div>
                <div className="text-2xl font-bold mt-1">{performanceStats.approvedApplications || 0}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                <div className="text-gray-500 text-sm">Active Officials</div>
                <div className="text-2xl font-bold mt-1">{officials.length}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {systemActivity.map(activity => (
                    <div key={activity.id} className={`p-3 border-l-4 rounded ${getPriorityColor(activity.priority)}`}>
                      <div className="text-sm">{activity.description}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => setActiveTab("All Applications")}
                    className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-left"
                  >
                    📋 Review Applications
                  </button>
                  <button 
                    onClick={() => setActiveTab("User Management")}
                    className="p-3 bg-green-500 text-white rounded hover:bg-green-600 text-left"
                  >
                    👥 Manage Officials
                  </button>
                  <button className="p-3 bg-purple-500 text-white rounded hover:bg-purple-600 text-left">
                    📊 Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Applications */}
        {activeTab === "All Applications" && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-xl font-semibold">Applications ({filteredApplicants.length})</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="border p-2 rounded w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="border p-2 rounded"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-left">Program</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.slice(0, 10).map((app) => (
                    <tr key={app._id} className="border-t">
                      <td className="p-3">
                        <div className="font-medium">{app.studentName}</div>
                        <div className="text-gray-600 text-sm">{app.studentNumber}</div>
                      </td>
                      <td className="p-3">{app.program}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          app.status === "Approved" ? "bg-green-100 text-green-800" :
                          app.status === "Rejected" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {app.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-3">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                            onClick={() => updateStatus(app._id, "Approved", app.studentNumber, app.studentName)}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                            onClick={() => updateStatus(app._id, "Rejected", app.studentNumber, app.studentName)}
                          >
                            Reject
                          </button>
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                            onClick={() => viewUploads(app.studentNumber, app.studentName)}
                          >
                            Docs
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === "User Management" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-6">User Management</h3>
            
            {/* Add Official Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium mb-3">Add New Official</h4>
              <form onSubmit={addOfficial} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="border p-2 rounded text-sm"
                  value={newOfficial.name}
                  onChange={(e) => setNewOfficial({...newOfficial, name: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border p-2 rounded text-sm"
                  value={newOfficial.email}
                  onChange={(e) => setNewOfficial({...newOfficial, email: e.target.value})}
                  required
                />
                <select
                  className="border p-2 rounded text-sm"
                  value={newOfficial.department}
                  onChange={(e) => setNewOfficial({...newOfficial, department: e.target.value})}
                >
                  <option value="Screening">Screening</option>
                  <option value="Verification">Verification</option>
                  <option value="Management">Management</option>
                </select>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm"
                >
                  Add Official
                </button>
              </form>
            </div>

            {/* Officials List */}
            <div>
              <h4 className="font-medium mb-4">HELSB Officials</h4>
              <div className="grid gap-4">
                {officials.map((official) => (
                  <div key={official._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{official.name}</div>
                        <div className="text-sm text-gray-600">{official.email}</div>
                        <div className="text-sm text-gray-500">{official.department}</div>
                      </div>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        onClick={() => deleteOfficial(official._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* System Activity */}
        {activeTab === "System Activity" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-6">System Activity</h3>
            <div className="space-y-3">
              {systemActivity.map(activity => (
                <div key={activity.id} className={`p-4 border-l-4 rounded ${getPriorityColor(activity.priority)}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{activity.description}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uploads Modal */}
        {showUploadsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">
                Documents for {selectedStudent}
              </h3>
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setShowUploadsModal(false)}
              >
                ✕
              </button>
              {Object.keys(uploads).length === 0 ? (
                <p className="text-gray-500">No documents uploaded.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(uploads).map(([key, url]) => (
                    <div key={key} className="flex justify-between items-center p-2 border rounded">
                      <span className="font-medium capitalize text-sm">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <a
                        href={`http://localhost:5000${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View
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