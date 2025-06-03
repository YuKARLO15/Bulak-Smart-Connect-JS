import React, { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { WifiOff as WifiOffIcon, Wifi as WifiIcon } from '@mui/icons-material';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [showOnlineAlert, setShowOnlineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineAlert(true);
      setTimeout(() => setShowOnlineAlert(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show offline alert if starting offline
    if (!navigator.onLine) {
      setShowOfflineAlert(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      <Snackbar
        open={showOfflineAlert && !isOnline}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ 
          top: 20,
          zIndex: 9999 
        }}
      >
        <Alert 
          severity="warning" 
          icon={<WifiOffIcon />}
          sx={{ width: '100%' }}
        >
          You're offline. Some features may not be available.
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={showOnlineAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ 
          top: 20,
          zIndex: 9999 
        }}
      >
        <Alert 
          severity="success" 
          icon={<WifiIcon />}
          sx={{ width: '100%' }}
        >
          You're back online!
        </Alert>
      </Snackbar>
    </>
  );
};

export default OfflineIndicator;