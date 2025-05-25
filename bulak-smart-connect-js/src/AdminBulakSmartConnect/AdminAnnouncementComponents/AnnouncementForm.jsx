import React, { useState } from 'react';
import '../AdminAnnouncementComponents/AnnouncementForm.css';

const AnnouncementForm = ({ addAnnouncement }) => {
  const [announcement, setAnnouncement] = useState({
    title: '',
    description: '',
    image: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for backend API
      const announcementData = {
        title: announcement.title,
        description: announcement.description,
        image: announcement.image,
        createdBy: 'admin', // You can get this from auth context if needed
      };

      // Pass to parent (which handles API call)
      await addAnnouncement(announcementData);

      // Reset form on successful submission
      setAnnouncement({ title: '', description: '', image: '' });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
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
        disabled={isSubmitting}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={announcement.description}
        onChange={handleChange}
        required
        disabled={isSubmitting}
      />
      {/* Uncomment if you want to include image URL input, di ako sure eh, or image upload might need changes depends kasi varchar ito eh */}
      {/*<input
        type="url"
        name="image"
        placeholder="Image URL (optional)"
        value={announcement.image}
        onChange={handleChange}
        disabled={isSubmitting}
      />*/}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Post Announcement'}
      </button>
    </form>
  );
};

export default AnnouncementForm;
