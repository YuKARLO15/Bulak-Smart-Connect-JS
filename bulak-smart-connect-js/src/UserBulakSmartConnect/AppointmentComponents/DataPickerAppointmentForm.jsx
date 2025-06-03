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

  return (
    <div className="DatePickerInputAppointForm" ref={inputRef}>
      <div
        className="DateInputWrapperAppointForm"
        onClick={() => setShowCalendar(true)}
        tabIndex={0}
        role="button"
        aria-label="Select date"
      >
        <input
          type="text"
          className="DateInputAppointForm"
          value={formatDate(value)}
          readOnly
          placeholder="Select date"
          style={{ cursor: 'pointer', backgroundColor: '#f8fafc' }}
        />
        <span className="CalendarIconAppointForm">
          <CalendarTodayIcon fontSize="small" />
        </span>
      </div>
      {showCalendar && (
        <div className="CalendarPopupAppointForm">
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
      {error && <span className="ErrorTextAppointForm">{error}</span>}
    </div>
  );
}