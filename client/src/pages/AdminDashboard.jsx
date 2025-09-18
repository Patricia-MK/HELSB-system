import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/AdminSidebar";
import UserTable from "../components/UserTable";
import ApplicationTable from "../components/ApplicationTable";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // TODO: Fetch users and applications from backend
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-200 p-4 rounded">Total Students: 0</div>
            <div className="bg-gray-200 p-4 rounded">Total Officials: 0</div>
            <div className="bg-gray-200 p-4 rounded">Total Applications: 0</div>
            <div className="bg-gray-200 p-4 rounded">Recent Activity</div>
          </div>

          {/* Tables */}
          <h3 className="text-xl font-bold mb-2">Applications</h3>
          <ApplicationTable applications={applications} onViewClick={() => {}} />

          <h3 className="text-xl font-bold mt-6 mb-2">Users</h3>
          <UserTable users={users} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
