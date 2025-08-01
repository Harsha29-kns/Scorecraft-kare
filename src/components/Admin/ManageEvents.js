import React, { useState, useEffect } from 'react';
import { events, registrations, imageUploader } from '../../services/firebase';
import { downloadCSV } from '../../utils/csvHelper';
import axios from 'axios';

// Import icons for a polished and intuitive UI
import {
  FiPlus, FiEdit, FiTrash2, FiCalendar, FiUsers, FiDownload, FiX,
  FiFileText, FiPhone, FiMapPin, FiClock, FiLink, FiTag, FiDollarSign,
  FiUploadCloud, FiCheckCircle, FiAlertCircle, FiMail, FiBarChart2
} from 'react-icons/fi';

// Import the new CSS file for this component
import './ManageEvents.css';

const ManageEvents = () => {
  const [eventList, setEventList] = useState([]);
  const [formData, setFormData] = useState({
    title: '', description: '', contactNumber: '', teamSize: 1, amount: 0, capacity: 50,
    venue: '', startTime: '', endTime: '', imageUrl: '', qrCodeUrl: '', whatsappLink: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [registrationsList, setRegistrationsList] = useState([]);
  const [registrationCounts, setRegistrationCounts] = useState({});
  const [viewingRegistrationsFor, setViewingRegistrationsFor] = useState(null);

  const fetchEventsAndCounts = async () => {
    const eventsData = await events.getAll();
    setEventList(eventsData);

    const counts = {};
    for (const event of eventsData) {
      const regs = await registrations.getVerifiedByEventIdOnce(event.id);
      counts[event.id] = regs.length;
    }
    setRegistrationCounts(counts);
  };

  useEffect(() => {
    fetchEventsAndCounts();
  }, []);

  // --- UPDATED useEffect to prevent duplicate registrations ---
  useEffect(() => {
    // If no event is selected to view, ensure the list is empty and do nothing further.
    if (!viewingRegistrationsFor) {
      setRegistrationsList([]);
      return;
    }

    // Set up the real-time listener.
    // The `onSnapshot` function will provide the complete, up-to-date list of registrations
    // every time there is a change in the database.
    const unsubscribe = registrations.listenByEventId(
      viewingRegistrationsFor, 
      (updatedList) => {
        // By setting the state with the new list, we replace the old one entirely.
        setRegistrationsList(updatedList);
      }
    );

    // This cleanup function is crucial. React runs it when the component
    // unmounts or before the effect runs again due to a dependency change.
    // This ensures we always remove the old listener before creating a new one.
    return () => {
      unsubscribe();
    };
  }, [viewingRegistrationsFor]); // The effect re-runs only when the selected event changes.

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleQrCodeFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setQrCodeFile(file);
      setQrPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = formData.imageUrl;
    let qrCodeUrl = formData.qrCodeUrl;

    if (imageFile) imageUrl = await imageUploader.upload(imageFile, `events/posters/${imageFile.name}`);
    if (qrCodeFile) qrCodeUrl = await imageUploader.upload(qrCodeFile, `events/qrcodes/${qrCodeFile.name}`);

    const dataToSave = {
      ...formData,
      imageUrl,
      qrCodeUrl,
      teamSize: Number(formData.teamSize) || 1,
      amount: Number(formData.amount) || 0,
      capacity: Number(formData.capacity) || 50
    };

    if (isEditing) {
      await events.update(isEditing, dataToSave);
    } else {
      await events.create(dataToSave);
    }
    resetForm();
    fetchEventsAndCounts();
    setLoading(false);
  };
  
  const handleVerify = async (reg) => {
    if (window.confirm("Verify this payment? An email will be sent.")) {
      try {
        await registrations.verify(reg.id);
        fetchEventsAndCounts(); // Re-fetch counts after verification
        await axios.post('/api/send-email', {
          to: reg.email,
          subject: `✅ Registration Confirmed for ${reg.eventName}!`,
          html: `<p>Your registration for <strong>${reg.eventName}</strong> has been confirmed.</p>`,
        });
        await registrations.updateEmailStatus(reg.id, 'verified_email_sent');
      } catch (error) {
        console.error("Verification failed:", error);
        await registrations.updateEmailStatus(reg.id, 'verified_email_failed');
      }
    }
  };

  const handleEdit = (event) => {
    setIsEditing(event.id);
    setFormData({ ...event, qrCodeUrl: event.qrCodeUrl || '', whatsappLink: event.whatsappLink || '', capacity: event.capacity || 50 });
    setPosterPreview(event.imageUrl);
    setQrPreview(event.qrCodeUrl);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event? This is irreversible.")) {
      await events.delete(id);
      fetchEventsAndCounts();
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      title: '', description: '', contactNumber: '', teamSize: 1, amount: 0, capacity: 50,
      venue: '', startTime: '', endTime: '', imageUrl: '', qrCodeUrl: '', whatsappLink: ''
    });
    setImageFile(null);
    setQrCodeFile(null);
    setPosterPreview(null);
    setQrPreview(null);
    setShowForm(false);
  };

  const renderEmailStatus = (status) => {
    switch (status) {
      case 'pending_email_sent':
        return <FiMail title="Initial email sent" className="status-icon pending" />;
      case 'verified_email_sent':
        return <FiCheckCircle title="Confirmation email sent" className="status-icon success" />;
      case 'verified_email_failed':
        return <FiAlertCircle title="Confirmation email failed" className="status-icon error" />;
      default:
        return null;
    }
  };

  const currentEventForModal = eventList.find(e => e.id === viewingRegistrationsFor);

  return (
    <div className="manage-events-container">
      <div className="events-header">
        <h3>{isEditing ? 'Editing Event' : 'All Events'}</h3>
        <button className="button primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <FiPlus /> Add New Event
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-group full-width">
              <label>Event Title</label>
              <div className="input-wrapper"><FiTag/><input type="text" placeholder="e.g., Tech Conference 2025" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required /></div>
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <div className="input-wrapper"><FiFileText/><textarea placeholder="Describe the event..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Contact Number</label><div className="input-wrapper"><FiPhone/><input type="text" placeholder="e.g., 9876543210" value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} required /></div></div>
              <div className="form-group"><label>Venue</label><div className="input-wrapper"><FiMapPin/><input type="text" placeholder="e.g., University Auditorium" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} required /></div></div>
              <div className="form-group"><label>Team Size</label><div className="input-wrapper"><FiUsers/><input type="number" min="1" max="10" value={formData.teamSize} onChange={e => setFormData({ ...formData, teamSize: e.target.value })} onWheel={(e) => e.target.blur()} required /></div></div>
              <div className="form-group"><label>Amount (₹)</label><div className="input-wrapper"><FiDollarSign/><input type="number" min="0" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} onWheel={(e) => e.target.blur()} required /></div></div>
              <div className="form-group"><label>Capacity</label><div className="input-wrapper"><FiBarChart2/><input type="number" min="1" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} onWheel={(e) => e.target.blur()} required /></div></div>
              <div className="form-group"><label>Start Time</label><div className="input-wrapper"><FiClock/><input type="datetime-local" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} required /></div></div>
              <div className="form-group"><label>End Time</label><div className="input-wrapper"><FiClock/><input type="datetime-local" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} required /></div></div>
            </div>
             <div className="form-group full-width">
                <label>WhatsApp Group Link</label>
                <div className="input-wrapper"><FiLink/><input type="url" placeholder="https://chat.whatsapp.com/..." value={formData.whatsappLink} onChange={e => setFormData({ ...formData, whatsappLink: e.target.value })} /></div>
            </div>
            <div className="form-row">
                <div className="form-group"><label>Event Poster</label><div className="file-input-wrapper"><input type="file" id="poster-file" onChange={handleFileChange} accept="image/*" /><label htmlFor="poster-file" className="file-input-label"><FiUploadCloud/><span>{imageFile ? imageFile.name : 'Upload Poster'}</span></label>{posterPreview && <img src={posterPreview} alt="Poster Preview" className="image-preview"/>}</div></div>
                <div className="form-group"><label>Payment QR Code</label><div className="file-input-wrapper"><input type="file" id="qr-file" onChange={handleQrCodeFileChange} accept="image/*" /><label htmlFor="qr-file" className="file-input-label"><FiUploadCloud/><span>{qrCodeFile ? qrCodeFile.name : 'Upload QR'}</span></label>{qrPreview && <img src={qrPreview} alt="QR Preview" className="image-preview"/>}</div></div>
            </div>
            <div className="form-actions">
              <button type="submit" className="button primary" disabled={loading}>{loading ? 'Saving...' : isEditing ? 'Update Event' : 'Add Event'}</button>
              <button type="button" className="button secondary" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="event-grid">
        {eventList.map(event => {
          const verifiedCount = registrationCounts[event.id] || 0;
          const isFull = verifiedCount >= event.capacity;
          return (
            <div key={event.id} className={`event-card ${isFull ? 'capacity-reached' : ''}`}>
              {isFull && (
                <div className="capacity-overlay">
                  <h4>Capacity Reached</h4>
                  <p>Please contact: {event.contactNumber}</p>
                </div>
              )}
              <img src={event.imageUrl || 'https://placehold.co/600x400/E0F7FF/0B7994?text=Event'} alt={event.title} className="event-card-image" />
              <div className="event-card-content">
                <h4>{event.title}</h4>
                <div className="event-card-details">
                  <span><FiCalendar/> {new Date(event.startTime).toLocaleDateString()}</span>
                  <span><FiMapPin/> {event.venue}</span>
                  <span><FiBarChart2/> {verifiedCount} / {event.capacity} registered</span>
                </div>
              </div>
              <div className="event-card-actions">
                <button onClick={() => setViewingRegistrationsFor(event.id)} className="action-button"><FiUsers/></button>
                <button onClick={() => handleEdit(event)} className="action-button"><FiEdit/></button>
                <button onClick={() => handleDelete(event.id)} className="action-button delete"><FiTrash2/></button>
              </div>
            </div>
          );
        })}
      </div>

      {viewingRegistrationsFor && (
        <div className="registrations-modal-overlay">
          <div className="registrations-modal-content">
            <div className="registrations-modal-header">
              <h3>Registrations for "{currentEventForModal?.title}"</h3>
              <button onClick={() => setViewingRegistrationsFor(null)} className="close-button"><FiX/></button>
            </div>
            <div className="registrations-modal-actions">
                <button onClick={() => downloadCSV(registrationsList)} className="button secondary"><FiDownload/> Download CSV</button>
            </div>
            <ul className="registrations-list">
              {registrationsList.length > 0 ? registrationsList.map(reg => (
                <li key={reg.id} className={`registration-item ${reg.verified ? 'verified' : ''}`}>
                  <div className="registration-info">
                    <div className="reg-name">
                      {renderEmailStatus(reg.emailStatus)}
                      <strong>{reg.name} (Team Lead)</strong>
                    </div>
                    <div className="reg-details">
                      <span>Reg No: {reg.regNo}</span> | <span>Phone: {reg.phone}</span>
                    </div>
                    <div className="reg-details">
                      <span>{reg.department}</span> | <span>Year: {reg.year}</span> | <span>Sec: {reg.section}</span>
                    </div>
                    
                    {reg.teamMembers?.length > 0 && (
                      <div className="team-members-section">
                        <h5>Team Members</h5>
                        <ul className="team-member-list">
                          {reg.teamMembers.map((member, index) => (
                            <li key={index} className="team-member-item">
                                <strong>{member.name}</strong>
                                <div className="reg-details">
                                    <span>Reg No: {member.regNo}</span> | <span>Phone: {member.phone}</span>
                                </div>
                                <div className="reg-details">
                                    <span>{member.department}</span> | <span>Year: {member.year}</span> | <span>Sec: {member.section}</span>
                                </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="registration-item-actions">
                    <a href={reg.transactionImageUrl} target="_blank" rel="noopener noreferrer" className="button-link">View Screenshot</a>
                    {!reg.verified && <button onClick={() => handleVerify(reg)} className="button primary small">Verify</button>}
                  </div>
                </li>
              )) : <p>No registrations for this event yet.</p>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;