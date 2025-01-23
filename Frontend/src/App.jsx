import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/authentication/SignIn';
import SignUp from './pages/authentication/SignUp';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DailyUpdate from '../src/components/users/DailyUpdate'
import Feedback from '../src/components/users/Feedback'
import Help from '../src/components/users/Help'
import Interactions from '../src/components/users/Interactions'
import Profile from '../src/components/users/Profile'
import InteractionSchedule from '../src/components/admin/InteractionSchedule'
import Plan from '../src/components/admin/Plan'
import Records from '../src/components/admin/Records'
import EditProfile from './components/users/EditProfile';
import Roadmap from './components/common/Roadmap';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                {/* Protected Dashboard Routes */}
                <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
                >
                    <Route path="daily-update" element={<DailyUpdate />} />
                    <Route path="feedback" element={<Feedback />} />
                    <Route path="help" element={<Help />} />
                    <Route path="interactions" element={<Interactions />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="interaction-schedule" element={<InteractionSchedule />} />
                    <Route path="plan" element={<Plan />} />
                    <Route path="records" element={<Records />} />
                    <Route path="edit-profile" element={<EditProfile />} />
                    <Route path="roadmap" element={<Roadmap />} />
                </Route>
            </Routes>
        </Router>
    );
};
 
export default App;
