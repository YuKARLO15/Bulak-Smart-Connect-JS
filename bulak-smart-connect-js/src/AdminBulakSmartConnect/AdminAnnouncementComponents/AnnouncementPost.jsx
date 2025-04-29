import React from "react";
import '../AdminAnnouncementComponents/AnnouncementPost.css';

const AnnouncementPost = ({ announcement }) => {
  return (
    <div className="announcement-post">
      <h3>{announcement.title}</h3>
      <p>{announcement.description}</p>
      <small>{announcement.date}</small>
      {announcement.image && <img src={announcement.image} alt="Announcement" />}
    </div>
  );
};

export default AnnouncementPost;