import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Events from './components/Events/Events';
import CoreTeam from './components/CoreTeam/CoreTeam';
import ContactUs from './components/ContactUs/ContactUs';
import AdminLogin from './components/Admin/AdminLogin';
import UpcomingEvents from './components/UpcomingEvents/UpcomingEvents';
import Mentors from './components/Mentors/Mentors';
import Header from './components/Header/Header';
import Dashboard from './components/Admin/Dashboard';
import { adminAuth } from './services/firebase';
import EventRegistration from './components/Events/EventRegistration';
import RegistrationSuccess from './components/Events/RegistrationSuccess';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = adminAuth.onAuthChange(user => {
      setIsLoggedIn(!!user);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (checking) return <div>Loading...</div>;
    return isLoggedIn ? children : <Navigate to="/admin-login" replace />;
  };

  if (checking) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/core-team" element={<CoreTeam />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/events" element={<Events isLoggedIn={isLoggedIn} />} />
        <Route path="/upcoming-events" element={<UpcomingEvents isLoggedIn={isLoggedIn} />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/register/:eventId" element={<EventRegistration />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin setIsLoggedIn={setIsLoggedIn} />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;