import React, { useState } from 'react';
import axios from '../../api/axios';

const EditProfileModal = ({ profileData, setIsEditProfileModalOpen, userId, token }) => {
  const [formData, setFormData] = useState({
    employeeId: profileData.employeeId,
    email: profileData.email,
    batch: profileData.batch,
    year: profileData.year,
    phase: profileData.phase,
    dateOfJoining: profileData.dateOfJoining,
    status: profileData.status,
    designation: profileData.designation,
    assets: profileData.assets || [],
  });

  const [newAsset, setNewAsset] = useState({ assetName: '', assetType: '', givenOn: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAssetChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAssets = [...formData.assets];
    updatedAssets[index][name] = value;
    setFormData({
      ...formData,
      assets: updatedAssets,
    });
  };

  const handleAddAsset = async () => {
    if (newAsset.assetName && newAsset.assetType && newAsset.givenOn) {
      try {
        await axios.post('http://localhost:8000/api/users/update/assets', {
          userId,
          ...newAsset,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Asset added successfully');
      } catch (error) {
        console.error('Error adding asset:', error);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.patch(`http://localhost:8000/api/users/update/${userId}`, {
        ...formData,
        skills: formData.skills.split(','),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated successfully');
      setIsEditProfileModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg p-4 relative w-1/2 h-3/4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => setIsEditProfileModalOpen(false)}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        {/* Input Fields */}
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Batch</label>
          <select
            name="batch"
            value={formData.batch}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Batch</option>
            <option value="Batch 1">Batch 1</option>
            <option value="Batch 2">Batch 2</option>
            <option value="Batch 3">Batch 3</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Year</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Year</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Designation</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Designation</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="testing">Testing</option>
            <option value="devops">DevOps</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="NOT_ACTIVE">NOT ACTIVE</option>
            <option value="EXAMINATION">EXAMINATION</option>
            <option value="SHADOWING">SHADOWING</option>
            <option value="DEPLOYED">DEPLOYED</option>
          </select>
        </div>

        {/* <div className="mb-4">
          <label className="block mb-2">Skills (comma-separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter skills"
          />
        </div> */}

        {/* Assets Section */}
        <div className="mb-4">
          <label className="block mb-2">Add New Asset</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              name="assetName"
              value={newAsset.assetName}
              onChange={(e) => setNewAsset({ ...newAsset, assetName: e.target.value })}
              className="w-1/3 p-2 border border-gray-300 rounded-lg"
              placeholder="Asset Name"
            />
            <input
              type="text"
              name="assetType"
              value={newAsset.assetType}
              onChange={(e) => setNewAsset({ ...newAsset, assetType: e.target.value })}
              className="w-1/3 p-2 border border-gray-300 rounded-lg"
              placeholder="Asset Type"
            />
            <input
              type="date"
              name="givenOn"
              value={newAsset.givenOn}
              onChange={(e) => setNewAsset({ ...newAsset, givenOn: e.target.value })}
              className="w-1/3 p-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAddAsset}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsEditProfileModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;

// import React, { useState } from 'react';
// import axios from '../../api/axios';

// const EditProfileModal = ({ profileData, setIsModalOpen, userId, token }) => {
//   const [formData, setFormData] = useState({
//     employeeId : profileData.employeeId,
//     email: profileData.email,
//     batch: profileData.batch,
//     year: profileData.year,
//     phase: profileData.phase,
//     dateOfJoining : profileData.dateOfJoining,
//     status: profileData.status,
//     assets: profileData.assets,
//     skills: profileData.skills,
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleAssetChange = (index, e) => {
//     const { name, value } = e.target;
//     const newAssets = [...formData.assets];
//     newAssets[index][name] = value;
//     setFormData({
//       ...formData,
//       assets: newAssets,
//     });
//   };

//   const handleSaveChanges = async () => {
//     // try {
//     //   await axios.put(`/api/users/${userId}`, formData, {
//     //     headers: {
//     //       Authorization: `Bearer ${token}`,
//     //     },
//     //   });
//     //   setIsModalOpen(false);
//     //   // You can also trigger a refetch of the profile data here
//     // } catch (error) {
//     //   console.error('Error updating profile:', error);
//     // }
//     setIsModalOpen(false);
//     console.log(formData);
//     alert("submitted successfully");
    
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-4 relative w-1/2" onClick={(e) => e.stopPropagation()}>
//         <button
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//           onClick={() => setIsModalOpen(false)}
//         >
//           ✕
//         </button>

//         <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

//         {/* Input Fields for Professional Info */}
//         <div className="mb-4">
//           <label className="block mb-2">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block mb-2">Batch</label>
//           <input
//             type="text"
//             name="batch"
//             value={formData.batch}
//             onChange={handleInputChange}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block mb-2">Year</label>
//           <input
//             type="number"
//             name="year"
//             value={formData.year}
//             onChange={handleInputChange}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block mb-2">phase</label>
//           <input
//             type="text"
//             name="phase"
//             value={formData.phase}
//             onChange={handleInputChange}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block mb-2">status</label>
//           <input
//             type="text"
//             name="status"
//             value={formData.status}
//             onChange={handleInputChange}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//           />
//         </div>

//         {/* Input Fields for Assets */}
//         <div className="mb-4">
//           <label className="block mb-2">Assets</label>
//           {formData.assets.map((asset, index) => (
//             <div key={index} className="flex space-x-4">
//               <input
//                 type="text"
//                 name="assetName"
//                 value={asset.assetName}
//                 onChange={(e) => handleAssetChange(index, e)}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//                 placeholder="Asset Name"
//               />
//               <input
//                 type="text"
//                 name="assetType"
//                 value={asset.assetType}
//                 onChange={(e) => handleAssetChange(index, e)}
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//                 placeholder="Asset Type"
//               />
//             </div>
//           ))}
//         </div>

//         <div className="mb-4">
//           <label className="block mb-2">Skills</label>
//           <input
//             type="text"
//             name="skills"
//             value={formData.skills}
//             onChange={handleInputChange}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             placeholder="Enter skills"
//           />
//         </div>

//         <div className="flex justify-center space-x-4">
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//             onClick={handleSaveChanges}
//           >
//             Save Changes
//           </button>
//           <button
//             className="bg-gray-500 text-white px-4 py-2 rounded-lg"
//             onClick={() => setIsModalOpen(false)}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProfileModal;
