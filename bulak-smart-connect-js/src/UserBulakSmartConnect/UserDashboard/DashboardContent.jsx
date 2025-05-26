import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DashboardContent.css';
import { Search } from '@mui/icons-material';
import { announcementService } from '../../services/announcementService';

const DashboardContent = () => {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0 });
  const [announcements, setAnnouncements] = useState([]);
  const [announcementLoading, setAnnouncementLoading] = useState(true);
  const [announcementError, setAnnouncementError] = useState(null);

  useEffect(() => {
    loadRecentAnnouncements();
  }, []);

  const loadRecentAnnouncements = async () => {
    try {
      setAnnouncementLoading(true);
      const data = await announcementService.getRecentAnnouncements(3);
      setAnnouncements(data);
      setAnnouncementError(null);
    } catch (error) {
      console.error('Failed to load announcements:', error);
      setAnnouncementError('Failed to load announcements');
      // Keep empty array as fallback
      setAnnouncements([]);
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const handleHover = (e, date) => {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    if (day === 0 || day === 6) {
      setTooltip({
        show: true,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Box className="DashboardContainer">
      <div className="DashboardHeader">
        <Typography variant="h4">Dashboard</Typography>
        <div className="SearchBox">
          <Search className="SearchIcon" />
          <input type="text" placeholder="Search" className="SearchInput" />
        </div>
      </div>
      <div className="TopSection">
        <Card className="DashboardCard">
          <CardContent>
            <Typography variant="h6">Appointments</Typography>
            <div style={{ position: 'relative' }}>
              <Calendar
                className="Calendar"
                tileClassName={({ date }) =>
                  date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : ''
                }
                tileContent={({ date }) => (
                  <div
                    onMouseEnter={e => handleHover(e, date)}
                    onMouseLeave={handleMouseLeave}
                    className="hover-area"
                  ></div>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {tooltip.show && (
          <div
            className="tooltip"
            style={{
              position: 'fixed',
              top: tooltip.y + 10,
              left: tooltip.x + 10,
            }}
          >
            Office is closed
          </div>
        )}

        <Card className="DashboardCard">
          <CardContent>
            <Typography variant="h6">Announcement</Typography>
            <Box className="AnnouncementBox">
              {announcementLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Typography variant="body2" style={{ color: '#666' }}>
                    Loading announcements...
                  </Typography>
                </div>
              ) : announcementError ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Typography variant="body2" style={{ color: '#d32f2f' }}>
                    {announcementError}
                  </Typography>
                </div>
              ) : announcements.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {announcements.map((announcement) => (
                    <div 
                      key={announcement.id} 
                      style={{ 
                        marginBottom: '15px', 
                        padding: '15px', 
                        border: '1px solid #e0e0e0', 
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        style={{ 
                          fontWeight: 'bold',
                          color: '#184a5b',
                          marginBottom: '8px'
                        }}
                      >
                        {announcement.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        style={{ 
                          marginBottom: '8px',
                          lineHeight: '1.5',
                          color: '#333'
                        }}
                      >
                        {announcement.description}
                      </Typography>
                      {announcement.image && (
                        <img 
                          src={announcement.image} 
                          alt="Announcement" 
                          style={{ 
                            maxWidth: '100%', 
                            height: 'auto', 
                            borderRadius: '4px',
                            marginBottom: '8px'
                          }} 
                        />
                      )}
                      <Typography 
                        variant="caption" 
                        style={{ 
                          color: '#666', 
                          fontSize: '0.75rem',
                          fontStyle: 'italic'
                        }}
                      >
                        Posted: {formatDate(announcement.createdAt)}
                      </Typography>
                    </div>
                  ))}
                  
                  {/* Add refresh button */}
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <button
                      onClick={loadRecentAnnouncements}
                      style={{
                        background: '#184a5b',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                      disabled={announcementLoading}
                    >
                      {announcementLoading ? 'Loading...' : 'Refresh'}
                    </button>
                  </div>
                </div>
              ) : (
                <Typography variant="body1" className="AnnouncementText">
                  There are no announcements at the moment.
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </div>
    </Box>
  );
};

export default DashboardContent;
