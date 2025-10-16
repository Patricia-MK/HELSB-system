// src/components/AdminSidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: "Dashboard", label: "Dashboard", icon: "📊", description: "Overview & Analytics" },
    { id: "All Applications", label: "Applications", icon: "📋", description: "Manage student applications" },
    { id: "User Management", label: "User Management", icon: "👥", description: "Manage officials" },
    { id: "System Activity", label: "System Activity", icon: "🕒", description: "Monitor all actions" },
  ];

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b bg-blue-600 text-white">
        <h2 className="text-xl font-bold">HELSB Admin</h2>
        <p className="text-sm opacity-90">Administration Panel</p>
      </div>
      
      {/* Navigation - Clean vertical stack without status boxes */}
      <div className="p-4">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-2">
            <button
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-center p-3 rounded-lg transition-all border ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 border-blue-300 shadow-sm"
                  : "text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {/* Compact vertical layout */}
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="font-semibold text-sm">{item.label}</div>
              <div className={`text-xs mt-1 ${
                activeTab === item.id ? "text-blue-600" : "text-gray-500"
              }`}>
                {item.description}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t bg-white">
        <button
          onClick={handleLogout}
          className="w-full text-center p-3 rounded-lg transition-all border border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
        >
          <div className="text-xl mb-1">🚪</div>
          <div className="font-semibold text-sm">Log Out</div>
          <div className="text-xs text-gray-500 mt-1">Sign out of admin panel</div>
        </button>
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50">
        <div className="text-xs text-gray-600 text-center">
          HELSB System v2.0
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;