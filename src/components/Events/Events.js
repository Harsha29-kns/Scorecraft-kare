import React, { useState, useEffect } from 'react';
import { events as eventsAPI } from '../../services/firebase';
import './Events.css';
import EventsDetails from '../EventsDetails/EventsDetails';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventsAPI.getAll();
        const sortedData = data.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
        setEvents(sortedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events');
        setLoading(false);
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="events-page">
      <div className="events-container">
        <h1>Events</h1>
        <div className="events-content">
          {loading ? <p>Loading events...</p> : error ? <div className="error">{error}</div> : events.length === 0 ? (
            <p className="no-events">No events to display.</p>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
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

export default Events;