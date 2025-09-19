import React from "react";

const ApplicationRow = ({ app, onViewClick }) => {
  return (
    <>
      <td className="px-4 py-2 border">{app.name}</td>
      <td className="px-4 py-2 border">{app.nrc}</td>
      <td className="px-4 py-2 border">{app.program}</td>
      <td className="px-4 py-2 border">{app.loanNumber}</td>
      <td className="px-4 py-2 border">
        <span
          className={`px-2 py-1 rounded-full text-white text-sm ${
            app.status === "Approved"
              ? "bg-green-500"
              : app.status === "Pending"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        >
          {app.status}
        </span>
      </td>
      <td className="px-4 py-2 border">
        <button
          onClick={onViewClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
        >
          View
        </button>
      </td>
    </>
  );
};

export default ApplicationRow;
