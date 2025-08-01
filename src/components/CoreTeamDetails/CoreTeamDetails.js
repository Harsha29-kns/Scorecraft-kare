import React, { useState } from 'react';
import './CoreTeamDetails.css';

const CoreTeamDetails = ({ member }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!member) {
    return <div className="no-member">No member data available</div>;
  }

  const openSocialLink = (url, e) => {
    if (url) {
      e.stopPropagation();
      window.open(url, '_blank');
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mentor-card">
      <div className="mentor-image-container">
        <img src={member.image} alt={member.name} className="mentor-image" />
        <div className="social-overlay">
          {member.linkedin && (
            <button 
              className="social-icon linkedin"
              onClick={(e) => openSocialLink(member.linkedin, e)}
              aria-label="LinkedIn Profile"
            >
              <i className="fab fa-linkedin"></i>
            </button>
          )}
          {member.github && (
            <button 
              className="social-icon github"
              onClick={(e) => openSocialLink(member.github, e)}
              aria-label="GitHub Profile"
            >
              <i className="fab fa-github"></i>
            </button>
          )}
          {member.twitter && (
            <button 
              className="social-icon twitter"
              onClick={(e) => openSocialLink(member.twitter, e)}
              aria-label="Twitter Profile"
            >
              <i className="fab fa-twitter"></i>
            </button>
          )}
          {member.email && (
            <button 
              className="social-icon email"
              onClick={(e) => openSocialLink(`mailto:${member.email}`, e)}
              aria-label="Email"
            >
              <i className="fas fa-envelope"></i>
            </button>
          )}
        </div>
      </div>
      <div className="mentor-info">
        <h3 className="mentor-name">{member.name}</h3>
        <p className="mentor-position">{member.role}</p>
        <p className="mentor-description">
          {isExpanded ? member.description : `${member.description.substring(0, 100)}...`}
        </p>
        {member.description.length > 100 && (
          <button className="read-more" onClick={toggleExpand}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CoreTeamDetails;
