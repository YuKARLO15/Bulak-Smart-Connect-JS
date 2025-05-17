import React, { useState } from 'react';
import AnnouncementForm from './AnnouncementForm';
import AnnouncementFeed from './AnnouncementFeed';
import EditAnnouncementModal from './EditAnnouncementModal';
import '../AdminAnnouncementComponents/AdminAnnouncement.css';
import NavBar from '../../NavigationComponents/NavSide';

const AdminAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'System Update',
      description: 'New features available!',
      date: '2025-04-20T10:00',
      image: '',
    },
    {
      id: 2,
      title: 'Team Meeting',
      description: 'Scheduled for Friday 10 AM',
      date: '2025-04-18T10:00',
      image: '',
    },
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const addAnnouncement = newAnnouncement => {
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  const handleEditClick = announcement => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const saveEditedAnnouncement = editedAnnouncement => {
    setAnnouncements(prev =>
      prev.map(a => (a.id === editedAnnouncement.id ? editedAnnouncement : a))
    );
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  // DELETE handler to remove an announcement from state
  const handleDelete = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  return (
    <div className="announcement-container">
      <h2>Bulak LGU Smart Announcements</h2>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="announcement-main">
        <AnnouncementFeed announcements={announcements} onEdit={handleEditClick} />
        <AnnouncementForm addAnnouncement={addAnnouncement} />
      </div>

      <EditAnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        announcementData={selectedAnnouncement}
        onSave={saveEditedAnnouncement}
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default AdminAnnouncement;
