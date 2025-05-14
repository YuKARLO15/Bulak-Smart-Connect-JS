import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminAppointmentDashboard.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import NavBar from '../../NavigationComponents/NavSide';



const AdminAppointmentDashboard = () => {
  // Empty data arrays
  const appointmentsData = [];
  const chartData = [];

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sidebar state
  const [navOpen, setNavOpen] = useState(false);

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
      days.push(
        <div key={`empty-${i}`} className="admin-appointment-dashboard-calendar-day empty"></div>
      );
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div key={`day-${i}`} className="admin-appointment-dashboard-calendar-day">
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="admin-appointment-dashboard">
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      {/* Top Navigation Bar */}
      <div className="admin-appointment-dashboard-header">
        <button
          className="admin-appointment-dashboard-menu-icon"
          onClick={() => setNavOpen(true)}
          aria-label="Open navigation"
        >
          <span>&#9776;</span>
        </button>
        <h1 className="admin-appointment-dashboard-title">APPOINTMENT</h1>
      </div>

      <div className="admin-appointment-dashboard-content">
        <div className="admin-appointment-dashboard-top-row">
          {/* Current Queue Card */}
          <div className="admin-appointment-dashboard-current-queue-card">
            <h2 className="admin-appointment-dashboard-card-title">CURRENT QUEUE</h2>
            <div className="admin-appointment-dashboard-current-queue-number"></div>
            <div className="admin-appointment-dashboard-next-queue">
              Next on Queue
              <div className="admin-appointment-dashboard-next-queue-number"></div>
            </div>
          </div>

          {/* Available Slots Card */}
          <div className="admin-appointment-dashboard-available-slots-card">
            <h2 className="admin-appointment-dashboard-card-title">AVAILABLE SLOTS</h2>
            <div className="admin-appointment-dashboard-calendar-container">
              <div className="admin-appointment-dashboard-calendar-header">
                <button
                  onClick={prevMonth}
                  className="admin-appointment-dashboard-calendar-nav-btn"
                >
                  &lt;
                </button>
                <div className="admin-appointment-dashboard-calendar-title">{`${monthName} ${year}`}</div>
                <button
                  onClick={nextMonth}
                  className="admin-appointment-dashboard-calendar-nav-btn"
                >
                  &gt;
                </button>
              </div>
              <div className="admin-appointment-dashboard-calendar-weekdays">
                <div>Su</div>
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
              </div>
              <div className="admin-appointment-dashboard-calendar-days">{generateCalendar()}</div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="admin-appointment-dashboard-chart-card">
            <div className="admin-appointment-dashboard-chart-legend">
              <div className="admin-appointment-dashboard-legend-item">
                <span className="admin-appointment-dashboard-walk-in-dot"></span> Walk In
              </div>
              <div className="admin-appointment-dashboard-legend-item">
                <span className="admin-appointment-dashboard-appointment-dot"></span> Appointment
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
        <div className="admin-appointment-dashboard-booked-appointments-section">
          <div className="admin-appointment-dashboard-section-header">
            <h2 className="admin-appointment-dashboard-section-title">Booked Appointments</h2>
            <div className="admin-appointment-dashboard-filter-control">
              <button className="admin-appointment-dashboard-filter-button">
                <span className="admin-appointment-dashboard-filter-icon">⌄</span>
              </button>
            </div>
          </div>

          <div className="admin-appointment-dashboard-appointments-list">
            {appointmentsData.length === 0 ? (
              <div className="admin-appointment-dashboard-no-appointments">
                No appointments available
              </div>
            ) : (
              appointmentsData.map((appointment, index) => (
                <div key={index} className="admin-appointment-dashboard-appointment-card">
                  <div className="admin-appointment-dashboard-appointment-type-container">
                    <div className="admin-appointment-dashboard-appointment-type">
                      {appointment.type}
                    </div>
                    <div className="admin-appointment-dashboard-appointment-date">
                      {appointment.date}
                    </div>
                  </div>
                  <div className="admin-appointment-dashboard-appointment-client">
                    {appointment.clientName}
                  </div>
                  <div className="admin-appointment-dashboard-appointment-actions">
                    <div className="admin-appointment-dashboard-appointment-id">
                      {appointment.id}
                    </div>
                    <button className="admin-appointment-dashboard-see-more-btn">See More</button>
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
