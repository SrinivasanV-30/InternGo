import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';

const Profile = () => {
  const { userId, token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data.data); 
        console.log(userData);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Error fetching user data.</div>;
  }

  const {
    name,
    email,
    profilePhoto,
    phone_no,
    bloodGroup,
    dateOfBirth,
    dateOfJoining,
    education,
    designation,
    phase,
    status,
    batch,
    role,
  } = userData;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Profile Details</h1>

      {/* Personal Details */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Personal Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Name:</strong> {name}
          </div>
          <div>
            <strong>Email:</strong> {email || ''}
          </div>
          <div>
            <strong>Phone:</strong> {phone_no || ''}
          </div>
          <div>
            <strong>Blood Group:</strong> {bloodGroup || ''}
          </div>
          <div>
            <strong>Date of Birth:</strong> {new Date(dateOfBirth).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Official Details */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Official Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Role:</strong> {role.roleName}
          </div>
          <div>
            <strong>Designation:</strong> {designation || 'N/A'}
          </div>
          <div>
            <strong>Phase:</strong> {phase || ''}
          </div>
          <div>
            <strong>Status:</strong> {status || ''}
          </div>
          <div>
            <strong>Batch:</strong> {batch || 'N/A'}
          </div>
          <div>
            <strong>Date of Joining:</strong> {new Date(dateOfJoining).toLocaleDateString() || ''}
          </div>
        </div>
      </div>

      {/* Education Details */}
      <div>
        <h2 className="text-xl font-bold mb-4">Education Details</h2>
        {education.length > 0 ? (
          <ul className="list-disc ml-6">
            {education.map((edu, index) => (
              <li key={index}>
                <strong>Degree:</strong> {edu.degree || 'N/A'}, <strong>Institution:</strong>{' '}
                {edu.institution || 'N/A'}, <strong>Year:</strong> {edu.year || 'N/A'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No education details available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
