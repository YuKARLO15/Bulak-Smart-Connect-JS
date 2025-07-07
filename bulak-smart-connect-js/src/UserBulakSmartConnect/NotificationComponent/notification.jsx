import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNotification } from '../../services/notificationContext.jsx';

const GlobalNotification = () => {
  const { notif } = useNotification();

  return (
    <Snackbar open={!!notif} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert severity="info" sx={{ width: '100%' }}>
        {notif}
      </Alert>
    </Snackbar>
  );
};

export default GlobalNotification;
