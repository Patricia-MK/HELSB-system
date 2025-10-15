// src/components/OfficialSidebar.jsx
import React from "react";

const OfficialSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { name: "All Agreement Forms" },
    { name: "Summary Stats" },
  ];

  return (
    <aside className="w-64 bg-gray-100 p-4 flex flex-col min-h-screen shadow-md">
      {/* Header */}
      <div className="h-20 flex items-center justify-center border-b mb-4">
        <h1 className="text-xl font-bold text-gray-800">HELSB Official</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200
              ${activeTab === item.name ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}
          >
            {item.name}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-sm text-gray-500">
        v1.0
      </div>
    </aside>
  );
};

export default OfficialSidebar;
