import React from "react";

const AdminSidebar = ({ scrollToSection, activeSection }) => {
  const links = [
    { name: "Dashboard", id: "dashboard" },
    { name: "Applications", id: "applications" },
    { name: "Users", id: "users" },
    { name: "Reports", id: "reports" },
  ];

  return (
    <aside className="w-64 bg-blue-900 text-white flex-shrink-0 h-screen sticky top-0">
      <div className="p-6 text-2xl font-bold border-b border-blue-800">HELSB Admin</div>
      <nav className="mt-6 flex flex-col">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={scrollToSection[link.id]}
            className={`w-full text-left px-6 py-3 transition-colors duration-200 hover:bg-blue-800 ${
              activeSection === link.id ? "bg-blue-700 font-semibold" : ""
            }`}
          >
            {link.name}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
