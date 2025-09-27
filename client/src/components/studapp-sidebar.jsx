import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Sidebar styled to match the portal look

function StudappSidebar({ isOpen = true }) {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const isPath = (path) => pathname === path;
  const isHash = (h) => hash === h;
  const [applyOpen, setApplyOpen] = useState(false);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (_) {}
    navigate("/login");
  };

  return (
    <aside className="studapp-sidebar p-4 flex flex-col">
      <nav className="flex flex-col gap-2 flex-1">
        <Link
          className={"px-3 py-2 rounded " + (isPath("/studapp-dashboard") && !hash ? "active" : "")}
          to="/studapp-dashboard"
        >
          Home
        </Link>
        <Link
          className={"px-3 py-2 rounded " + (isHash("#register") ? "active" : "")}
          to="/studapp-dashboard#register"
        >
          Register
        </Link>
        <button
          type="button"
          className={"text-left px-3 py-2 rounded flex items-center justify-between " + ((isHash("#apply-loan") || isHash("#apply-scholarship")) ? "active" : "")}
          onClick={() => setApplyOpen((v) => !v)}
        >
          <span>Apply</span>
          <span>{applyOpen ? "▾" : "▸"}</span>
        </button>
        {isOpen && applyOpen && (
          <div className="ml-3 flex flex-col gap-1">
            <Link
              className={"px-3 py-2 rounded " + (isHash("#apply-loan") ? "active" : "")}
              to="/studapp-dashboard#apply-loan"
            >
              Apply for Student Loan
            </Link>
            <Link
              className={"px-3 py-2 rounded " + (isHash("#apply-scholarship") ? "active" : "")}
              to="/studapp-dashboard#apply-scholarship"
            >
              Apply for Scholarship
            </Link>
          </div>
        )}
        <Link
          className={"px-3 py-2 rounded " + (isHash("#screening") ? "active" : "")}
          to="/studapp-dashboard#screening"
        >
          Screening
        </Link>
        <Link
          className={"px-3 py-2 rounded " + (isHash("#notifications") ? "active" : "")}
          to="/studapp-dashboard#notifications"
        >
          Notifications
        </Link>
        <Link
          className={"px-3 py-2 rounded " + (isHash("#profile") ? "active" : "")}
          to="/studapp-dashboard#profile"
        >
          Profile
        </Link>
        <Link
          className={"px-3 py-2 rounded " + (isHash("#settings") ? "active" : "")}
          to="/studapp-dashboard#settings"
        >
          Settings
        </Link>
      </nav>
      <div className="studapp-sidebar-footer pt-4 mt-auto">
        <button onClick={handleLogout} className="px-3 py-2 rounded" style={{ background: "#dc2626", color: "#fff", width: "100%", display: isOpen ? "block" : "none" }}>
          Log Out
        </button>
      </div>
    </aside>
  );
}

export default StudappSidebar;


