import React, { useState, useEffect } from 'react';
import { events as eventsAPI } from '../../services/firebase';
import './UpcomingEvents.css';
import EventsDetails from '../EventsDetails/EventsDetails';

function UpcomingEvents() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        const data = await eventsAPI.getUpcoming();
        setUpcomingEvents(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch upcoming events');
        setLoading(false);
        console.error('Error fetching upcoming events:', err);
      }
    };
    fetchUpcomingEvents();
  }, []);

  return (
    <div className="upcoming-events-page">
      <div className="upcoming-events-container">
        <h1>Upcoming Events</h1>
        <div className="upcoming-events-content">
          {loading ? <p>Loading upcoming events...</p> : error ? <div className="error">{error}</div> : upcomingEvents.length === 0 ? (
            <p className="no-events">No upcoming events to display.</p>
          ) : (
            <div className="events-grid">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <EventsDetails event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpcomingEvents;