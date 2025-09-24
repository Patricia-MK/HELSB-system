import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import UserTable from "../components/UserTable";
import ApplicationTable from "../components/ApplicationTable";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);

  // Fetch all users
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/users")
      .then((res) => {
        setUsers(res.data);
        setLoadingUsers(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingUsers(false);
      });
  }, []);

  // Fetch all applications
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/applications")
      .then((res) => {
        setApplications(res.data);
        setLoadingApps(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingApps(false);
      });
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar role="admin" />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Users</h2>
          {loadingUsers ? <p>Loading users...</p> : <UserTable users={users} />}

          <h2 className="text-2xl font-bold mb-4 mt-6">Applications</h2>
          {loadingApps ? (
            <p>Loading applications...</p>
          ) : (
            <ApplicationTable applications={applications} />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
