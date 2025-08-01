import React, { useState } from 'react';
import './ContactUs.css';
import { contactSubmissions } from '../../services/firebase'; // Import the new service

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      await contactSubmissions.create({
        ...formData,
        submittedAt: new Date().toISOString(),
      });
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' }); // Clear form
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="contact-us-page">
      <div className="contact-us-container">
        <h1>Contact Us</h1>
        <div className="contact-us-content">
          <p>
            We'd love to hear from you! Whether you have questions, suggestions, or want to collaborate,
            feel free to reach out to us.
          </p>
          <p>
            Email: scorecraft@klu.ac.in<br />
          </p>
          <form className="contact-us-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" disabled={status === 'Sending...'}>
              {status === 'Sending...' ? 'Sending...' : 'Send Message'}
            </button>
            {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
          </form>
          <div className="contact-us-social">
            <p>Connect with us:</p>
            <ul>
              <li><a href="https://www.linkedin.com/in/scorecraftkare/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://x.com/scorecraftKARE" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="mailto:scorecraft@klu.ac.in" target="_blank" rel="noopener noreferrer">Gmail</a></li>
              <li><a href="https://www.instagram.com/scorecraftkare/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;