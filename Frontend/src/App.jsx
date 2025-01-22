import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path='/user-management' element={<UserManagement />} /> */}
        {/* some other routes should be authenticated */}
      </Routes>
    </Router>
  );
};

export default App;



// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Home from './pages/Home';
// import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
// import Dashboard from './pages/Dashboard';
// import { isAuthenticated, logout } from './utils/auth';

// const ProtectedRoute = ({ children }) => {
//   if (!isAuthenticated()) {
//     alert('Session expired. Please log in again.');
//     return <Navigate to="/signin" />;
//   }
//   return children;
// };

// const App = () => {
//   useEffect(() => {
//     const tokenExpiry = localStorage.getItem('tokenExpiry');
//     if (tokenExpiry) {
//       const remainingTime = new Date(tokenExpiry).getTime() - new Date().getTime();
//       if (remainingTime > 0) {
//         setTimeout(() => {
//           logout();
//           window.location.href = '/signin';
//         }, remainingTime);
//       } else {
//         logout();
//       }
//     }
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/signin" element={<SignIn />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;