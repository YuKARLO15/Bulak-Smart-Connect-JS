import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminAppointmentDashboard.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import NavBar from '../../NavigationComponents/NavSide';
import AllAppointmentsAdmin from './AllAppointmentsAdmin';
import { appointmentService } from '../../services/appointmentService';

const AdminAppointmentDashboard = () => {
  // State for appointments data
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currentQueue, setCurrentQueue] = useState({ current: 0, next: 0 });

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sidebar state
  const [navOpen, setNavOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch appointments data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const appointments = await appointmentService.fetchAllAppointments();
      console.log('Dashboard appointments:', appointments);
      setAppointmentsData(appointments);
      
      // Generate chart data
      const chart = generateChartData(appointments);
      setChartData(chart);
      
      // Calculate current queue
      const queue = calculateCurrentQueue(appointments);
      setCurrentQueue(queue);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const generateChartData = (appointments) => {
    // Group appointments by date for the last 7 days
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayAppointments = appointments.filter(app => {
        const appDate = app.appointmentDate || app.date;
        if (!appDate) return false;
        const appDateString = new Date(appDate).toISOString().split('T')[0];
        return appDateString === dateString;
      });
      
      // For now, categorize by service type - you can adjust this logic
      const certificateServices = ['Birth Certificate', 'Marriage Certificate', 'Death Certificate'];
      
      last7Days.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        walkIn: dayAppointments.filter(app => {
          const service = app.reasonOfVisit || app.type || app.appointmentType;
          return app.isGuest === true; // assuming walk-ins are guests
        }).length,
        appointment: dayAppointments.filter(app => {
          return app.isGuest === false; // scheduled appointments
        }).length
      });
    }
    
    return last7Days;
  };

  const calculateCurrentQueue = (appointments) => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(app => {
      const appDate = app.appointmentDate || app.date;
      if (!appDate) return false;
      const appDateString = new Date(appDate).toISOString().split('T')[0];
      return appDateString === today && (app.status === 'confirmed' || app.status === 'pending');
    });
    
    return {
      current: todayAppointments.length > 0 ? 1 : 0,
      next: todayAppointments.length > 1 ? 2 : 0
    };
  };

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
      const currentDate = new Date(year, month, i);
      const dateString = currentDate.toISOString().split('T')[0];
      const dayAppointments = appointmentsData.filter(app => {
        const appDate = app.appointmentDate || app.date;
        if (!appDate) return false;
        const appDateString = new Date(appDate).toISOString().split('T')[0];
        return appDateString === dateString;
      });
      
      days.push(
        <div key={`day-${i}`} className={`admin-appointment-dashboard-calendar-day ${dayAppointments.length > 0 ? 'has-appointments' : ''}`}>
          {i}
          {dayAppointments.length > 0 && (
            <div className="appointment-indicator">{dayAppointments.length}</div>
          )}
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
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      {/* Top Navigation Bar */}
      <div className="admin-appointment-dashboard-header">
        <button
          className="admin-appointment-dashboard-menu-icon"
          onClick={() => setIsSidebarOpen(true)}
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
            <div className="admin-appointment-dashboard-current-queue-number">{currentQueue.current}</div>
            <div className="admin-appointment-dashboard-next-queue">
              Next on Queue
              <div className="admin-appointment-dashboard-next-queue-number">{currentQueue.next}</div>
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
         
            </div>
          </div>

          <div className="admin-appointment-dashboard-appointments-list">
            <AllAppointmentsAdmin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointmentDashboard;
