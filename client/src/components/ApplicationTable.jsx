// src/components/ApplicationTable.jsx
import React from "react";

const applications = [
  { name: "Alice", nrc: "12345678", program: "Computer Science", loanNumber: "LN001", status: "Pending" },
  { name: "Bob", nrc: "87654321", program: "Business Admin", loanNumber: "LN002", status: "Approved" },
];

const ApplicationTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">NRC</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Program</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Loan Number</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((app, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-gray-800">{app.name}</td>
              <td className="px-6 py-4 text-gray-800">{app.nrc}</td>
              <td className="px-6 py-4 text-gray-800">{app.program}</td>
              <td className="px-6 py-4 text-gray-800">{app.loanNumber}</td>
              <td className={`px-6 py-4 font-semibold ${app.status === "Approved" ? "text-green-600" : "text-yellow-600"}`}>
                {app.status}
              </td>
              <td className="px-6 py-4">
                <button className="text-blue-500 hover:underline">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
