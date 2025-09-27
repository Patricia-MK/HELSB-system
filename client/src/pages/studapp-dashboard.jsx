import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import helsbLogo from "../assets/images/helsblogo.jpg";
import axios from "axios";
import StudappSidebar from "../components/studapp-sidebar";
import StudappRegisterWizard from "../components/studapp-register-wizard";
import StudappApplicationForm from "../components/studapp-application-form";
import StudappApplyLoan from "../components/studapp-apply-loan";
import "./studapp-dashboard.css";

function StudappDashboard() {
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const studentId = user?._id;

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchApps = async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.get("/api/applications", { params: { studentId }, headers });
      const items = Array.isArray(data) ? data : (data?.applications || []);
      const filtered = items.filter((a) => (a.student?._id || a.student) === studentId);
      setList(filtered);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("home");

  // Auto-resize behavior: close on small screens by default
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setSidebarOpen(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // React to hash changes via react-router location
  useEffect(() => {
    setActiveSection(location.hash ? location.hash.slice(1) : "home");
  }, [location.hash]);

  const header = useMemo(() => (
    <div className="studapp-topbar">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            className="studapp-icon-btn"
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <span style={{ fontSize: 20 }}>≡</span>
          </button>
          <div className="flex items-center gap-2">
            <img src={helsbLogo} alt="HELSB" style={{ width: 34, height: 34, borderRadius: 6, objectFit: "cover" }} />
            <span className="font-semibold">HELSB Student Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="studapp-screening-btn">Screening</button>
          <button className="studapp-icon-btn" aria-label="Notifications">🔔</button>
          <button className="studapp-icon-btn" aria-label="Profile">👤</button>
        </div>
      </div>
    </div>
  ), []);

  return (
    <div className="flex studapp-root">
      {/* Backdrop for small screens when sidebar is open */}
      {!sidebarOpen ? null : <div className="studapp-backdrop lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className={("studapp-sidebar-wrap " + (sidebarOpen ? "open" : "closed"))}>
        <div className="studapp-sidebar">
          <StudappSidebar isOpen={sidebarOpen} />
        </div>
      </div>
      <main className={("flex-1 studapp-content " + (sidebarOpen ? "with-sidebar-open" : "with-sidebar-closed"))}>
        {header}
        <div className="p-6 space-y-10">
          {!studentId && (
            <div className="text-sm text-gray-700">Please log in as a student to use the portal.</div>
          )}

          {activeSection === "home" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="studapp-card p-5">
                  <h2>Eligibility Checklist</h2>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><span>✓</span><span>Create Account</span></li>
                    <li className="flex items-center gap-2"><span>✓</span><span>Complete Registration</span></li>
                    <li className="flex items-center gap-2"><span>✓</span><span>Upload Required Documents</span></li>
                    <li className="flex items-center gap-2"><span>✓</span><span>Submit Loan Application</span></li>
                  </ul>
                  <div className="mt-4">
                    <button className="studapp-btn-primary">Register Now</button>
                  </div>
                </div>
                <div className="studapp-card p-5">
                  <h2>Status</h2>
                  <div className="text-sm space-y-2">
                    <div>Application: {list.length > 0 ? "Submitted" : "No Application"}</div>
                    <div>Registration: {user ? "Registered" : "Not Registered"}</div>
                  </div>
                </div>
                <div className="studapp-card p-5">
                  <h2>My Documents</h2>
                  <div className="text-sm opacity-90 mb-3">Manage and edit uploaded documents.</div>
                  <button className="studapp-btn-primary">View</button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="studapp-card p-5">
                  <h2>Application History</h2>
                  <div className="text-sm opacity-90 mb-3">View universities you have applied to and their status.</div>
                  {loading && <div>Loading...</div>}
                  {error && <div className="text-red-300 text-sm">{error}</div>}
                  {!loading && list.length === 0 && (
                    <div className="text-sm opacity-90">No applications yet.</div>
                  )}
                  {list.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr>
                            <th className="text-left px-3 py-2">Program</th>
                            <th className="text-left px-3 py-2">Loan Number</th>
                            <th className="text-left px-3 py-2">Status</th>
                            <th className="text-left px-3 py-2">Submitted</th>
                          </tr>
                        </thead>
                        <tbody>
                          {list.map((app) => (
                            <tr key={app._id} className="border-t border-white/20">
                              <td className="px-3 py-2">{app.program}</td>
                              <td className="px-3 py-2">{app.loanNumber || "—"}</td>
                              <td className="px-3 py-2">{app.status}</td>
                              <td className="px-3 py-2">{new Date(app.submittedAt || app.createdAt).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="mt-3">
                    <button className="studapp-btn-primary">View</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "register" && (
            <StudappRegisterWizard />
          )}

          {(activeSection === "apply-loan" || activeSection === "apply") && (
            <StudappApplyLoan studentId={studentId} />
          )}

          {activeSection === "apply-scholarship" && (
            <div className="studapp-card p-5">
              <h2>Apply for Scholarship</h2>
              <div className="text-sm opacity-90">Scholarship application form coming soon.</div>
            </div>
          )}

          {activeSection === "screening" && (
            <div className="studapp-card p-5">
              <h2>Screening</h2>
              <div className="text-sm opacity-90">Your screening status and requirements will appear here.</div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="studapp-card p-5">
              <h2>Notifications</h2>
              <div className="text-sm opacity-90">You have no new notifications.</div>
            </div>
          )}

          {activeSection === "profile" && (
            <div className="studapp-card p-5">
              <h2>Profile</h2>
              <div className="text-sm opacity-90">Update your personal information here.</div>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="studapp-card p-5">
              <h2>Settings</h2>
              <div className="text-sm opacity-90">Configure your preferences.</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudappDashboard;


