import React, { useState, useEffect } from 'react';
import './EditAnnouncementModal.css';

const EditAnnouncementModal = ({ isOpen, onClose, announcementData, onSave, onDelete }) => {
  const [editedAnnouncement, setEditedAnnouncement] = useState({
    title: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (isOpen && announcementData) {
      setEditedAnnouncement({
        id: announcementData.id || '',
        title: announcementData.title || '',
        description: announcementData.description || '',
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

  const getCurrentPHDateTimeISO = () => {
    const now = new Date();
    const phTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
    return phTime.toISOString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedWithDate = {
      ...editedAnnouncement,
      date: getCurrentPHDateTimeISO(),
    };
    onSave(updatedWithDate);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      onDelete(editedAnnouncement.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Edit Announcement</h2>
        <form className="announcementeditform" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={editedAnnouncement.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            value={editedAnnouncement.description}
            onChange={handleChange}
            required
          />
          <div className="modal-actions">
            <button type="submit">Save Changes</button>
             <button type="button" onClick={handleDelete} className="delete-button">Delete</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAnnouncementModal;
