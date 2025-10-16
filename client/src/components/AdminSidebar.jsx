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
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 border-b bg-blue-600 text-white">
        <h2 className="text-xl font-bold">HELSB Admin</h2>
        <p className="text-sm opacity-90">Administration Panel</p>
      </div>
      
      {/* Navigation */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-all hover:shadow-md ${
                  activeTab === item.id
                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                {/* ULTRA SIMPLE VERTICAL LAYOUT - No flex at all */}
                <div className="text-lg">{item.icon}</div>
                <div className="font-medium text-sm mt-1">{item.label}</div>
                <div className={`text-xs mt-1 ${
                  activeTab === item.id ? "text-blue-600" : "text-gray-500"
                }`}>
                  {item.description}
                </div>
              </button>
            </li>
          ))}
        </ul>
        
        {/* System Status */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-800">System Online</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>🟢 All services operational</div>
            <div>👥 {menuItems.length} admin features</div>
            <div>🛡️ Secure connection</div>
          </div>
        </div>

        {/* Admin Badge */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white text-center">
          <div className="text-sm font-medium">Super Admin</div>
          <div className="text-xs opacity-90 mt-1">Full System Access</div>
        </div>
      </nav>

      {/* Logout Button - Added above footer */}
      <div className="p-4 border-t border-b bg-white">
        <button
          onClick={handleLogout}
          className="w-full text-left p-3 rounded-lg transition-all hover:shadow-md text-gray-700 hover:bg-red-50 hover:text-red-700"
        >
          {/* ULTRA SIMPLE VERTICAL LAYOUT - No flex at all */}
          <div className="text-lg">🚪</div>
          <div className="font-medium text-sm mt-1">Log Out</div>
          <div className="text-xs text-gray-500 mt-1 hover:text-red-600">
            Sign out of admin panel
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-xs text-gray-600 text-center">
          HELSB System v2.0
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;