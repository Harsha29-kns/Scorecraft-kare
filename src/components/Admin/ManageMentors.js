import React, { useState, useEffect } from 'react';
// Import services
import { mentors, imageUploader } from '../../services/firebase';
// Import icons for a polished UI
import { FiUser, FiBriefcase, FiLinkedin, FiUploadCloud, FiEdit, FiTrash2, FiPlus, FiSave } from 'react-icons/fi';
// Import the component's new CSS file
import './ManageMentors.css';

const ManageMentors = () => {
  const [mentorList, setMentorList] = useState([]);
  const [formData, setFormData] = useState({ name: '', role: '', linkedin: '', imageUrl: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    const data = await mentors.getAll();
    setMentorList(data);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a temporary URL for the preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return; // Simple validation

    setLoading(true);
    let imageUrl = formData.imageUrl;

    if (imageFile) {
      // It's good practice to organize uploads into folders
      imageUrl = await imageUploader.upload(imageFile, `mentors/${imageFile.name}`);
    }
    
    const dataToSave = { ...formData, imageUrl };

    try {
      if (isEditing) {
        await mentors.update(isEditing, dataToSave);
      } else {
        await mentors.create(dataToSave);
      }
    } catch (error) {
      console.error("Failed to save mentor:", error);
      // Consider adding a user-facing error message here
    }

    resetForm();
    fetchMentors();
    setLoading(false);
  };

  const handleEdit = (mentor) => {
    window.scrollTo(0, 0); // Scroll to top to make the form visible
    setIsEditing(mentor.id);
    setFormData({ name: mentor.name, role: mentor.role, linkedin: mentor.linkedin, imageUrl: mentor.imageUrl });
    setImagePreview(mentor.imageUrl);
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    
    if (window.confirm("Are you sure you want to delete this mentor?")) {
      try {
        await mentors.delete(id);
        fetchMentors();
      } catch (error) {
        console.error("Failed to delete mentor:", error);
      }
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({ name: '', role: '', linkedin: '', imageUrl: '' });
    setImageFile(null);
    setImagePreview(null);
    // Clear the file input visually
    const fileInput = document.getElementById('mentor-file-input');
    if(fileInput) {
      fileInput.value = "";
    }
  };

  const FormHeader = isEditing ? 'Edit Mentor Details' : 'Add New Mentor';
  const SubmitIcon = isEditing ? <FiSave /> : <FiPlus />;

  return (
    <div className="manage-mentors-container">
      {/* --- FORM SECTION --- */}
      <div className="form-card">
        <h3>{FormHeader}</h3>
        <form onSubmit={handleSubmit} className="mentor-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mentor-name">Full Name</label>
              <div className="input-wrapper">
                <FiUser />
                <input id="mentor-name" type="text" placeholder="" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="mentor-role">Title / Affiliation</label>
              <div className="input-wrapper">
                <FiBriefcase />
                <input id="mentor-role" type="text" placeholder="e.g., Associate Professor" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="mentor-linkedin">LinkedIn Profile URL</label>
            <div className="input-wrapper">
              <FiLinkedin />
              <input id="mentor-linkedin" type="url" placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
            </div>
          </div>
          
          <div className="form-group">
            <label>Profile Picture</label>
            <div className="file-input-wrapper">
              <input type="file" id="mentor-file-input" onChange={handleFileChange} accept="image/*" />
              <label htmlFor="mentor-file-input" className="file-input-label">
                <FiUploadCloud />
                <span>{imageFile ? imageFile.name : 'Click to upload image'}</span>
              </label>
              {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="button primary" disabled={loading}>
              {SubmitIcon}
              {loading ? 'Saving...' : (isEditing ? 'Update Mentor' : 'Add Mentor')}
            </button>
            {isEditing && (
              <button type="button" className="button secondary" onClick={resetForm} disabled={loading}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- MENTOR LIST SECTION --- */}
      <div className="mentor-list-section">
        <h3>Existing Mentors</h3>
        <div className="mentor-grid">
          {mentorList.map(mentor => (
            <div key={mentor.id} className="mentor-card">
              <img src={mentor.imageUrl || 'https://placehold.co/150x150/E0F7FF/0B7994?text=Mentor'} alt={mentor.name} className="mentor-photo" />
              <div className="mentor-info">
                <h4>{mentor.name}</h4>
                <p>{mentor.role}</p>
              </div>
              <div className="mentor-actions">
                <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="action-button linkedin" aria-label="LinkedIn Profile">
                  <FiLinkedin />
                </a>
                <button onClick={() => handleEdit(mentor)} className="action-button edit" aria-label="Edit Mentor">
                  <FiEdit />
                </button>
                <button onClick={() => handleDelete(mentor.id)} className="action-button delete" aria-label="Delete Mentor">
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

export default ManageMentors;
