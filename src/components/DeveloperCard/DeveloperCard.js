import React from 'react';
import './DeveloperCard.css';

const DeveloperCard = ({ name, role, image, linkedin, github, email, delay }) => {
  return (
    <div className="developer-card-container" style={{ animationDelay: `${delay}s` }}>
      <div className="developer-card">
        {/* Card Front */}
        <div className="card-front">
          <div className="developer-image-container">
            <img src={image} alt={name} className="developer-image" />
          </div>
          <div className="developer-info">
            <h3 className="developer-name">{name}</h3>
            <p className="developer-role">{role}</p>
          </div>
        </div>
        {/* Card Back */}
        <div className="card-back">
          <h3 className="developer-name-back">{name}</h3>
          <p>Connect</p>
          <div className="developer-links">
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-linkedin"></i>
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-github"></i>
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="social-link">
                <i className="fas fa-envelope"></i>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;