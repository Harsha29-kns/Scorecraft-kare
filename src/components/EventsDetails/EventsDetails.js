import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrations } from '../../services/firebase';
import './EventDetails.css';

const EventsDetails = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [verifiedCount, setVerifiedCount] = useState(null);

  useEffect(() => {
    if (!event || !event.startTime) return;

    const calculateStatusAndTime = () => {
      const now = new Date();
      const eventStartTime = new Date(event.startTime);
      const eventEndTime = event.endTime ? new Date(event.endTime) : null;

      if (eventEndTime && now > eventEndTime) {
        setStatus('completed');
      } else if (now >= eventStartTime && (!eventEndTime || now < eventEndTime)) {
        setStatus('live');
      } else {
        setStatus('upcoming');
      }

      const timeDiff = eventStartTime - now;
      if (timeDiff < 0) {
        setTimeRemaining('Event completed');
        return;
      }
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${days}d ${hours}h ${minutes}m remaining`);
    };

    calculateStatusAndTime();
    const interval = setInterval(calculateStatusAndTime, 60000);
    return () => clearInterval(interval);
  }, [event]);

  useEffect(() => {
    if (!event || !event.id) return;

    
    const unsubscribe = registrations.listenVerifiedByEventId(event.id, (verifiedRegs) => {
      setVerifiedCount(verifiedRegs.length);
    });

    
    return () => unsubscribe();
  }, [event]);

  if (!event) {
    return <div className="no-event">No event data available</div>;
  }
  
  const isRegistrationClosed = new Date() > new Date(event.endTime);
  const isFull = verifiedCount !== null && event.capacity && verifiedCount >= event.capacity;

  return (
    <div className={`event-card-display ${status}`}>
      <div className="event-image-container">
        <img src={event.imageUrl} alt={event.title} className="event-image" />
        <div className="time-remaining">
          {status === 'live' ? <span className="live-indicator">● Live</span> : <span>{timeRemaining}</span>}
        </div>
      </div>
      <div className="event-info">
        <h3 className="event-heading">{event.title}</h3>
        <p className="event-description">
          {isExpanded ? event.description : `${String(event.description || '').substring(0, 80)}...`}
        </p>
        {String(event.description || '').length > 80 && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="read-more-text">
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>
      <div className="event-actions">
        {isFull ? (
          <span className="registration-closed-text">Registrations Full</span>
        ) : isRegistrationClosed ? (
          <span className="registration-closed-text">Registrations Closed</span>
        ) : (
          <Link to={`/register/${event.id}`} className="register-button">
            Register Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default EventsDetails;
