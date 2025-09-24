// AdminSidebar.jsx
import React from "react";
import { FaTachometerAlt, FaFileAlt, FaUsers, FaChartBar } from "react-icons/fa";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Applications", icon: <FaFileAlt /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Reports", icon: <FaChartBar /> },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col min-h-screen">
      {/* Logo / Title */}
      <div className="h-20 flex items-center justify-center border-b">
        <h1 className="text-2xl font-bold text-gray-800">HELSB Admin</h1>
      </div>

      {/* Menu Items (stacked vertically) */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 text-left
              ${activeTab === item.name ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-md font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Optional footer / version */}
      <div className="p-4 border-t text-sm text-gray-500">
        v1.0
      </div>
    </aside>
  );
};

export default AdminSidebar;
