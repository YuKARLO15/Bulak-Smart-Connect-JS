import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import logger from '../utils/logger';

const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          logger.log('🔄 Update available notification received');
          setUpdateReady(true);
          setShowUpdate(true);
        }
      });

      // Check for updates on page visibility change
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.update();
          });
        }
      });
    }

    // Auto-check for updates every 5 minutes
    const updateCheckInterval = setInterval(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.update();
        });
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(updateCheckInterval);
  }, []);

  const handleUpdate = () => {
    logger.log('🔄 User triggered app update');
    setShowUpdate(false);
    
    // Force reload to get new version
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    
    // Show again in 10 minutes if not updated
    setTimeout(() => {
      if (updateReady) {
        setShowUpdate(true);
      }
    }, 10 * 60 * 1000); // 10 minutes
  };

  return (
    <Snackbar
      open={showUpdate}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ zIndex: 9999 }}
    >
      <Alert
        severity="info"
        sx={{
          backgroundColor: '#1C4D5A',
          color: 'white',
          '& .MuiAlert-icon': {
            color: 'white',
          },
        }}
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              color="inherit"
              size="small"
              onClick={handleUpdate}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              variant="outlined"
            >
              Update Now
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={handleDismiss}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Later
            </Button>
          </div>
        }
      >
        New version available! Update for the latest features and fixes.
      </Alert>
    </Snackbar>
  );
};

export default UpdateNotification;