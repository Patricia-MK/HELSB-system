import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <ul>
        <li className="py-2 px-1 hover:bg-gray-200 cursor-pointer">All Applications</li>
        <li className="py-2 px-1 hover:bg-gray-200 cursor-pointer">Summary Stats</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
