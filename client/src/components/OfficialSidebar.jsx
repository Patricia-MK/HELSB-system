// src/components/OfficialSidebar.jsx
import React from "react";

const OfficialSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "My Assignments", label: "📋 My Assignments", icon: "📋" },
    { id: "All Applications", label: "📄 All Applications", icon: "📄" },
    { id: "Performance", label: "📊 My Performance", icon: "📊" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">HELSB Official</h2>
        <p className="text-sm text-gray-600">Screening Department</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-green-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        
        {/* Official Badge */}
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm font-medium text-green-800">HELSB Official</div>
          <div className="text-xs text-green-600">Screening & Verification</div>
        </div>
      </nav>
    </div>
  );
};

export default OfficialSidebar;