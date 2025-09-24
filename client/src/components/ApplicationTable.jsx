import React from "react";

const ApplicationTable = ({ applications, onViewClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Student Name</th>
            <th className="px-4 py-2 border">Student ID</th>
            <th className="px-4 py-2 border">Loan Number</th>
            <th className="px-4 py-2 border">Loan Type</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No applications found
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{app.studentName || app.studentId}</td>
                <td className="px-4 py-2 border">{app.studentID || app.studentId}</td>
                <td className="px-4 py-2 border">{app.loanNumber || "-"}</td>
                <td className="px-4 py-2 border">{app.loanType}</td>
                <td className="px-4 py-2 border">{app.status}</td>
                <td className="px-4 py-2 border">
                  {onViewClick && (
                    <button
                      onClick={() => onViewClick(app)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
