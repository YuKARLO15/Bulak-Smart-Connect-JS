import React, { useState } from 'react';
import '../AdminAnnouncementComponents/AnnouncementForm.css';

const AnnouncementForm = ({ addAnnouncement }) => {
  const [announcement, setAnnouncement] = useState({
    title: '',
    description: '',
    image: '',
  });

  const getPhilippineDateTimeISO = () => {
    const now = new Date();
    const options = { timeZone: 'Asia/Manila' };
    const phTime = new Date(now.toLocaleString('en-US', options));
    return phTime.toISOString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnnouncement = {
      ...announcement,
      id: Date.now(),
      date: getPhilippineDateTimeISO(), // ✅ set PH time automatically
    };
    addAnnouncement(newAnnouncement);
    setAnnouncement({ title: '', description: '', image: '' });
  };

  return (
    <form name="announcementform" className="announcementform" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={announcement.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={announcement.description}
        onChange={handleChange}
        required
      />
      {/* Removed datetime-local input since system sets time automatically */}
      <button type="submit">Post Announcement</button>
    </form>
  );
};

export default AnnouncementForm;
