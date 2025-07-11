import React from 'react';
import { Box, Typography, Button, useMediaQuery, useTheme } from '@mui/material';

const getStatusColor = status => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'green';
    case 'ready for pickup':
      return '#4caf50';
    case 'pending':
      return '#ff9800';
    case 'processing':
      return '#2196f3';
    case 'submitted':
      return '#2196f3';
    case 'declined':
    case 'decline':
    case 'rejected':
      return 'red';
    case 'requires additional info':
      return '#ff8c00';
    case 'cancelled':
      return '#d32f2f';
    default:
      return '#184a5b';
  }
};

const CustomStatusNotification = ({
  status,
  id,
  statusMessage,
  onBookAppointment,
  showBookAppointment,
  onClose,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallMobile = useMediaQuery('(max-width:400px)');
  
  if (!status && !statusMessage) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: isMobile ? '16px' : '32px',
        right: isMobile ? '16px' : '32px',
        left: isMobile ? '16px' : 'auto',
        zIndex: 1400,
        minWidth: isMobile ? 'auto' : '320px',
        maxWidth: isMobile ? '100%' : '400px',
        width: isMobile ? 'calc(100% - 32px)' : 'auto',
        bgcolor: '#fff',
        boxShadow: 6,
        borderRadius: 2,
        p: isSmallMobile ? 1.5 : 2,
        borderLeft: `6px solid ${getStatusColor(status)}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          sx={{
            fontWeight: 'bold',
            color: getStatusColor(status),
            fontSize: isSmallMobile ? '0.95rem' : '1.1rem',
          }}
        >
          Status: {status} {id && `(Application ID: ${id})`}{' '}
        </Typography>
        {onClose && (
          <Button 
            size="small" 
            onClick={onClose} 
            sx={{ 
              minWidth: 0, 
              color: '#888',
              padding: isSmallMobile ? '0px 6px' : '4px 8px',
              fontSize: isSmallMobile ? '1.2rem' : '1.5rem',
            }}
          >
            ×
          </Button>
        )}
      </Box>
      {statusMessage && (
        <Typography
          sx={{
            fontSize: isSmallMobile ? '0.85rem' : '0.95rem',
            mt: isSmallMobile ? 0.5 : 1,
            p: isSmallMobile ? 0.75 : 1,
            backgroundColor: '#f5f5f5',
            borderLeft: '3px solid #1c4d5a',
            borderRadius: 1,
            color: '#1c4d5a',
            wordBreak: 'break-word',
          }}
        >
          Message from Administrator: {statusMessage}
        </Typography>
      )}
      {showBookAppointment && (
        <Box sx={{ mt: isSmallMobile ? 1 : 2, borderTop: '1px solid #ccc', pt: isSmallMobile ? 0.75 : 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: isSmallMobile ? '0.8rem' : '0.9rem',
              mb: isSmallMobile ? 0.75 : 1,
              color: '#1c4d5a',
            }}
          >
            You may book an appointment to pick up your document for faster transaction.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            fullWidth={isMobile}
            onClick={onBookAppointment}
            sx={{
              backgroundColor: '#f5f5f5',
              color: '#1c4d5a',
              fontWeight: '600 !important',
              border: '1px solid #1c4d5a',
              padding: isSmallMobile ? '4px 8px' : '6px 12px',
              fontSize: isSmallMobile ? '0.75rem' : '0.85rem',
              '&:hover': {
                backgroundColor: '#0f3a47',
                color: '#f5f5f5',
              },
            }}
          >
            Book Appointment
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CustomStatusNotification;