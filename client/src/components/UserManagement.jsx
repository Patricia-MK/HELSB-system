// src/components/UserManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UserManagement = () => {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOfficial, setNewOfficial] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "official"
  });

  // Fetch all officials
  const fetchOfficials = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/officials");
      setOfficials(res.data);
    } catch (err) {
      console.error("Failed to fetch officials:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load officials",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficials();
  }, []);

  // Add new official
  const addOfficial = async (e) => {
    e.preventDefault();
    
    // Validate HELSB email domain
    if (!newOfficial.email.endsWith('@helsb.gov.zm')) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Officials must use @helsb.gov.zm email domain",
      });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/admin/officials", newOfficial);
      
      Swal.fire({
        icon: "success",
        title: "Official Added",
        text: `${newOfficial.fullName} has been added as an official`,
        timer: 1500,
        showConfirmButton: false,
      });

      setNewOfficial({
        fullName: "",
        email: "",
        password: "",
        role: "official"
      });
      setShowAddForm(false);
      fetchOfficials(); // Refresh the list
    } catch (err) {
      console.error("Failed to add official:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to add official",
      });
    }
  };

  // Delete official
  const deleteOfficial = async (id, name) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Remove ${name} as an official?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/officials/${id}`);
        
        Swal.fire({
          icon: "success",
          title: "Official Removed",
          text: `${name} has been removed`,
          timer: 1500,
          showConfirmButton: false,
        });

        fetchOfficials(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete official:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to remove official",
        });
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          👥 User Management - Officials
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          + Add Official
        </button>
      </div>

      {/* Add Official Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Add New Official</h4>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={addOfficial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newOfficial.fullName}
                  onChange={(e) => setNewOfficial({ ...newOfficial, fullName: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email * <span className="text-xs text-gray-500">(must be @helsb.gov.zm)</span>
                </label>
                <input
                  type="email"
                  required
                  value={newOfficial.email}
                  onChange={(e) => setNewOfficial({ ...newOfficial, email: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="official.name@helsb.gov.zm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={newOfficial.password}
                  onChange={(e) => setNewOfficial({ ...newOfficial, password: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  minLength="6"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Add Official
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Officials List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading officials...</p>
        </div>
      ) : officials.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No officials found.</p>
          <p className="text-sm text-gray-400 mt-2">Click "Add Official" to create the first one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Date Added</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {officials.map((official) => (
                <tr key={official._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{official.fullName}</td>
                  <td className="px-4 py-3">{official.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {official.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {official.createdAt ? new Date(official.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteOfficial(official._id, official.fullName)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;