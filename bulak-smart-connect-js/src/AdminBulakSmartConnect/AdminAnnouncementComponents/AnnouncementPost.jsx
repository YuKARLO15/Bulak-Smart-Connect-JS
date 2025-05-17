import React from 'react';
import './AnnouncementPost.css';

const AnnouncementPost = ({ announcement, onEdit }) => {
  return (
    <div className="announcement-post">
      <h3>{announcement.title}</h3>
      <p>{announcement.description}</p>
      <small>{announcement.date}</small>
      {announcement.image && <img src={announcement.image} alt="Announcement" />}
      <button className="edit-btn" onClick={() => onEdit(announcement)}>Edit</button>
    </div>
  );
};

export default AnnouncementPost;