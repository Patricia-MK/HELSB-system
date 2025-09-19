import React from "react";
import ApplicationRow from "./ApplicationRow";

const ApplicationTable = ({ applications, onViewClick }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">NRC</th>
            <th className="px-4 py-2 text-left">Program</th>
            <th className="px-4 py-2 text-left">Loan Number</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, idx) => (
            <tr
              key={app._id}
              className={`${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-blue-100 transition`}
            >
              <ApplicationRow app={app} onViewClick={() => onViewClick(app)} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
