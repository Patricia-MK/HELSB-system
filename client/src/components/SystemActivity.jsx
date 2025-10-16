// src/components/SystemActivity.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const SystemActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch system activities
  const fetchActivities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/activities");
      setActivities(res.data);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case "login": return "🔐";
      case "logout": return "🚪";
      case "create": return "➕";
      case "update": return "✏️";
      case "delete": return "🗑️";
      case "approve": return "✅";
      case "reject": return "❌";
      default: return "📝";
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          🕒 System Activity Log
        </h3>
        <button
          onClick={fetchActivities}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading activities...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No activities found.</p>
          <p className="text-sm text-gray-400 mt-2">System activities will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-lg mt-1">{getActivityIcon(activity.type)}</span>
                  <div>
                    <p className="font-medium text-gray-800">{activity.description}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      User: <span className="font-medium">{activity.userName}</span> • 
                      IP: <span className="font-mono">{activity.ipAddress}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  activity.type === 'login' ? 'bg-green-100 text-green-800' :
                  activity.type === 'logout' ? 'bg-gray-100 text-gray-800' :
                  activity.type === 'create' ? 'bg-blue-100 text-blue-800' :
                  activity.type === 'update' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {activity.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{activities.length}</div>
          <div className="text-sm text-blue-800">Total Activities</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {activities.filter(a => a.type === 'login').length}
          </div>
          <div className="text-sm text-green-800">User Logins</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {activities.filter(a => a.type === 'create' || a.type === 'update').length}
          </div>
          <div className="text-sm text-yellow-800">Data Changes</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {activities.filter(a => a.type === 'approve' || a.type === 'reject').length}
          </div>
          <div className="text-sm text-purple-800">Decisions Made</div>
        </div>
      </div>
    </div>
  );
};

export default SystemActivity;