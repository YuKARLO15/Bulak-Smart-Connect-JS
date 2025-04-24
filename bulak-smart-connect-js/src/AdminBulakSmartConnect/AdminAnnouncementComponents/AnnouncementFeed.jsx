import React from "react";
import AnnouncementPost from "./AnnouncementPost";
import '../AdminAnnouncementComponents/AnnouncementFeed.css';

const AnnouncementFeed = ({ announcements }) => {
  return (
    <div className="announcement-feed">
      {announcements.map((announcement) => (
        <AnnouncementPost key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
};

export default AnnouncementFeed;