import React, { useState, useEffect } from 'react';
//import './EditAnnouncementModal.css';

const EditAnnouncementModal = ({ isOpen, onClose, announcementData, onSave }) => {
  // Use a more defensive initialization
  const [editedAnnouncement, setEditedAnnouncement] = useState({
    title: '',
    description: '',
    date: '',
    image: ''
  });

  // Use a more robust approach to update the state
  useEffect(() => {
    if (isOpen && announcementData) {
      setEditedAnnouncement({
        id: announcementData.id || '',
        title: announcementData.title || '',
        description: announcementData.description || '',
        date: announcementData.date || '',
        image: announcementData.image || ''
      });
    }
  }, [isOpen, announcementData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAnnouncement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedAnnouncement);
    onClose();
  };

  // Early return if modal is not open
  if (!isOpen) return null;

  // Defensive rendering - ensure all accessed properties have default values
  const title = editedAnnouncement?.title || '';
  const description = editedAnnouncement?.description || '';
  const date = editedAnnouncement?.date || '';

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Edit Announcement</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            value={description}
            onChange={handleChange}
            required
          />
          <input
            type="datetime-local"
            name="date"
            value={date}
            onChange={handleChange}
          />
          <div className="modal-actions">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAnnouncementModal;