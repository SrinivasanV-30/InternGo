import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, NavLink } from "react-router-dom";
import GLogout from "../../components/authentication/GLogout";
import logo from "../../assets/logo.png";
import {
  FaUser,
  FaTasks,
  FaMapMarkedAlt,
  FaHandsHelping,
  FaComments,
  FaCalendarAlt,
  FaPlusSquare,
  FaFileAlt,
  FaTicketAlt,
  FaBullhorn,
} from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const DashboardLayout = () => {
  const { name, role, permissions } = useSelector((state) => state.auth);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tabs = [
    { name: "Profile", icon: FaUser, permission: "profile.update", path: "/dashboard/profile" },
    { name: "Daily Update", icon: FaTasks, permission: "tasks.update", path: "/dashboard/daily-update" },
    { name: "RoadMap", icon: FaMapMarkedAlt, permission: "roadmaps.view", path: "/dashboard/roadmap" },
    { name: "Help", icon: FaHandsHelping, permission: "announcements.view", path: "/dashboard/help" },
    { name: "FeedBack", icon: FaComments, permission: "feedback.view", path: "/dashboard/feedback" },
    { name: "Interactions", icon: FaCalendarAlt, permission: "interactions.view", path: "/dashboard/interactions" },
    { name: "Create Plan", icon: FaPlusSquare, permission: "plans.create", path: "/dashboard/create-plan" },
    { name: "Interaction Schedule", icon: FaCalendarAlt, permission: "interactions.schedule", path: "/dashboard/interaction-schedule" },
    { name: "Records", icon: FaFileAlt, permission: "users.view", path: "/dashboard/records" },
    { name: "Pending Tickets", icon: FaTicketAlt, permission: "tickets.view", path: "/dashboard/pending-tickets" },
    { name: "Create Announcement", icon: FaBullhorn, permission: "announcements.create", path: "/dashboard/create-announcement" },
  ];

  const filteredTabs = tabs.filter((tab) => permissions.includes(tab.permission));

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <img
            src={logo}
            alt="InternGO"
            className={`transition-all duration-300 ${
              isSidebarOpen ? "w-40" : "w-10"
            }`}
          />
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none"
          >
            {isSidebarOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="mt-4">
          <ul>
            {filteredTabs.map((tab, index) => (
              <li key={index} className="flex items-center">
                <NavLink
                  to={tab.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg ${
                      isActive ? "bg-gray-200 font-semibold" : ""
                    }`
                  }
                >
                  <tab.icon className="w-6 h-6" />
                  {isSidebarOpen && <span className="ml-4">{tab.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <h1 className="text-2xl font-semibold text-gray-700">{role || ""} Dashboard</h1>
          <div className="relative flex items-center space-x-4">
            {/* Notification Icon */}
            <button
              onClick={() => alert("Notification clicked")}
              className="relative w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center hover:bg-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
                />
              </svg>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3 h-3 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSidebarOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-gray-300 text-white px-3 py-2 rounded-full cursor-pointer hover:bg-gray-400"
              >
                <span>{name}</span>
                <div className="flex items-center justify-center w-8 h-8 bg-white text-gray-700 rounded-full">
                  {name?.[0]?.toUpperCase()}
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50">
                  <ul className="py-2">
                    <li
                      onClick={() => (window.location.href = "/dashboard/edit-profile")}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Edit Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <GLogout />
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;



// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { Outlet, NavLink } from 'react-router-dom';
// import GLogout from '../../components/authentication/GLogout';
// import logo from '../../assets/logo.png';

// const DashboardLayout = () => {  
//   const { name, role, permissions } = useSelector((state) => state.auth);

//   const tabs = [
//     { name: 'Profile', permission: 'profile.update', path: '/dashboard/profile' },
//     { name: 'Daily Update', permission: 'tasks.update', path: '/dashboard/daily-update' },
//     { name: 'RoadMap', permission: 'roadmaps.view', path: '/dashboard/roadmap' },
//     { name: 'Help', permission: 'announcements.view', path: '/dashboard/help' },
//     // { name: 'Create RoadMap', permission: 'roadmaps.create', path: '/dashboard/create-roadmap' },
//     { name: 'FeedBack', permission: 'feedback.view', path: '/dashboard/feedback' },
//     { name: 'Interactions', permission: 'interactions.view', path: '/dashboard/interactions' },
//     { name: 'Create Plan', permission: 'plans.create', path: '/dashboard/create-plan' },
//     { name: 'Interaction Schedule', permission: 'interactions.schedule', path: '/dashboard/interaction-schedule' },
//     { name: 'Records', permission: 'users.view', path: '/dashboard/records' },
//     { name: 'Pending Tickets', permission: 'tickets.view', path: '/dashboard/pending-tickets' },
//     { name: 'Create Announcement', permission: 'announcements.create', path: '/dashboard/create-announcement' },
//   ];

//   const filteredTabs = tabs.filter((tab) => permissions.includes(tab.permission));

//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-1/6 bg-white shadow-lg">
//         <div className="flex flex-col items-center">
//           <img src={logo} alt="InternGO" className="mt-0 w-50 h-40"/>
//         </div>
//         <nav className="mt-2">
//           <ul>
//             {filteredTabs.map((tab, index) => (
//               <li key={index}>
//                 <NavLink
//                   to={tab.path}
//                   className={({ isActive }) =>
//                     `block px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg ${
//                       isActive ? 'bg-gray-200 font-semibold' : ''
//                     }`
//                   }
//                 >
//                   {tab.name}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Top Navbar */}
//         <header className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
//           {/* User Role */}
//           <h1 className="text-2xl font-semibold text-gray-700">{role || ''} Dashboard</h1>
          
//           {/* Profile with Dropdown */}
//           <div className="relative flex items-center space-x-4">
//               {/* Notification Icon */}
//               <button
//                 onClick={() => alert('Notification clicked')} // Handle notification logic here
//                 className="relative w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center hover:bg-gray-400"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   className="w-16 h-16"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
//                   />
//                 </svg>
//                 <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3 h-3 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
//                   3
//                 </span>
//               </button>

//               <div className="relative">
//                 <button
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                   className="flex items-center space-x-2 bg-gray-300 text-white px-3 py-2 rounded-full cursor-pointer hover:bg-gray-400"
//                 >
//                   <span>{name}</span>
//                   <div className="flex items-center justify-center w-8 h-8 bg-white text-gray-700 rounded-full">
//                     {name?.[0]?.toUpperCase()}
//                   </div>
//                 </button>

//                 {dropdownOpen && (
//                   <div
//                     className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50"
//                     style={{ top: "calc(100% + 8px)" }} 
//                   >
//                     <ul className="py-2">
//                       <li
//                         onClick={() => (window.location.href = '/dashboard/edit-profile')} 
//                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                       >
//                         Edit Profile
//                       </li>
//                       <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
//                         <GLogout />
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//         </header>

//         <main className="flex-1 p-6 overflow-y-auto">
//           <Outlet /> 
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
