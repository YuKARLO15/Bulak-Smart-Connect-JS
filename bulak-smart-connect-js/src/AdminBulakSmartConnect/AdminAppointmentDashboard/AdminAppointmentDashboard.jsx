import React, { useState } from 'react';
import './AdminAppointmentDashboard.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminAppointmentDashboard = () => {
  // Empty data arrays
  const appointmentsData = [];
  const chartData = [];

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calendar navigation functions
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Generate calendar days
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of month and days in month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Empty cells for days before first of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div key={`day-${i}`} className="calendar-day">
          {i}
        </div>
      );
    }

    return days;
  };

  // Get month name and year
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthName = monthNames[currentMonth.getMonth()];
  const year = currentMonth.getFullYear();

  return (
    <div className="admin-appointment-dashboard">
      <div className="appointment-header">
        <h1>APPOINTMENT</h1>
        <button className="qr-code-button">
          <FaQrcode /> Scan QR Code
        </button>
      </div>

      <div className="appointment-content">
        <div className="top-row">
          {/* Current Queue Card */}
          <div className="current-queue-card">
            <h2>CURRENT QUEUE</h2>
            <div className="current-queue-number"></div>
            <div className="next-queue">
              Next on Queue
              <div className="next-queue-number"></div>
            </div>
          </div>

          {/* Available Slots Card */}
          <div className="available-slots-card">
            <h2>AVAILABLE SLOTS</h2>
            <div className="calendar-container">
              <div className="calendar-header">
                <button onClick={prevMonth} className="calendar-nav-btn">
                  &lt;
                </button>
                <div className="calendar-title">{`${monthName} ${year}`}</div>
                <button onClick={nextMonth} className="calendar-nav-btn">
                  &gt;
                </button>
              </div>
              <div className="calendar-weekdays">
                <div>Su</div>
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
              </div>
              <div className="calendar-days">{generateCalendar()}</div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="appointment-chart-card">
            <div className="chart-legend">
              <div className="legend-item">
                <span className="walk-in-dot"></span> Walk In
              </div>
              <div className="legend-item">
                <span className="appointment-dot"></span> Appointment
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="walkIn" fill="#1C4D5A" />
                <Bar dataKey="appointment" fill="#8DC3A7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booked Appointments Section */}
        <div className="booked-appointments-section">
          <div className="section-header">
            <h2>Booked Appointments</h2>
            <div className="filter-control">
              <button className="filter-button">
                <span className="filter-icon">⌄</span>
              </button>
            </div>
          </div>

          <div className="appointments-list">
            {appointmentsData.length === 0 ? (
              <div className="no-appointments">No appointments available</div>
            ) : (
              appointmentsData.map((appointment, index) => (
                <div key={index} className="appointment-card">
                  <div className="appointment-type-container">
                    <div className="appointment-type">{appointment.type}</div>
                    <div className="appointment-date">{appointment.date}</div>
                  </div>
                  <div className="appointment-client">{appointment.clientName}</div>
                  <div className="appointment-actions">
                    <div className="appointment-id">{appointment.id}</div>
                    <button className="see-more-btn">See More</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointmentDashboard;
