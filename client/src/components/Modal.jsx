import React from "react";
import axios from "axios";

const Modal = ({ application, onClose, onStatusChange }) => {
  const handleDecision = async (status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/applications/${application._id}/decision`,
        { status }
      );
      onStatusChange(application._id, status); // update table state
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Application Details</h2>
        <p><strong>Name:</strong> {application.name}</p>
        <p><strong>NRC:</strong> {application.nrc}</p>
        <p><strong>Program:</strong> {application.program}</p>
        <p><strong>GPA:</strong> {application.gpa}</p>
        <p><strong>Status:</strong> {application.status}</p>
        <p className="mt-2"><strong>Documents:</strong></p>
        <ul className="list-disc list-inside">
          {application.documents.map((doc, idx) => (
            <li key={idx}>
              <a
                href={`/${doc}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {doc}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => handleDecision("Approved")}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Approve
          </button>
          <button
            onClick={() => handleDecision("Rejected")}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Reject
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
