import React, { useState, useEffect } from 'react';
// Import services
import { coreTeam, imageUploader } from '../../services/firebase';
// Import icons for a cleaner UI
import { FiUser, FiBriefcase, FiLinkedin, FiUploadCloud, FiEdit, FiTrash2, FiPlus, FiSave } from 'react-icons/fi';
// Import the component's CSS
import './ManageCoreTeam.css';

const ManageCoreTeam = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({ name: '', role: '', linkedin: '', imageUrl: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const data = await coreTeam.getAll();
    setMembers(data);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return; // Basic validation
    
    setLoading(true);
    let imageUrl = formData.imageUrl;

    if (imageFile) {
      imageUrl = await imageUploader.upload(imageFile, `core-team/${imageFile.name}`);
    }
    
    const dataToSave = { ...formData, imageUrl };

    try {
      if (isEditing) {
        await coreTeam.update(isEditing, dataToSave);
      } else {
        await coreTeam.create(dataToSave);
      }
    } catch (error) {
      console.error("Failed to save member:", error);
      // You could add a user-facing error state here
    }

    resetForm();
    fetchMembers();
    setLoading(false);
  };

  const handleEdit = (member) => {
    window.scrollTo(0, 0); // Scroll to the top to see the form
    setIsEditing(member.id);
    setFormData({ name: member.name, role: member.role, linkedin: member.linkedin, imageUrl: member.imageUrl });
    setImagePreview(member.imageUrl);
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await coreTeam.delete(id);
        fetchMembers();
      } catch (error) {
        console.error("Failed to delete member:", error);
      }
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({ name: '', role: '', linkedin: '', imageUrl: '' });
    setImageFile(null);
    setImagePreview(null);
    // This is important to clear the file input's value
    if(document.getElementById('file-input')) {
      document.getElementById('file-input').value = "";
    }
  };

  const FormHeader = isEditing ? 'Edit Team Member' : 'Add New Member';
  const SubmitIcon = isEditing ? <FiSave /> : <FiPlus />;

  return (
    <div className="manage-team-container">
      {/* --- FORM SECTION --- */}
      <div className="form-card">
        <h3>{FormHeader}</h3>
        <form onSubmit={handleSubmit} className="team-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <FiUser />
                <input id="name" type="text" placeholder="" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="role">Role / Position</label>
              <div className="input-wrapper">
                <FiBriefcase />
                <input id="role" type="text" placeholder="e.g., Lead Developer" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn Profile URL</label>
            <div className="input-wrapper">
              <FiLinkedin />
              <input id="linkedin" type="url" placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
            </div>
          </div>
          
          <div className="form-group">
            <label>Profile Picture</label>
            <div className="file-input-wrapper">
              <input type="file" id="file-input" onChange={handleFileChange} accept="image/*" />
              <label htmlFor="file-input" className="file-input-label">
                <FiUploadCloud />
                <span>{imageFile ? imageFile.name : 'Click to upload image'}</span>
              </label>
              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="button primary" disabled={loading}>
              {SubmitIcon}
              {loading ? 'Saving...' : (isEditing ? 'Update Member' : 'Add Member')}
            </button>
            {isEditing && (
              <button type="button" className="button secondary" onClick={resetForm} disabled={loading}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- MEMBER LIST SECTION --- */}
      <div className="member-list-section">
        <h3>Existing Team Members</h3>
        <div className="member-grid">
          {members.map(member => (
            <div key={member.id} className="member-card">
              <img src={member.imageUrl || 'https://via.placeholder.com/150'} alt={member.name} className="member-photo" />
              <div className="member-info">
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
              <div className="member-actions">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="action-button linkedin" aria-label="LinkedIn Profile">
                  <FiLinkedin />
                </a>
                <button onClick={() => handleEdit(member)} className="action-button edit" aria-label="Edit Member">
                  <FiEdit />
                </button>
                <button onClick={() => handleDelete(member.id)} className="action-button delete" aria-label="Delete Member">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageCoreTeam;