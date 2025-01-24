import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Profile = () => {
  const { userId, token } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`https://interngo.onrender.com/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    alert("hello")
    if (userId && token) {
      fetchProfileData();
    }
  }, [userId, token]);

  const renderTabContent = () => {
    if (!profileData) return <p>Loading...</p>;

    const renderField = (value) => value || '---';

    switch (activeTab) {
      case 'personalInfo':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Basic Information</h2>
            <p><strong>Date of Birth:</strong> {new Date(profileData.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Gender:</strong> {profileData.gender}</p>
            <p><strong>Blood Group:</strong> {profileData.bloodGroup}</p>
            <p><strong>Phone:</strong> {profileData.phone_no}</p>
            <p><strong>Current Address:</strong> {profileData.currentAddress}</p>
            <p><strong>Permanent Address:</strong> {profileData.permanentAddress}</p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Professional Information</h2>
            <p><strong>Employee ID:</strong> {profileData.employeeId}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Batch:</strong> {profileData.batch}</p>
            <p><strong>Year:</strong> {profileData.year}</p>
            <p><strong>Phase:</strong> {profileData.phase}</p>
          </div>
        );
      case 'education':
        return (
          <div>
            <h3 className="text-sm font-semibold mb-1">Education Details</h3>
            <p className="text-lg"><strong>College:</strong> {renderField(profileData.education?.college)}</p>
            <p className="text-lg"><strong>Degree:</strong> {renderField(profileData.education?.degree)}</p>
            <p className="text-lg"><strong>Batch:</strong> {renderField(profileData.education?.batch)}</p>
          </div>
        );
      case 'bankDetails':
        return (
          <div>
            <h2 className="text-sm font-semibold mb-1">Bank Details</h2>
            <p className="text-lg"><strong>Bank Name:</strong> {renderField(profileData.bankDetails?.bankName)}</p>
            <p className="text-lg"><strong>Branch:</strong> {renderField(profileData.bankDetails?.branch)}</p>
            <p className="text-lg"><strong>IFSC:</strong> {renderField(profileData.bankDetails?.IFSC)}</p>
            <p className="text-lg"><strong>Account No:</strong> {renderField(profileData.bankDetails?.accountNumber)}</p>
          </div>
        );
      case 'skill':
        return (
          <div>
            <h2 className="text-sm font-semibold mb-1">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profileData.skill?.length
                ? profileData.skill.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm"
                    >
                      {skill}
                    </span>
                  ))
                : '---'}
            </div>
          </div>
        );
      case 'assets':
        return (
          <div>
            <h3 className="text-sm font-semibold mb-1">Assets</h3>
            {profileData.assets?.length ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">Asset ID</th>
                    <th className="border border-gray-300 px-4 py-2">Asset Name</th>
                    <th className="border border-gray-300 px-4 py-2">Provided On</th>
                    <th className="border border-gray-300 px-4 py-2">Returned On</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.assets.map((asset) => (
                    <tr key={asset.id}>
                      <td className="border border-gray-300 px-4 py-2">{asset.id}</td>
                      <td className="border border-gray-300 px-4 py-2">{asset.assetName}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(asset.givenOn).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{asset.returnedOn || 'Not Returned'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              '---'
            )}
          </div>
        );
      default:
        return <p>Select a tab to view details.</p>;
    }
  };

  return (
    <div className="flex h-screen">
      {profileData && (
        <div className="w-1/5 bg-white shadow-lg p-4">
          <div className="flex flex-col items-center">
            <img
              src={profileData.profilePhoto || 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0='}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
            <h1 className="text-lg font-bold">{profileData.name}</h1>
            <p className="text-sm text-gray-500">{profileData.designation}</p>
            <div className="w-full bg-gray-200 rounded-full mt-4">
              <div
                className="bg-green-500 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full"
                style={{ width: `${profileData.profilePercentage}%` }}
              >
                {profileData.profilePercentage}%
              </div>
            </div>
            <div className="mt-4 w-full text-left">
              <h2 className="text-md font-semibold mb-2">Contact</h2>
              <div className="flex items-center gap-2 mb-1">
                <FaPhone className="text-gray-500" />
                <span>{profileData.phone_no || '---'}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <FaEnvelope className="text-gray-500" />
                <span>{profileData.email || '---'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-500" />
                <span>{profileData.permanentAddress || '---'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 bg-gray-50 p-6">
        <div className="flex space-x-4 mb-4">
          {['personalInfo', 'education', 'bankDetails', 'skill', 'assets'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {renderTabContent()}
      </div>

      {/* Modal for profile picture */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="bg-white rounded-lg p-4 relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <img
              src={profileData.profilePhoto || 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0='}
              alt="Profile"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;


// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

// const Profile = () => {
//   const { userId, token } = useSelector((state) => state.auth);
//   const [profileData, setProfileData] = useState(null);
//   const [activeTab, setActiveTab] = useState('personalInfo');
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const response = await axios.get(`https://interngo.onrender.com/api/users/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProfileData(response.data.data);
//       } catch (error) {
//         console.error('Error fetching profile data:', error);
//       }
//     };

//     if (userId && token) {
//       fetchProfileData();
//     }
//   }, [userId, token]);

//   const renderTabContent = () => {
//     if (!profileData) return <p>Loading...</p>;

//     const renderField = (value) => value || '---';

//     switch (activeTab) {
//       case 'personalInfo':
//         return (
//           <div>
//             <h2 className="text-2xl font-semibold mb-2">Basic Information</h2>
//             <p><strong>Date of Birth:</strong> {new Date(profileData.dateOfBirth).toLocaleDateString()}</p>
//             <p><strong>Gender:</strong> {profileData.gender}</p>
//             <p><strong>Blood Group:</strong> {profileData.bloodGroup}</p>
//             <p><strong>Phone:</strong> {profileData.phone_no}</p>
//             <p><strong>Current Address:</strong> {profileData.currentAddress}</p>
//             <p><strong>Permanent Address:</strong> {profileData.permanentAddress}</p>
//             <h2 className="text-xl font-semibold mt-4 mb-2">Professional Information</h2>
//             <p><strong>Employee ID:</strong> {profileData.employeeId}</p>
//             <p><strong>Email:</strong> {profileData.email}</p>
//             <p><strong>Batch:</strong> {profileData.batch}</p>
//             <p><strong>Year:</strong> {profileData.year}</p>
//             <p><strong>Phase:</strong> {profileData.phase}</p>
//           </div>
//         );
//       case 'education':
//         return (
//           <div>
//             <h3 className="text-sm font-semibold mb-1">Education Details</h3>
//             <p className="text-lg"><strong>College:</strong> {renderField(profileData.education?.college)}</p>
//             <p className="text-lg"><strong>Degree:</strong> {renderField(profileData.education?.degree)}</p>
//             <p className="text-lg"><strong>Batch:</strong> {renderField(profileData.education?.batch)}</p>
//           </div>
//         );
//       case 'bankDetails':
//         return (
//           <div>
//             <h2 className="text-sm font-semibold mb-1">Bank Details</h2>
//             <p className="text-lg"><strong>Bank Name:</strong> {renderField(profileData.bankDetails?.bankName)}</p>
//             <p className="text-lg"><strong>Branch:</strong> {renderField(profileData.bankDetails?.branch)}</p>
//             <p className="text-lg"><strong>IFSC:</strong> {renderField(profileData.bankDetails?.IFSC)}</p>
//             <p className="text-lg"><strong>Account No:</strong> {renderField(profileData.bankDetails?.accountNumber)}</p>
//           </div>
//         );
//       case 'skill':
//         return (
//           <div>
//             <h2 className="text-sm font-semibold mb-1">Skills</h2>
//             <div className="flex flex-wrap gap-2">
//               {profileData.skill?.length
//                 ? profileData.skill.map((skill, index) => (
//                     <span
//                       key={index}
//                       className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm"
//                     >
//                       {skill}
//                     </span>
//                   ))
//                 : '---'}
//             </div>
//           </div>
//         );
//       case 'assets':
//         return (
//           <div>
//             <h3 className="text-sm font-semibold mb-1">Assets</h3>
//             {profileData.assets?.length ? (
//               <table className="w-full border-collapse border border-gray-300">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="border border-gray-300 px-4 py-2">Asset ID</th>
//                     <th className="border border-gray-300 px-4 py-2">Asset Name</th>
//                     <th className="border border-gray-300 px-4 py-2">Provided On</th>
//                     <th className="border border-gray-300 px-4 py-2">Returned On</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {profileData.assets.map((asset) => (
//                     <tr key={asset.id}>
//                       <td className="border border-gray-300 px-4 py-2">{asset.id}</td>
//                       <td className="border border-gray-300 px-4 py-2">{asset.assetName}</td>
//                       <td className="border border-gray-300 px-4 py-2">
//                         {new Date(asset.givenOn).toLocaleDateString()}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2">{asset.returnedOn || 'Not Returned'}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               '---'
//             )}
//           </div>
//         );
//       default:
//         return <p>Select a tab to view details.</p>;
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {profileData && (
//         <div className="w-1/5 bg-white shadow-lg p-4">
//           <div className="flex flex-col items-center">
//             <img
//               src={profileData.profilePhoto || 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0='}
//               alt="Profile"
//               className="w-24 h-24 rounded-full object-cover mb-4"
//             />
//             <h1 className="text-lg font-bold">{profileData.name}</h1>
//             <p className="text-sm text-gray-500">{profileData.designation}</p>
//             <div className="w-full bg-gray-200 rounded-full mt-4">
//               <div
//                 className="bg-green-500 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full"
//                 style={{ width: `${profileData.profilePercentage}%` }}
//               >
//                 {profileData.profilePercentage}%
//               </div>
//             </div>
//             <div className="mt-4 w-full text-left">
//               <h2 className="text-md font-semibold mb-2">Contact</h2>
//               <div className="flex items-center gap-2 mb-1">
//                 <FaPhone className="text-gray-500" />
//                 <span>{profileData.phone_no || '---'}</span>
//               </div>
//               <div className="flex items-center gap-2 mb-1">
//                 <FaEnvelope className="text-gray-500" />
//                 <span>{profileData.email || '---'}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <FaMapMarkerAlt className="text-gray-500" />
//                 <span>{profileData.permanentAddress || '---'}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex-1 bg-gray-50 p-6">
//         <div className="flex space-x-4 mb-4">
//           {['personalInfo', 'education', 'bankDetails', 'skill', 'assets'].map((tab) => (
//             <button
//               key={tab}
//               className={`px-4 py-2 rounded-lg ${
//                 activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'
//               }`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div>
//         {renderTabContent()}
//       </div>
//     </div>
//   );
// };

// export default Profile;