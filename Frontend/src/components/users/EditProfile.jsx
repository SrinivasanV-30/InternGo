import React, { useState } from "react";

const FloatingInput = ({ id, label, name, type = "text", value, onChange }) => (
  <div className="relative">
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-black dark:border-gray-300 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    bloodGroup: "",
    currentAddress: "",
    permanentAddress: "",
    collegeName: "",
    degree: "",
    batch: "",
    bankName: "",
    branch: "",
    ifscCode: "",
    accountNumber: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null); // State to store the profile photo

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePhoto(previewUrl); // Set the preview URL to display the uploaded image
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add your API call here to save the data
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          {/* Profile Photo Input */}
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

              {/* Pen Icon */}
              <div className="absolute bottom-0 left-0 bg-white p-1 rounded-full border border-gray-300 shadow-md group-hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-500 group-hover:text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 3.487a2.25 2.25 0 013.182 3.182L8.31 18.404a4.5 4.5 0 01-1.691 1.09l-4.2 1.4 1.4-4.2a4.5 4.5 0 011.09-1.691l11.953-11.953z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.006 5.635l-1.425-1.425" />
                </svg>
              </div>
            </label>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg font-bold mb-2">Personal Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Name", name: "name", type: "text" },
              { label: "Personal mailID", name: "email", type: "email" },
              { label: "Phone Number", name: "phone", type: "text" },
              { label: "Gender", name: "gender", type: "text" },
              { label: "Blood Group", name: "bloodGroup", type: "text" },
              { label: "Current Address", name: "currentAddress", type: "text" },
              { label: "Permanent Address", name: "permanentAddress", type: "text" },
            ].map((field, idx) => (
              <FloatingInput
                key={idx}
                id={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-bold mb-2">Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
            { label: "College Name", name: "collegeName", type: "text" },
            { label: "Degree", name: "degree", type: "text" },
            { label: "Batch", name: "batch", type: "text" },
            ].map((field, idx) => (
            <FloatingInput
                key={idx}
                id={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
            />
            ))}
        </div>
        </div>

        {/* Bank Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-bold mb-2">Bank Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
            { label: "Bank Name", name: "bankName", type: "text" },
            { label: "Branch", name: "branch", type: "text" },
            { label: "IFSC Code", name: "ifscCode", type: "text" },
            { label: "Account Number", name: "accountNumber", type: "text" },
            ].map((field, idx) => (
            <FloatingInput
                key={idx}
                id={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
            />
            ))}
        </div>
        </div>

      </form>
    </div>
  );
};

export default EditProfile;
