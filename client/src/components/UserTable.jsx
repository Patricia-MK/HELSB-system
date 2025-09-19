import React from "react";

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr
              key={user._id}
              className={`${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-blue-100 transition`}
            >
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-white text-sm ${
                    user.role === "Admin"
                      ? "bg-purple-600"
                      : user.role === "Official"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(user._id)}
                  className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
