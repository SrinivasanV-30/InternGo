import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Resources = () => {
  const navigate = useNavigate();

  const users = [
    {
      id: '1',
      profilePhoto: null,
      name: 'John Doe',
      employeeId: 'E1234',
      phone_no: '1234567890',
      status: 'Active',
      designation: 'Software Engineer',
      batch: '2023',
      phase: '2',
    },
    {
      id: '2',
      profilePhoto: null,
      name: 'Jane Smith',
      employeeId: 'E1235',
      phone_no: '9876543210',
      status: 'Inactive',
      designation: 'Data Analyst',
      batch: '2024',
      phase: '1',
    },
    {
      id: '3',
      profilePhoto: null,
      name: 'Michael Johnson',
      employeeId: 'E1236',
      phone_no: '1231231234',
      status: 'Active',
      designation: 'Project Manager',
      batch: '2022',
      phase: '3',
    },
    {
      id: '4',
      profilePhoto: null,
      name: 'Emily Davis',
      employeeId: 'E1237',
      phone_no: '7897897890',
      status: 'Inactive',
      designation: 'Intern',
      batch: '2025',
      phase: '1',
    },
  ];

  // States for filters
  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [designationFilter, setDesignationFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');

  const filteredUsers = users.filter((user) => {
    return (
      (!nameFilter || user.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (!statusFilter || user.status === statusFilter) &&
      (!designationFilter || user.designation === designationFilter) &&
      (!batchFilter || user.batch === batchFilter) &&
      (!phaseFilter || user.phase === phaseFilter)
    );
  });

  return (
    <div className="p-6">
      {/* Filters Section */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        {/* Filter by Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Name</label>
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter name"
          />
        </div>

        {/* Filter by Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Designation</label>
          <select
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Intern">Intern</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Batch</label>
          <select
            value={batchFilter}
            onChange={(e) => {
              setBatchFilter(e.target.value);
              setPhaseFilter(''); 
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        {batchFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Filter by Phase</label>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        )}
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="relative flex bg-white shadow-lg p-4 rounded-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate(`/dashboard/resources/${user.id}`)}
          >
            <div
              className={`absolute top-2 right-2 px-2 py-1 text-sm rounded ${
                user.status === 'Active' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
              }`}
            >
              {user.status}
            </div>

            <div className="flex flex-col items-left">
              <img
                src={
                  user.profilePhoto ||
                  'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0='
                }
                alt="profile"
                className="w-40 h-40 rounded-full object-cover mr-4"
              />
              <div className="text-center">
                <p className="text-xs text-gray-500">Employee ID:</p>
                <p className="text-sm font-semibold">{user.employeeId}</p>
              </div>
            </div>

            <div className="h-full flex justify-center flex-col items-center">
              <div className="text-lg w-full font-bold">{user.name}</div>
              <div className="text-sm w-full text-gray-500">{user.phone_no}</div>
              <div className="text-sm w-full text-gray-700">
                Batch {user.batch} - Phase {user.phase}
              </div>
              <div className="mt-2 self-end w-full text-blue-600 font-semibold">{user.designation}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;