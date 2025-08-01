import React, { useState, useEffect } from 'react';
import './Modal.css';

function EventModal({ onClose, onSave, initialData, isEditing }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    image_url: '',
    registration_link: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        event_date: initialData.event_date ? new Date(initialData.event_date).toISOString().slice(0, 16) : '',
        location: initialData.location || '',
        image_url: initialData.image_url || '',
        registration_link: initialData.registration_link || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Format the event_date to ISO string for database
    const submissionData = {
      ...formData,
      event_date: new Date(formData.event_date).toISOString()
    };
    onSave(submissionData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content event-modal">
        <button 
          type="button" 
          className="back-button"
          onClick={onClose}
          aria-label="Go back"
        >
          Back
        </button>
        <h2>{isEditing ? 'Edit Event' : 'Add New Event'}</h2>
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Event Title*:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description*:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter event description"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="event_date">Event Date & Time*:</label>
            <input
              type="datetime-local"
              id="event_date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location*:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Enter event location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image_url">Image URL:</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </div>

          <div className="form-group">
            <label htmlFor="registration_link">Registration Link:</label>
            <input
              type="url"
              id="registration_link"
              name="registration_link"
              value={formData.registration_link}
              onChange={handleChange}
              placeholder="Enter registration link"
            />
          </div>

          <div className="modal-buttons">
            <button type="submit" className="save-button">
              {isEditing ? 'Save Changes' : 'Create Event'}
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventModal;
