import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManageCoreTeam from './ManageCoreTeam';
import ManageEvents from './ManageEvents';
import ManageMentors from './ManageMentors';
import { FiUsers, FiAward, FiCalendar, FiLogOut, FiGrid } from 'react-icons/fi';
import './Dashboard.css';
import { adminAuth } from '../../services/firebase'; // Import adminAuth for logout

// Store component types (e.g., ManageCoreTeam) instead of instances (<ManageCoreTeam />)
const navItems = [
  { id: 'team', label: 'Manage Core Team', Icon: FiUsers, Component: ManageCoreTeam },
  { id: 'mentors', label: 'Manage Mentors', Icon: FiAward, Component: ManageMentors },
  { id: 'events', label: 'Manage Events', Icon: FiCalendar, Component: ManageEvents },
];

const Dashboard = () => {
  const [activeViewId, setActiveViewId] = useState('team');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminAuth.logout();
      navigate('/admin-login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };
  
  const activeView = navItems.find(item => item.id === activeViewId);
  // Get the component type to render
  const ActiveComponent = activeView ? activeView.Component : null;

  return (
    <div className="app-layout">
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <FiGrid className="logo-icon" />
          <h2>Admin Panel</h2>
        </div>
        <nav className="nav-list">
          {navItems.map((item) => {
            // Get the Icon component from the item
            const Icon = item.Icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveViewId(item.id)}
                className={`nav-item ${activeViewId === item.id ? 'active' : ''}`}
              >
                <span className="nav-icon"><Icon /></span>
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
            <button onClick={handleLogout} className="nav-item logout-button">
                <span className="nav-icon"><FiLogOut /></span>
                <span className="nav-label">Logout</span>
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="main-content">
        <header className="content-header">
          <h1>{activeView ? activeView.label : 'Dashboard'}</h1>
          <div className="user-profile">
            <span>Welcome, Admin</span>
            <div className="user-avatar">A</div>
          </div>
        </header>
        
        <div className="content-body">
          {/* Render the active component dynamically with a key to force re-mounting */}
          {ActiveComponent ? <ActiveComponent key={activeViewId} /> : <p>Select a section from the menu.</p>}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
