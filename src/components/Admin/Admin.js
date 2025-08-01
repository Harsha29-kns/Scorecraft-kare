import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuth } from '../../services/firebase'; // Corrected: Import from firebase
import './Admin.css';

function Admin({ setIsLoggedIn }) {
  const [email, setEmail] = useState(''); // Changed: Use email for Firebase
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Added for navigation after login

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await adminAuth.login(email, password); // Corrected: Use Firebase auth
      setMessage('Login successful');
      setIsLoggedIn(true);
      navigate('/dashboard'); // Added: Redirect to a protected route
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Login failed. Please check your credentials.'); // Updated error message
    }
  };

  return (
    <>
      <div className="admin-page">
        <div className="admin-container">
          <h1>Admin Login</h1>
          <div className="admin-content">
            <form className="admin-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label> {/* Changed: Label is now Email */}
                <input
                  type="email" // Changed: Input type is now email
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="login-button">Login</button>
              {message && <p className="login-message">{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;