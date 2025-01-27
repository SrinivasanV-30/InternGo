import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const FloatingInput = ({ id, label, name, type = "text", value, onChange, disabled = false }) => (
  <div className="relative">
    <input
      type={type}
      id={id}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-black dark:border-gray-300 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
        disabled ? "bg-gray-200 cursor-not-allowed" : ""
      }`}
      placeholder=" "
    />
    <label
      htmlFor={id}
      className="absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-4 ml-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
    >
      {label}
    </label>
  </div>
);

const EditProfile = () => {
  const { userId, token, name } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    personalEmail: "",
    phone_no: "",
    gender: "",
    bloodGroup: "",
    dateOfBirth: "",
    currentAddress: "",
    permanentAddress: "",
    education: {
      college: "",
      degree: "",
      batch: "",
    },
    bankDetails: {
      bankName: "",
      branch: "",
      IFSC: "",
      accountNumber: "",
    },
  });

  const [profilePhoto, setProfilePhoto] = useState(null);

  // Fetch user data on component load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data.data;

        // Populate form data if fields exist
        setFormData((prev) => ({
          ...prev,
          personalEmail: userData.personalEmail || "",
          phone_no: userData.phone_no || "",
          gender: userData.gender || "",
          bloodGroup: userData.bloodGroup || "",
          dateOfBirth: userData.dateOfBirth?.split("T")[0] || "",
          currentAddress: userData.currentAddress || "",
          permanentAddress: userData.permanentAddress || "",
          education: {
            college: userData.education?.college || "",
            degree: userData.education?.degree || "",
            batch: userData.education?.batch || "",
          },
          bankDetails: {
            bankName: userData.bankDetails?.bankName || "",
            branch: userData.bankDetails?.branch || "",
            IFSC: userData.bankDetails?.IFSC || "",
            accountNumber: userData.bankDetails?.accountNumber || "",
          },
        }));

        if (userData.profilePhoto) {
          setProfilePhoto(userData.profilePhoto);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, token]);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("education") || name.includes("bankDetails")) {
      const [parentKey, childKey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {};
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "object") {
        Object.keys(formData[key]).forEach((subKey) => {
          if (formData[key][subKey]) {
            updatedData[key] = { ...updatedData[key], [subKey]: formData[key][subKey] };
          }
        });
      } else if (formData[key]) {
        updatedData[key] = formData[key];
      }
    });

    if (profilePhoto) {
      updatedData.profilePhoto = profilePhoto;
    }

    try {
      const response = await axios.patch(`/api/users/update/${userId
      }`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(updatedData);
      console.log("Profile updated successfully:", response.data);
      alert("profile updated successfully");
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{name} Profile</h1>
          <div className="relative">
            <label htmlFor="profilePhoto" className="relative cursor-pointer group">
              <input
                type="file"
                id="profilePhoto"
                name="profilePhoto"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="hidden"
              />
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300 shadow-md group-hover:shadow-lg">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Upload</span>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-bold mb-2">Personal Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput
            id="personalEmail"
            label="Personal Email"
            name="personalEmail"
            value={formData.personalEmail}
            onChange={handleChange}
          />
          <FloatingInput
            id="phone_no"
            label="Phone Number"
            name="phone_no"
            value={formData.phone_no}
            onChange={handleChange}
          />
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="bloodGroup">Blood Group</label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <FloatingInput
            id="dateOfBirth"
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <FloatingInput
            id="currentAddress"
            label="Current Address"
            name="currentAddress"
            value={formData.currentAddress}
            onChange={handleChange}
          />
          <FloatingInput
            id="permanentAddress"
            label="Permanent Address"
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-bold mb-2">Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput
            id="college"
            label="College"
            name="education.college"
            value={formData.education.college}
            onChange={handleChange}
          />
          <FloatingInput
            id="degree"
            label="Degree"
            name="education.degree"
            value={formData.education.degree}
            onChange={handleChange}
          />
          <FloatingInput
            id="batch"
            label="Batch"
            name="education.batch"
            value={formData.education.batch}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Bank Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-bold mb-2">Bank Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FloatingInput
            id="bankName"
            label="Bank Name"
            name="bankDetails.bankName"
            value={formData.bankDetails.bankName}
            onChange={handleChange}
          />
          <FloatingInput
            id="branch"
            label="Branch"
            name="bankDetails.branch"
            value={formData.bankDetails.branch}
            onChange={handleChange}
          />
          <FloatingInput
            id="IFSC"
            label="IFSC Code"
            name="bankDetails.IFSC"
            value={formData.bankDetails.IFSC}
            onChange={handleChange}
          />
          <FloatingInput
            id="accountNumber"
            label="Account Number"
            name="bankDetails.accountNumber"
            value={formData.bankDetails.accountNumber}
            onChange={handleChange}
          />
        </div>
      </div>


        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;



// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "../../api/axios";

// const FloatingInput = ({ id, label, name, type = "text", value, onChange }) => (
//   <div className="relative">
//     <input
//       type={type}
//       id={id}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-black dark:border-gray-300 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//       placeholder=" "
//     />
//     <label
//       htmlFor={id}
//       className="absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-4 ml-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
//     >
//       {label}
//     </label>
//   </div>
// );

// const EditProfile = () => {
//   const { userId, token, name } = useSelector((state) => state.auth);

//   const [formData, setFormData] = useState({
//     personalEmail: "",
//     phone_no: "",
//     gender: "",
//     bloodGroup: "",
//     dateOfBirth: "",
//     currentAddress: "",
//     permanentAddress: "",
//     education: {
//       college: "",
//       degree: "",
//       batch: "",
//     },
//     bankDetails: {
//       bankName: "",
//       branch: "",
//       IFSC: "",
//       accountNumber: "",
//     },
//   });

//   const [profilePhoto, setProfilePhoto] = useState(null);

//   const handleProfilePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePhoto(reader.result); // Base64 string
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes("education") || name.includes("bankDetails")) {
//       const [parentKey, childKey] = name.split(".");
//       setFormData((prev) => ({
//         ...prev,
//         [parentKey]: {
//           ...prev[parentKey],
//           [childKey]: value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const updatedData = { ...formData };
//     if (profilePhoto) {
//       updatedData.profilePhoto = profilePhoto;
//     }

//     console.log(updatedData);
//     try {
//       const response = await axios.patch(
//         `/api/users/update/${userId}`,
//         updatedData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("Response:", response.data);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   };

//   return (
//     <div className="p-6">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">{name} Profile</h1>
//           <div className="relative">
//             <label htmlFor="profilePhoto" className="relative cursor-pointer group">
//               <input
//                 type="file"
//                 id="profilePhoto"
//                 name="profilePhoto"
//                 accept="image/*"
//                 onChange={handleProfilePhotoChange}
//                 className="hidden"
//               />
//               <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300 shadow-md group-hover:shadow-lg">
//                 {profilePhoto ? (
//                   <img
//                     src={profilePhoto}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-gray-400 text-sm">Upload</span>
//                 )}
//               </div>
//               <div className="absolute bottom-0 left-0 bg-white p-1 rounded-full border border-gray-300 shadow-md group-hover:bg-gray-100">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="w-4 h-4 text-gray-500 group-hover:text-gray-700"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M16.862 3.487a2.25 2.25 0 013.182 3.182L8.31 18.404a4.5 4.5 0 01-1.691 1.09l-4.2 1.4 1.4-4.2a4.5 4.5 0 011.09-1.691l11.953-11.953z"
//                   />
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M19.006 5.635l-1.425-1.425" />
//                 </svg>
//               </div>
//             </label>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
//           <h2 className="text-lg font-bold mb-2">Personal Info</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[
//               { label: "Name", name: "name", type: "text" },
//               { label: "Personal Email", name: "personalEmail", type: "email" },
//               { label: "Phone Number", name: "phone_no", type: "text" },
//               {
//                 label: "Gender",
//                 name: "gender",
//                 type: "select",
//                 options: ["Male", "Female", "Other"],
//               },
//               {
//                 label: "Blood Group",
//                 name: "bloodGroup",
//                 type: "select",
//                 options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
//               },
//               { label: "Date of Birth", name: "dateOfBirth", type: "date" },
//               { label: "Current Address", name: "currentAddress", type: "text" },
//               { label: "Permanent Address", name: "permanentAddress", type: "text" },
//             ].map((field, idx) => (
//               field.type === "select" ? (
//                 <div key={idx} className="relative">
//                   <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
//                     {field.label}
//                   </label>
//                   <select
//                     id={field.name}
//                     name={field.name}
//                     value={formData[field.name]}
//                     onChange={handleChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
//                   >
//                     <option value="">Select {field.label}</option>
//                     {field.options.map((option) => (
//                       <option key={option} value={option}>{option}</option>
//                     ))}
//                   </select>
//                 </div>
//               ) : (
//                 <FloatingInput
//                   key={idx}
//                   id={field.name}
//                   label={field.label}
//                   name={field.name}
//                   type={field.type}
//                   value={formData[field.name]}
//                   onChange={handleChange}
//                 />
//               )
//             ))}
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
//           <h2 className="text-lg font-bold mb-2">Education</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[
//               { label: "College Name", name: "education.college", type: "text" },
//               { label: "Degree", name: "education.degree", type: "text" },
//               { label: "Batch", name: "education.batch", type: "text" },
//             ].map((field, idx) => (
//               <FloatingInput
//                 key={idx}
//                 id={field.name}
//                 label={field.label}
//                 name={field.name}
//                 type={field.type}
//                 value={formData.education[field.name.split(".")[1]]}
//                 onChange={handleChange}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
//           <h2 className="text-lg font-bold mb-2">Bank Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[
//               { label: "Bank Name", name: "bankDetails.bankName", type: "text" },
//               { label: "Branch", name: "bankDetails.branch", type: "text" },
//               { label: "IFSC Code", name: "bankDetails.IFSC", type: "text" },
//               { label: "Account Number", name: "bankDetails.accountNumber", type: "text" },
//             ].map((field, idx) => (
//               <FloatingInput
//                 key={idx}
//                 id={field.name}
//                 label={field.label}
//                 name={field.name}
//                 type={field.type}
//                 value={formData.bankDetails[field.name.split(".")[1]]}
//                 onChange={handleChange}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="text-center">
//           <button
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditProfile;

// import React, { useState } from "react";
// import { useSelector } from "react-redux";

// const FloatingInput = ({ id, label, name, type = "text", value, onChange }) => (
//   <div className="relative">
//     <input
//       type={type}
//       id={id}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-black dark:border-gray-300 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//       placeholder=" "
//     />
//     <label
//       htmlFor={id}
//       className="absolute text-md text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-4 ml-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
//     >
//       {label}
//     </label>
//   </div>
// );

// const EditProfile = () => {

//   const {userId,token} = useSelector((state) => state.auth);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     gender: "",
//     bloodGroup: "",
//     dob:"",
//     currentAddress: "",
//     permanentAddress: "",
//     collegeName: "",
//     degree: "",
//     batch: "",
//     bankName: "",
//     branch: "",
//     ifscCode: "",
//     accountNumber: "",
//   });

//   const [profilePhoto, setProfilePhoto] = useState(null); // State to store the profile photo

//   const handleProfilePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const previewUrl = URL.createObjectURL(file);
//       setProfilePhoto(previewUrl); // Set the preview URL to display the uploaded image
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Data:", formData);
//     // Add your API call here to save the data
//   };

//   return (
//     <div className="p-6">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Header Section */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Edit Profile</h1>
//           {/* Profile Photo Input */}
//           <div className="relative">
//             <label htmlFor="profilePhoto" className="relative cursor-pointer group">
//               <input
//                 type="file"
//                 id="profilePhoto"
//                 name="profilePhoto"
//                 accept="image/*"
//                 onChange={handleProfilePhotoChange}
//                 className="hidden"
//               />
//               <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300 shadow-md group-hover:shadow-lg">
//                 {profilePhoto ? (
//                   <img
//                     src={profilePhoto}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-gray-400 text-sm">Upload</span>
//                 )}
//               </div>

//               {/* Pen Icon */}
//               <div className="absolute bottom-0 left-0 bg-white p-1 rounded-full border border-gray-300 shadow-md group-hover:bg-gray-100">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="w-4 h-4 text-gray-500 group-hover:text-gray-700"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M16.862 3.487a2.25 2.25 0 013.182 3.182L8.31 18.404a4.5 4.5 0 01-1.691 1.09l-4.2 1.4 1.4-4.2a4.5 4.5 0 011.09-1.691l11.953-11.953z"
//                   />
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M19.006 5.635l-1.425-1.425" />
//                 </svg>
//               </div>
//             </label>
//           </div>
//         </div>

//         {/* Personal Info */}
//         <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
//           <h2 className="text-lg font-bold mb-2">Personal Info</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[
//               { label: "Name", name: "name", type: "text" },
//               { label: "Personal mailID", name: "email", type: "email" },
//               { label: "Phone Number", name: "phone", type: "text" },
//               { label: "Gender", name: "gender", type: "text" },
//               { label: "Blood Group", name: "bloodGroup", type: "text" },
//               { label: "Date of Birth", name: "dateOfBirth", type: "date" },
//               { label: "Current Address", name: "currentAddress", type: "text" },
//               { label: "Permanent Address", name: "permanentAddress", type: "text" },
//             ].map((field, idx) => (
//               <FloatingInput
//                 key={idx}
//                 id={field.name}
//                 label={field.label}
//                 name={field.name}
//                 type={field.type}
//                 value={formData[field.name]}
//                 onChange={handleChange}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Education Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
//         <h2 className="text-lg font-bold mb-2">Education</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[
//             { label: "College Name", name: "collegeName", type: "text" },
//             { label: "Degree", name: "degree", type: "text" },
//             { label: "Batch", name: "batch", type: "text" },
//             ].map((field, idx) => (
//             <FloatingInput
//                 key={idx}
//                 id={field.name}
//                 label={field.label}
//                 name={field.name}
//                 type={field.type}
//                 value={formData[field.name]}
//                 onChange={handleChange}
//             />
//             ))}
//         </div>
//         </div>

//         {/* Bank Details Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
//         <h2 className="text-lg font-bold mb-2">Bank Details</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[
//             { label: "Bank Name", name: "bankName", type: "text" },
//             { label: "Branch", name: "branch", type: "text" },
//             { label: "IFSC Code", name: "ifscCode", type: "text" },
//             { label: "Account Number", name: "accountNumber", type: "text" },
//             ].map((field, idx) => (
//             <FloatingInput
//                 key={idx}
//                 id={field.name}
//                 label={field.label}
//                 name={field.name}
//                 type={field.type}
//                 value={formData[field.name]}
//                 onChange={handleChange}
//             />
//             ))}
//         </div>
//         </div>
//         <div className="text-center">
//              <button className="bg-blue-600 hover:bg-blue-700 h-10 w-20 rounded border border-blue-900 text-center">Submit</button>
//        </div>
//       </form>
//     </div>
//   );
// };

// export default EditProfile;
