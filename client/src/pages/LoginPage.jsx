import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import capImage from "../assets/images/cap.jpg";
import helsbLogo from "../assets/images/helsblogo.jpg";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Save user info and token in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      // Redirect based on role
      const role = res.data.user.role;
      if (role === "student") navigate("/student-dashboard");
      else if (role === "supervisor") navigate("/admin-dashboard");
      else if (role === "official") navigate("/official-dashboard");
      else alert("Unknown role. Cannot redirect.");
    } catch (err) {
      alert(err.response?.data?.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Image Section */}
      <div className="login-image">
        <img src={capImage} alt="Graduation cap" />
      </div>

      {/* Right Form Section */}
      <div className="login-form">
        <img src={helsbLogo} alt="HELSB Logo" className="helsb-logo" />
        <h2>Welcome to the HELSB ePortal! 👋</h2>
        <p>Please log in to your account to access the system.</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
