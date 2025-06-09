import React, { useState, useEffect } from 'react';
import AnnouncementForm from './AnnouncementForm';
import AnnouncementFeed from './AnnouncementFeed';
import EditAnnouncementModal from './EditAnnouncementModal';
import { announcementService } from '../../services/announcementService';
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
  const [loading, setLoading] = useState(false);

  // Load announcements from backend on component mount
  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAllAnnouncements();
      
      // Transform backend data to match your existing format
      const transformedData = data.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        description: announcement.description,
        date: announcement.createdAt, // Use createdAt from backend as date
        image: announcement.image || '',
      }));
      
      // Only update if we got data from backend
      if (transformedData.length > 0) {
        setAnnouncements(transformedData);
      }
    } catch (error) {
      console.error('Failed to load announcements:', error);
      // Keep your existing fallback data if API fails
      console.log('Using fallback data due to API error');
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async (newAnnouncement) => {
    try {
      // Send to backend first
      const createdAnnouncement = await announcementService.createAnnouncement(newAnnouncement);
      
      // Transform to match your existing format
      const transformedAnnouncement = {
        id: createdAnnouncement.id,
        title: createdAnnouncement.title,
        description: createdAnnouncement.description,
        date: createdAnnouncement.createdAt,
        image: createdAnnouncement.image || '',
      };
      
      // Update state (keep your existing logic)
      setAnnouncements([transformedAnnouncement, ...announcements]);
    } catch (error) {
      console.error('Failed to create announcement:', error);
      // Fallback to your original logic if API fails
      const fallbackAnnouncement = {
        ...newAnnouncement,
        id: Date.now(),
        date: new Date().toISOString(),
      };
      setAnnouncements([fallbackAnnouncement, ...announcements]);
    }
  };

  const handleEditClick = announcement => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const saveEditedAnnouncement = async (editedAnnouncement) => {
    try {
      // Send update to backend
      const updatedAnnouncement = await announcementService.updateAnnouncement(
        editedAnnouncement.id,
        {
          title: editedAnnouncement.title,
          description: editedAnnouncement.description,
          image: editedAnnouncement.image
        }
      );
      
      // Transform and update state (keep your existing logic)
      const transformedAnnouncement = {
        id: updatedAnnouncement.id,
        title: updatedAnnouncement.title,
        description: updatedAnnouncement.description,
        date: updatedAnnouncement.updatedAt,
        image: updatedAnnouncement.image || '',
      };
      
      setAnnouncements(prev =>
        prev.map(a => (a.id === transformedAnnouncement.id ? transformedAnnouncement : a))
      );
    } catch (error) {
      console.error('Failed to update announcement:', error);
      // Fallback to your original logic if API fails
      setAnnouncements(prev =>
        prev.map(a => (a.id === editedAnnouncement.id ? editedAnnouncement : a))
      );
    }
    
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  // DELETE handler to remove an announcement from state
  const handleDelete = async (id) => {
    try {
      // Send delete to backend
      await announcementService.deleteAnnouncement(id);
      
      // Update state (keep your existing logic)
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      // Fallback to your original logic if API fails
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }
    
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  return (
    <div className="announcement-container">
      <h2 className='label-announcement'>Admin Announcements
        <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </h2>

      
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading announcements...
        </div>
      )}
      
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
