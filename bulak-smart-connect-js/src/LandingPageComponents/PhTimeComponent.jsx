import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import './PhTimeComponent.css';

const PhTimeComponent = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatDateTime = date => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZone: 'Asia/Manila',
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <Box className="PhClockContainer">
      <Box className="PhClockWrapper">
        <Typography variant="body1" className="PhClockTitle">
          Philippine Standard Time:
        </Typography>
        <Typography variant="body1" className="PhClockTime">
          {formatDateTime(time)}
        </Typography>
      </Box>
    </Box>
  );
};

export default PhTimeComponent;
