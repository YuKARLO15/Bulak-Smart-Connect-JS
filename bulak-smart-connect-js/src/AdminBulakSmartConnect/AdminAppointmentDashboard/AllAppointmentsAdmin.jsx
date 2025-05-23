import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecentAppointments } from '../../UserBulakSmartConnect/AppointmentComponents/RecentAppointmentData';
import './AllAppointmentAdmin.css';

const AllAppointmentsAdmin = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    // Use a timeout to simulate loading
    const timer = setTimeout(() => {
      // Get appointments directly from localStorage using the existing function
      const fetchedAppointments = getRecentAppointments();
      setAppointments(fetchedAppointments);
      setFilteredAppointments(fetchedAppointments);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Apply filters when filter values change
  useEffect(() => {
    let result = [...appointments];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(appointment => appointment.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(appointment => appointment.type === typeFilter);
    }
    
    // Sort by date, most recent first
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredAppointments(result);
  }, [statusFilter, typeFilter, appointments]);

  const handleViewDetails = (appointment) => {
    navigate(`/AppointmentDetails/${appointment.id}`, { state: { appointment } });
  };

  // Get unique appointment types for filter
  const appointmentTypes = appointments.length > 0 
    ? ['all', ...new Set(appointments.map(app => app.type))]
    : ['all'];

  if (loading) {
    return (
      <div className="admin-appointments-loading">
        <div className="admin-appointments-loading-spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="all-appointments-admin">
      <div className="all-appointments-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select 
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="type-filter">Type:</label>
          <select 
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {appointmentTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="admin-appointments-empty">
          <p>No appointments found matching your filters.</p>
        </div>
      ) : (
        <div className="minimal-appointments-list">
          {filteredAppointments.map((appointment, index) => (
            <div key={index} className="minimal-appointment-card">
              <div className="minimal-appointment-info">
                <div className="minimal-appointment-type">{appointment.type}</div>
                <div className="minimal-appointment-datetime">
                  {appointment.date} | {appointment.time || ''}
                </div>
                <div className="minimal-appointment-user">
                  {appointment.clientName || appointment.name || "Anonymous User"}
                </div>
              </div>
              <button 
                className="minimal-view-btn"
                onClick={() => handleViewDetails(appointment)}
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAppointmentsAdmin;