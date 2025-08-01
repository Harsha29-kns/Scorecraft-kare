import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import the components to be displayed
import ManageCoreTeam from './ManageCoreTeam';
import ManageEvents from './ManageEvents';
import ManageMentors from './ManageMentors';

// Import icons for the navigation
import { FiUsers, FiAward, FiCalendar, FiLogOut, FiGrid } from 'react-icons/fi';

// Import the specific CSS for the dashboard layout
import './Dashboard.css';

// Define navigation items in an array for scalability
const navItems = [
  { id: 'team', label: 'Manage Core Team', icon: <FiUsers />, component: <ManageCoreTeam /> },
  { id: 'mentors', label: 'Manage Mentors', icon: <FiAward />, component: <ManageMentors /> },
  { id: 'events', label: 'Manage Events', icon: <FiCalendar />, component: <ManageEvents /> },
];

const Dashboard = () => {
  const [activeViewId, setActiveViewId] = useState('team');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Your Firebase logout logic would go here
    // For example: auth.signOut().then(() => navigate('/admin'));
    console.log("Logging out...");
    navigate('/admin'); // Redirect to login page after logout
  };
  
  const activeView = navItems.find(item => item.id === activeViewId);

  return (
    <div className="app-layout">
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <FiGrid className="logo-icon" />
          <h2>Admin Panel</h2>
        </div>
        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveViewId(item.id)}
              className={`nav-item ${activeViewId === item.id ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

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
          {/* Render the active component */}
          {activeView ? activeView.component : <p>Select a section from the menu.</p>}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;