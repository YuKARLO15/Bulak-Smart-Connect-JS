import React from 'react';
import AnnouncementPost from './AnnouncementPost';
import './AnnouncementFeed.css';

const AnnouncementFeed = ({ announcements, onEdit }) => {
  return (
    <div className="announcement-feed">
      {announcements.map((announcement) => (
        <AnnouncementPost
          key={announcement.id}
          announcement={announcement}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default AnnouncementFeed;
