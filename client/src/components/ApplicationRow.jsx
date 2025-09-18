import React from "react";

const ApplicationRow = ({ app, onViewClick }) => {
  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <td className="p-2 border">{app.name}</td>
      <td className="p-2 border">{app.nrc}</td>
      <td className="p-2 border">{app.program}</td>
      <td className="p-2 border">{app.gpa}</td>
      <td className="p-2 border">{app.status}</td>
      <td className="p-2 border">
        <button
          onClick={onViewClick}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          View
        </button>
      </td>
    </tr>
  );
};

export default ApplicationRow;
