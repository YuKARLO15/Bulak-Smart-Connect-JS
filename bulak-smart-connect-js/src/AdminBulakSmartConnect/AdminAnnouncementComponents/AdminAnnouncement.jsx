import React, { useState } from 'react';
import AnnouncementForm from './AnnouncementForm';
import AnnouncementFeed from './AnnouncementFeed';
import '../AdminAnnouncementComponents/AdminAnnouncement.css';

const AdminAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'System Update',
      description: 'New features available!',
      date: '2025-04-20',
      image: '',
    },
    {
      id: 2,
      title: 'Team Meeting',
      description: 'Scheduled for Friday 10 AM',
      date: '2025-04-18',
      image: '',
    },
  ]);

  const addAnnouncement = newAnnouncement => {
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  return (
    <div className="announcement-container">
      <h2>Bulak LGU Smart Announcements </h2>
      <div className="announcement-main">
        <AnnouncementFeed announcements={announcements} />
        <AnnouncementForm addAnnouncement={addAnnouncement} />
      </div>
    </div>
  );
};

export default AdminAnnouncement;
