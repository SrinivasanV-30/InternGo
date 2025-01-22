import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import GLogin from '../components/GLogin';

const SignIn = () => {

  const SIGNIN_URL = "/api/auth/signin";
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      SIGNIN_URL, 
      formData,
      {
        headers:{'Content-Type':'application/json'},
        withCredentials:true
      }
    );
    console.log(response,response.data.data);
    // const accessToken = response?.data?.accessToken
    if (response.data) {
      const user=response.data.data;
      console.log(user);
      
      if(user.token){
        localStorage.setItem("token", user.token);
        document.cookie = `token=${user.token}; path=/; secure; HttpOnly; max-age=60`;
        // Store roles and permissions locally
        localStorage.setItem('roles', JSON.stringify(user.role));
        localStorage.setItem('permissions', JSON.stringify(user.permissions));

        alert('Sign In Successful!');
        navigate('/dashboard');
      }
      
    } else {
      alert('Invalid email or password. Please try again.');
    }
  } catch (error) {
    console.error('Sign In Error:', error);
    alert('An error occurred while signing in. Please try again.');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg shadow-gray-400">
        <h2 className="text-center text-2xl font-bold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
          <GLogin />
          <p className="text-sm text-center text-gray-700 mt-4">
            Don't have an account?{' '}
            <NavLink
              className="text-blue-600 hover:underline cursor-pointer"
              to={'/signup'}
            >
              Sign Up
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
