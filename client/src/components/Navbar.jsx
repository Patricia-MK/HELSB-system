import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user info and token
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect to homepage
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        {role === "admin"
          ? "HELSB Admin Dashboard"
          : "HELSB Official Dashboard"}
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
