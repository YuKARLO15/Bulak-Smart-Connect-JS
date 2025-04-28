import React, { useState } from "react";
import '../AdminAnnouncementComponents/AnnouncementForm.css';

const AnnouncementForm = ({ addAnnouncement }) => {
  const [announcement, setAnnouncement] = useState({ title: "", description: "", date: "", image: "" });

  const handleChange = (e) => {
    setAnnouncement({ ...announcement, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnnouncement = { ...announcement, id: Date.now() };
    addAnnouncement(newAnnouncement);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required></textarea>
      <input type="datetime-local" name="date" onChange={handleChange} />
      <button type="submit">Post Announcement</button>
    </form>
  );
};

export default AnnouncementForm;