import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AdminSummary = ({ applications = [] }) => {
  // Count statuses
  const approved = applications.filter((a) => a.status === "Approved").length;
  const pending = applications.filter((a) => a.status === "Pending").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;

  const total = applications.length;

  // Pie chart data
  const pieData = [
    { name: "Approved", value: approved },
    { name: "Pending", value: pending },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#16a34a", "#f59e0b", "#dc2626"]; // green, yellow, red

  // Group applications by year
  const yearCounts = applications.reduce((acc, app) => {
    const year = app.year || "Unknown"; // use 'year' field
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  // Convert to array for BarChart
  const yearData = Object.entries(yearCounts).map(([year, count]) => ({
    year: `Year ${year}`,
    applications: count,
  }));

  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Admin Dashboard Summary
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h3 className="text-gray-500 text-sm">Total Applications</h3>
          <p className="text-3xl font-semibold text-blue-600">{total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h3 className="text-gray-500 text-sm">Approved</h3>
          <p className="text-3xl font-semibold text-green-600">{approved}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h3 className="text-gray-500 text-sm">Pending</h3>
          <p className="text-3xl font-semibold text-yellow-600">{pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h3 className="text-gray-500 text-sm">Rejected</h3>
          <p className="text-3xl font-semibold text-red-600">{rejected}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Application Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Applications by Year of Study
          </h3>
          {yearData.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">
              No year data available.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
