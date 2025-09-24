import React, { useState, useRef, useEffect } from "react";
import {
  UserGroupIcon,
  CheckBadgeIcon,
  DocumentIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import AdminSidebar from "../components/AdminSidebar";
import UserTable from "../components/UserTable";
import ApplicationTable from "../components/ApplicationTable";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    { _id: 1, name: "John Doe", email: "john@example.com", role: "Student", active: true },
    { _id: 2, name: "Jane Smith", email: "jane@example.com", role: "Official", active: true },
  ]);

  const [applications] = useState([
    { _id: 1, name: "Alice", nrc: "12345678", program: "Computer Science", loanNumber: "LN001", status: "Pending" },
    { _id: 2, name: "Bob", nrc: "87654321", program: "Business Admin", loanNumber: "LN002", status: "Approved" },
  ]);

  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student" });

  // Section refs
  const dashboardRef = useRef(null);
  const applicationsRef = useRef(null);
  const usersRef = useRef(null);
  const reportsRef = useRef(null);

  const [activeSection, setActiveSection] = useState("dashboard");

  const scrollToSection = {
    dashboard: () => dashboardRef.current.scrollIntoView({ behavior: "smooth" }),
    applications: () => applicationsRef.current.scrollIntoView({ behavior: "smooth" }),
    users: () => usersRef.current.scrollIntoView({ behavior: "smooth" }),
    reports: () => reportsRef.current.scrollIntoView({ behavior: "smooth" }),
  };

  // Intersection observer for active section
  useEffect(() => {
    const sections = [
      { ref: dashboardRef, name: "dashboard" },
      { ref: applicationsRef, name: "applications" },
      { ref: usersRef, name: "users" },
      { ref: reportsRef, name: "reports" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = sections.find((s) => s.ref.current === entry.target);
            if (section) setActiveSection(section.name);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((s) => s.ref.current && observer.observe(s.ref.current));
    return () => sections.forEach((s) => s.ref.current && observer.unobserve(s.ref.current));
  }, []);

  // User handlers
  const handleAddUser = (e) => {
    e.preventDefault();
    const user = { ...newUser, _id: Date.now(), active: true };
    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "Student" });
  };

  const handleDeleteUser = (id) => {
    setUsers(users.map((u) => (u._id === id ? { ...u, active: false } : u)));
  };

  const handleEditUser = (user) => {
    const updated = users.map((u) =>
      u._id === user._id ? { ...u, role: user.role === "Student" ? "Official" : "Student" } : u
    );
    setUsers(updated);
  };

  // Chart data
  const userStats = [
    { name: "Students", value: users.filter(u => u.role === "Student").length },
    { name: "Officials", value: users.filter(u => u.role === "Official").length },
    { name: "Admins", value: users.filter(u => u.role === "Admin").length },
  ];

  const applicationStats = applications.map(a => ({ name: a.status, value: 1 }));

  const recentActivity = [
    { day: "Mon", activity: 2 },
    { day: "Tue", activity: 5 },
    { day: "Wed", activity: 3 },
    { day: "Thu", activity: 4 },
    { day: "Fri", activity: 6 },
    { day: "Sat", activity: 1 },
    { day: "Sun", activity: 0 },
  ];

  const COLORS = ["#28a745", "#f0ad4e", "#dc3545"];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar scrollToSection={scrollToSection} activeSection={activeSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
        {/* Header */}
        <header className="bg-white p-6 shadow sticky top-0 z-10">
          <h1 className="text-2xl font-bold">HELSB Admin Dashboard</h1>
        </header>

        {/* Main sections */}
        <main className="p-6 space-y-12">
          {/* Dashboard Summary */}
          <section ref={dashboardRef}>
            <h2 className="text-3xl font-bold mb-6 border-b-2 border-blue-300 pb-2">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow flex items-center">
                <UserGroupIcon className="w-8 h-8 mr-3" />
                <div>
                  <p className="text-sm font-medium">Total Students</p>
                  <p className="text-xl font-bold">{users.filter(u => u.role === "Student").length}</p>
                </div>
              </div>
              <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow flex items-center">
                <CheckBadgeIcon className="w-8 h-8 mr-3" />
                <div>
                  <p className="text-sm font-medium">Total Officials</p>
                  <p className="text-xl font-bold">{users.filter(u => u.role === "Official").length}</p>
                </div>
              </div>
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow flex items-center">
                <DocumentIcon className="w-8 h-8 mr-3" />
                <div>
                  <p className="text-sm font-medium">Total Applications</p>
                  <p className="text-xl font-bold">{applications.length}</p>
                </div>
              </div>
              <div className="bg-purple-100 text-purple-800 p-4 rounded-lg shadow flex items-center">
                <ChartBarIcon className="w-8 h-8 mr-3" />
                <div>
                  <p className="text-sm font-medium">Recent Activity</p>
                  <p className="text-xl font-bold">—</p>
                </div>
              </div>
            </div>
          </section>

          {/* Applications */}
          <section ref={applicationsRef}>
            <h3 className="text-2xl font-bold mb-4 border-b border-blue-300 pb-2">Applications</h3>
            <ApplicationTable applications={applications} onViewClick={() => {}} />
          </section>

          {/* Users */}
          <section ref={usersRef}>
            <h3 className="text-2xl font-bold mb-4 border-b border-blue-300 pb-2">Users Management</h3>
            <form onSubmit={handleAddUser} className="mb-4 flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="border px-2 py-1 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="border px-2 py-1 rounded"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="border px-2 py-1 rounded"
              >
                <option value="Student">Student</option>
                <option value="Official">Official</option>
                <option value="Admin">Admin</option>
              </select>
              <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded">Add User</button>
            </form>
            <UserTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
          </section>

          {/* Reports */}
          <section ref={reportsRef}>
            <h3 className="text-2xl font-bold mb-4 border-b border-blue-300 pb-2">Reports</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Pie Chart */}
              <div className="bg-white p-4 rounded-lg shadow h-64">
                <h4 className="text-lg font-semibold mb-2">Users by Role</h4>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={userStats}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={60}
                      fill="#8884d8"
                      label
                    >
                      {userStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Applications Bar Chart */}
              <div className="bg-white p-4 rounded-lg shadow h-64">
                <h4 className="text-lg font-semibold mb-2">Applications Status</h4>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={applicationStats}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Activity Line Chart */}
              <div className="bg-white p-4 rounded-lg shadow h-64">
                <h4 className="text-lg font-semibold mb-2">Recent Activity</h4>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={recentActivity}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="activity" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
