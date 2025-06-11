import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Fade
} from '@mui/material';
import { Download as DownloadIcon, Close as CloseIcon } from '@mui/icons-material';
import { usePWA } from '../hooks/usePWA';
import BulakLGULogo from '../LandingPageComponents/LandingPageAssets/BulakLGULogo.png';

const PRIMARY_BLUE = "#1C4D5A";
const Light_Blue = "#d5dcdd"

const InstallPrompt = ({ open, onClose }) => {
  const { installPWA } = usePWA();

  const handleInstall = () => {
    installPWA();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          background: `linear-gradient(135deg, #fff 80%, ${Light_Blue} 100%)`,
          borderRadius: 4,
          boxShadow: 8,
          minWidth: { xs: '90vw', sm: 410 },
          p: 0
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: `1px solid #e0e0e0` }}>
        <Box sx={{

          borderRadius: '50%',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 1,
          width: 50,
          height: 50,
        }}>
          <img src={BulakLGULogo} alt="Bulak LGU Logo" style={{ width: 50, height: 50, objectFit: 'contain' }} />
        </Box>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: PRIMARY_BLUE }}>
          Install Bulak LGU Smart Connect
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#757575' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ py: 3, px: 4 }}>
        <Typography variant="body1" sx={{ color: '#222', mb: 2 }}>
          Enjoy a smoother, faster, and more integrated experience by installing Bulak LGU Smart Connect on your device.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2
          }}
        >
          
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
          Install as a Progressive Web App for the best performance and offline capabilities.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button
          onClick={handleInstall}
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{
            borderRadius: 2,
            px: 4,
            boxShadow: 2,
            fontWeight: 600,
            fontSize: '1rem',
            backgroundColor: PRIMARY_BLUE,
            '&:hover': {
              backgroundColor: '#133740'
            }
          }}
        >
          Install Now
        </Button>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 500,
            ml: 1
          }}
        >
          Maybe Later
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstallPrompt;