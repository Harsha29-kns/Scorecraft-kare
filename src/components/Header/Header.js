import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { adminAuth } from '../../services/firebase';
import './Header.css';

function Header({ isLoggedIn, setIsLoggedIn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await adminAuth.logout();
      setIsLoggedIn(false);
      navigate('/admin-login');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && hamburgerRef.current && !menuRef.current.contains(event.target) && !hamburgerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Define navigation links
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/mentors', label: 'Mentors' },
    { path: '/core-team', label: 'Core Team' },
    { path: '/events', label: 'Events' },
    { path: '/upcoming-events', label: 'Upcoming Events' },
    { path: '/contact-us', label: 'Contact Us' },
  ];

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img 
          src="https://res.cloudinary.com/dbroxheos/image/upload/v1741862069/Screenshot_2025-03-13_160404_lntlya.png" 
          alt="ScoreCraft Logo" 
          className="logo-img" 
        />
      </Link>
      
      <nav ref={menuRef} className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <Link 
            key={link.path}
            to={link.path} 
            className={location.pathname === link.path ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="admin-button">Dashboard</Link>
            <button onClick={handleLogout} className="admin-button logout">Logout</button>
          </>
        ) : (
          <Link to="/admin-login" className="admin-button">Admin Login</Link>
        )}
      </div>

      <div ref={hamburgerRef} className={`hamburger-menu ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}

export default Header;