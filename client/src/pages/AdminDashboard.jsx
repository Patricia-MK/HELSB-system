// src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import ApplicationTable from "../components/ApplicationTable";
import UserTable from "../components/UserTable";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const stats = [
    { title: "Total Students", value: 1 },
    { title: "Total Officials", value: 1 },
    { title: "Total Applications", value: 2 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (left) */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content (right) */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top header */}
        <header className="bg-white shadow p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800">{activeTab}</h1>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
          {activeTab === "Dashboard" && (
            <>
              {/* Stats cards (see Step 3) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div key={stat.title} className="bg-white rounded-2xl shadow p-6 text-center">
                    <p className="text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent Applications card */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
                <ApplicationTable />
              </div>
            </>
          )}

          {activeTab === "Applications" && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">All Applications</h2>
              <ApplicationTable />
            </div>
          )}

          {activeTab === "Users" && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Users</h2>
              <UserTable />
            </div>
          )}

          {activeTab === "Reports" && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Reports</h2>
              <p className="text-gray-600">Charts and summaries will appear here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
