import React, { useState } from "react";

const ApplicationModal = ({ app, isOpen, onClose, onApprove, onReject, onRequestInfo }) => {
  const [comment, setComment] = useState("");

  if (!isOpen || !app) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded w-2/3 max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">{app.name}</h2>
        <p><strong>Program:</strong> {app.program}</p>
        <p><strong>GPA:</strong> {app.gpa}</p>
        <p><strong>Status:</strong> {app.status}</p>
        <p><strong>NRC:</strong> {app.nrc}</p>

        <div className="mt-4">
          <textarea
            className="w-full border p-2 mb-2"
            placeholder="Add comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => onApprove(app._id, comment)}
            >
              Approve
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => onReject(app._id, comment)}
            >
              Reject
            </button>
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded"
              onClick={() => onRequestInfo(app._id, comment)}
            >
              Request Info
            </button>
            <button
              className="bg-gray-300 px-3 py-1 rounded"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
