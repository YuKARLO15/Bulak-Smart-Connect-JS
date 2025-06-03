import React from 'react';
import { Button, Snackbar, Alert, Box, IconButton } from '@mui/material';
import { Download as DownloadIcon, Close as CloseIcon } from '@mui/icons-material';
import { usePWA } from '../hooks/usePWA';

const InstallPrompt = () => {
  const { showInstallPrompt, installPWA } = usePWA();
  const [dismissed, setDismissed] = React.useState(false);

  if (!showInstallPrompt || dismissed) return null;

  return (
    <Snackbar
      open={showInstallPrompt}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ 
        bottom: { xs: 20, md: 80 },
        '& .MuiSnackbarContent-root': {
          backgroundColor: '#184a5b',
          color: 'white',
          minWidth: { xs: '90vw', md: 'auto' }
        }
      }}
    >
      <Alert 
        severity="info" 
        sx={{ 
          width: '100%', 
          backgroundColor: '#184a5b', 
          color: 'white',
          '& .MuiAlert-icon': { color: 'white' },
          '& .MuiAlert-message': { 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%'
          }
        }}
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button 
              color="inherit" 
              size="small" 
              onClick={installPWA}
              startIcon={<DownloadIcon />}
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
              variant="outlined"
            >
              Install
            </Button>
            <IconButton 
              size="small" 
              onClick={() => setDismissed(true)}
              sx={{ color: 'white' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        Install Bulak Smart Connect for a better experience!
      </Alert>
    </Snackbar>
  );
};

export default InstallPrompt;