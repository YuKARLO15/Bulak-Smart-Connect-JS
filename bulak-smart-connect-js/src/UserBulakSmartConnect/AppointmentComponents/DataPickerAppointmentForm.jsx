import React, { useRef, useState } from 'react';
import Calendar from 'react-calendar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import 'react-calendar/dist/Calendar.css';
import './AppointmentContent.css';

export default function DatePickerInputAppointForm({ value, onChange, error }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const inputRef = useRef();
    
  React.useEffect(() => {
    function handleClick(e) {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) document.addEventListener('mousedown', handleClick);
    return () =>
      document.removeEventListener('mousedown', handleClick);
  }, [showCalendar]);

  function formatDate(date) {
    if (!date) return '';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Updated styles to match the other inputs in the form
  const containerStyle = {
    position: 'relative',
    width: '100%',
  };

  const inputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    cursor: 'pointer',
    height: '90px !important', // Match height of other inputs
    overflow: 'hidden'
    
  };

  return (
    <div className="DatePickerInputAppointForm" ref={inputRef} style={containerStyle}>
      <input
        type="text"
        className="DateInputAppointForm"
        value={formatDate(value)}
        readOnly
        placeholder="Select date"
        onClick={() => setShowCalendar(true)}
        style={{
          cursor: 'pointer',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          width: '100%',
          height: '45px',
          padding: '0 12px',
          fontSize: '14px',
          outline: 'none'
        }}
      />
      <span 
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#6b7280',
          pointerEvents: 'none' // Prevents icon from blocking clicks
        }}
      >
        <CalendarTodayIcon fontSize="small" />
      </span>
      
      {showCalendar && (
        <div className="CalendarPopupAppointForm" style={{
          position: 'absolute',
          zIndex: 100,
          marginTop: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'white'
        }}>
          <Calendar
            value={value}
            onChange={date => {
              setShowCalendar(false);
              onChange(date);
            }}
            tileDisabled={({ date }) =>
              date < new Date(new Date().setHours(0, 0, 0, 0)) ||
              date.getDay() === 0 ||
              date.getDay() === 6
            }
          />
        </div>
      )}
      {error && <span className="ErrorTextAppointForm" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{error}</span>}
    </div>
  );
}