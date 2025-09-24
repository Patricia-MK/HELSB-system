import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ApplicationTable from "../components/ApplicationTable";
import ApplicationModal from "../components/ApplicationModal";
import axios from "axios";

const OfficialDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch applications from official route
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/official/applications")
      .then((res) => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleOpenModal = (app) => {
    setSelectedApp(app);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedApp(null);
    setModalOpen(false);
  };

  const updateStatus = (id, status) => {
    axios
      .patch(`http://localhost:5000/api/official/applications/${id}/status`, { status })
      .then(() => {
        setApplications((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status } : app))
        );
        handleCloseModal();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update application. Try again!");
      });
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar role="official" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">All Applications</h2>
          {loading ? (
            <p>Loading applications...</p>
          ) : (
            <ApplicationTable
              applications={applications}
              onViewClick={handleOpenModal}
            />
          )}
        </main>
      </div>

      {selectedApp && (
        <ApplicationModal
          app={selectedApp}
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onApprove={(id) => updateStatus(id, "Approved")}
          onReject={(id) => updateStatus(id, "Rejected")}
          onRequestInfo={(id) => updateStatus(id, "Info Requested")}
        />
      )}
    </div>
  );
};

export default OfficialDashboard;
