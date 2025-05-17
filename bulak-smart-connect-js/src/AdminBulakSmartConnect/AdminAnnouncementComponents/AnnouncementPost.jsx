import React from 'react';
import './AnnouncementPost.css';

const AnnouncementPost = ({ announcement, onEdit }) => {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      timeZone: 'Asia/Manila',       // ✅ Philippine timezone
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-PH', options);
  };

  return (
    <div className="announcement-post">
      <h3>{announcement.title}</h3>
      <p>{announcement.description}</p>
      <small>Date Posted: {formatDateTime(announcement.date)}</small>
      <button className="announcement-edit-btn" onClick={() => onEdit(announcement)}>
        Edit
      </button>
      {announcement.image && <img src={announcement.image} alt="Announcement" />}
    </div>
  );
};

export default AnnouncementPost;
