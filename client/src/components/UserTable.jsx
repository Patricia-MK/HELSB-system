// src/components/UserTable.jsx
import React from "react";

const users = [
  { name: "John Doe", email: "john@example.com", role: "Student" },
  { name: "Jane Smith", email: "jane@example.com", role: "Official" },
];

const UserTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-gray-800">{user.name}</td>
              <td className="px-6 py-4 text-gray-800">{user.email}</td>
              <td className="px-6 py-4 text-gray-800">{user.role}</td>
              <td className="px-6 py-4 space-x-2">
                <button className="text-blue-500 hover:underline">Edit</button>
                <button className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
