import React from "react";
import ApplicationRow from "./ApplicationRow";

const ApplicationTable = ({ applications, onViewClick }) => {
  return (
    <table className="min-w-full border">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Name</th>
          <th className="p-2 border">NRC</th>
          <th className="p-2 border">Program</th>
          <th className="p-2 border">GPA</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Action</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app) => (
          <ApplicationRow
            key={app._id}
            app={app}
            onViewClick={() => onViewClick(app)}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ApplicationTable;
