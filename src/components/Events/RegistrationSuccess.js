import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './RegistrationSuccess.css'; // We'll create this new CSS file

const RegistrationSuccess = () => {
  const location = useLocation();
  const { event } = location.state || {}; // Get event data passed from the registration page

  return (
    <div className="registration-success-container">
      <div className="success-card">
        <div className="success-icon-wrapper">
          <FiCheckCircle className="success-icon" />
        </div>
        
        <h1 className="success-title">Registration Submitted!</h1>
        
        {event ? (
          <p className="success-message">
            Thank you for registering for <strong>{event.title}</strong>.
            {event.amount > 0 && " Your payment is now under verification. You will receive a confirmation email once it's approved."}
          </p>
        ) : (
          <p className="success-message">
            Your registration details have been received. You will receive a confirmation email shortly.
          </p>
        )}

        {event?.whatsappLink && (
          <div className="whatsapp-section">
            <h3>Don't Miss Any Updates!</h3>
            <p>Join the official WhatsApp group to stay connected with the event organizers and receive important information.</p>
            <a href={event.whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-button">
              <FaWhatsapp />
              Join WhatsApp Group
            </a>
          </div>
        )}
        
        <div className="back-link-wrapper">
          <Link to="/events" className="back-link">
            <FiArrowLeft />
            Back to All Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
