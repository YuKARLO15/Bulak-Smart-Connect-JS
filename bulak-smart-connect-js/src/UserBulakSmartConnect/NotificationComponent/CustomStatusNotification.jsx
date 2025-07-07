import React from 'react';
import { Box, Typography, Button } from '@mui/material';

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
  if (!status && !statusMessage) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1400,
        minWidth: 320,
        maxWidth: 400,
        bgcolor: '#fff',
        boxShadow: 6,
        borderRadius: 2,
        p: 2,
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
            fontSize: '1.1rem',
          }}
        >
          Status: {status} {id && `(Application ID: ${id})`}{' '}
        </Typography>
        {onClose && (
          <Button size="small" onClick={onClose} sx={{ minWidth: 0, color: '#888' }}>
            ×
          </Button>
        )}
      </Box>
      {statusMessage && (
        <Typography
          sx={{
            fontSize: '0.95rem',
            mt: 1,
            p: 1,
            backgroundColor: '#f5f5f5',
            borderLeft: '3px solid #1c4d5a',
            borderRadius: 1,
            color: '#1c4d5a',
          }}
        >
          Message from Administrator: {statusMessage}
        </Typography>
      )}
      {showBookAppointment && (
        <Box sx={{ mt: 2, borderTop: '1px solid #ccc', pt: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.9rem',
              mb: 1,
              color: '#1c4d5a',
            }}
          >
            You may book an appointment to pick up your document for faster transaction.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={onBookAppointment}
            sx={{
              backgroundColor: '#f5f5f5',
              color: '#1c4d5a',
              fontWeight: '600 !important',
              border: '1px solid #1c4d5a',
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
