import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { events, registrations, imageUploader } from '../../services/firebase';
import { FiUser, FiMail, FiHash, FiPhone, FiBriefcase, FiCalendar, FiUsers, FiUploadCloud, FiCreditCard } from 'react-icons/fi';
import './EventRegistration.css';


const createEmptyMember = () => ({
  name: '',
  regNo: '',
  phone: '',
  year: '',
  section: '',
  department: ''
});

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  
  const [formData, setFormData] = useState({
    ...createEmptyMember(),
    email: ''
  });
  
  const [teamMembers, setTeamMembers] = useState([]);
  
  const [transactionImage, setTransactionImage] = useState(null);
  const [transactionImagePreview, setTransactionImagePreview] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifiedCount, setVerifiedCount] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      setLoading(true);
      const eventData = await events.getById(eventId);
      if (eventData) {
        setEvent(eventData);
        if (eventData.teamSize > 1) {
          setTeamMembers(Array(eventData.teamSize - 1).fill(null).map(() => createEmptyMember()));
        }
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    const unsubscribe = registrations.listenVerifiedByEventId(eventId, (verifiedRegs) => {
      setVerifiedCount(verifiedRegs.length);
    });
    return () => unsubscribe();
  }, [eventId]);

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);
  };
  
  const handleTransactionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setTransactionImage(file);
        setTransactionImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (event.amount > 0 && (!transactionImage || !transactionId)) {
      setError("Payment details are required for paid events.");
      setLoading(false);
      return;
    }

    let transactionImageUrl = '';
    if (transactionImage) {
      transactionImageUrl = await imageUploader.upload(transactionImage, `transactions/${eventId}`);
    }

    const registrationData = {
      ...formData,
      eventId,
      eventName: event.title,
      teamMembers,
      transactionId,
      transactionImageUrl,
      registeredAt: new Date().toISOString(),
      verified: false
    };

    try {
      await registrations.create(registrationData);
      navigate('/registration-success', { state: { event } });
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!event) return <div className="loading-screen"><p>Event not found.</p></div>;

  const isRegistrationClosed = new Date() > new Date(event.endTime);
  const isFull = event.capacity && verifiedCount >= event.capacity;
  const slotsLeft = event.capacity ? event.capacity - verifiedCount : 0;

  if (isRegistrationClosed) {
    return <div className="registration-container"><div className="registration-closed-card"><h2>Registrations for this event are closed.</h2></div></div>;
  }
  
  const renderMemberFields = (handler, data, keyPrefix, isTeamLead = false) => (
    <>
        <div className="input-group">
            <label htmlFor={`${keyPrefix}-name`}>Full Name</label>
            <div className="input-wrapper"><FiUser/><input id={`${keyPrefix}-name`} type="text" placeholder="Enter full name" value={data.name} onChange={e => handler('name', e.target.value)} required /></div>
        </div>
        {isTeamLead && (
            <div className="input-group">
                <label htmlFor={`${keyPrefix}-email`}>Email Address</label>
                <div className="input-wrapper"><FiMail/><input id={`${keyPrefix}-email`} type="email" placeholder="Enter email address" value={data.email} onChange={e => handler('email', e.target.value)} required /></div>
            </div>
        )}
        <div className="input-row">
            <div className="input-group">
                <label htmlFor={`${keyPrefix}-regNo`}>Registration No.</label>
                <div className="input-wrapper"><FiHash/><input id={`${keyPrefix}-regNo`} type="text" placeholder="e.g., 21BCE0001" value={data.regNo} onChange={e => handler('regNo', e.target.value)} required /></div>
            </div>
            <div className="input-group">
                <label htmlFor={`${keyPrefix}-phone`}>Mobile Number</label>
                <div className="input-wrapper"><FiPhone/><input id={`${keyPrefix}-phone`} type="tel" placeholder="10-digit number" value={data.phone} onChange={e => handler('phone', e.target.value)} required /></div>
            </div>
        </div>
        <div className="input-row">
            <div className="input-group">
                <label htmlFor={`${keyPrefix}-dept`}>Department</label>
                <div className="input-wrapper"><FiBriefcase/><input id={`${keyPrefix}-dept`} type="text" placeholder="e.g., CSE" value={data.department} onChange={e => handler('department', e.target.value)} required /></div>
            </div>
            <div className="input-group">
                <label htmlFor={`${keyPrefix}-year`}>Year</label>
                <div className="input-wrapper"><FiCalendar/><input id={`${keyPrefix}-year`} type="text" placeholder="e.g., 3rd" value={data.year} onChange={e => handler('year', e.target.value)} required /></div>
            </div>
            <div className="input-group">
                <label htmlFor={`${keyPrefix}-sec`}>Section</label>
                <div className="input-wrapper"><FiUsers/><input id={`${keyPrefix}-sec`} type="text" placeholder="e.g., A" value={data.section} onChange={e => handler('section', e.target.value)} required /></div>
            </div>
        </div>
    </>
  );

  return (
    <div className="registration-container">
      <div className="registration-header-card">
        <h1 className="event-title">{event.title}</h1>
        <p className="event-description">{event.description}</p>
        <div className="capacity-status">
            {isFull ? (
                <span className="status-full">Registrations Full</span>
            ) : (
                event.capacity > 0 && (
                <span className="status-available">
                    Slots Left: <strong>{slotsLeft} / {event.capacity}</strong>
                </span>
                )
            )}
        </div>
      </div>

      {isFull ? (
        <div className="registration-closed-card">
          <h2>This event has reached its maximum capacity.</h2>
          <p>Please contact the event organizers for more information.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="registration-form-card">
          <div className="form-section">
            <h3>Team Lead Details</h3>
            {renderMemberFields((field, value) => setFormData({...formData, [field]: value}), formData, 'lead', true)}
          </div>

          {teamMembers.map((member, i) => (
            <div className="form-section" key={i}>
              <h3>Team Member {i + 1}</h3>
              {renderMemberFields((field, value) => handleTeamMemberChange(i, field, value), member, `member-${i}`)}
            </div>
          ))}

          {event.amount > 0 && (
            <div className="form-section payment-section">
              <h3>Payment: ₹{event.amount}</h3>
              {event.qrCodeUrl && (
                <div className="qr-code-container">
                  <p>Scan the QR code to complete the payment.</p>
                  <img src={event.qrCodeUrl} alt="Payment QR Code" className="qr-code-image" />
                </div>
              )}
              <div className="input-group">
                <label htmlFor="transactionId">Transaction ID</label>
                <div className="input-wrapper"><FiCreditCard/><input id="transactionId" type="text" placeholder="Enter Transaction ID" value={transactionId} onChange={e => setTransactionId(e.target.value)} required /></div>
              </div>
              <div className="input-group">
                <label>Payment Screenshot</label>
                <div className="file-input-wrapper">
                    <input type="file" id="transaction-file" onChange={handleTransactionImageChange} accept="image/*" required />
                    <label htmlFor="transaction-file" className="file-input-label">
                        <FiUploadCloud />
                        <span>{transactionImage ? transactionImage.name : 'Upload Screenshot'}</span>
                    </label>
                    {transactionImagePreview && <img src={transactionImagePreview} alt="Screenshot Preview" className="image-preview"/>}
                </div>
              </div>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Submitting...' : 'Register Now'}</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EventRegistration;
