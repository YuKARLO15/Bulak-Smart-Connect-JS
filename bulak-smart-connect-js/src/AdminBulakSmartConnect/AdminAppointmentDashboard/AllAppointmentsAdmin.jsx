import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import './AllAppointmentAdmin.css';

const AllAppointmentsAdmin = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const fetchedAppointments = await appointmentService.fetchAllAppointments();
      console.log('Fetched appointments:', fetchedAppointments);
      setAppointments(fetchedAppointments);
      setFilteredAppointments(fetchedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when filter values change
  useEffect(() => {
    let result = [...appointments];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(appointment => appointment.status === statusFilter);
    }
    
    // Apply type filter (using reasonOfVisit as type)
    if (typeFilter !== 'all') {
      result = result.filter(appointment => {
        const appointmentType = appointment.reasonOfVisit || appointment.type || appointment.appointmentType;
        return appointmentType === typeFilter;
      });
    }
    
    // Sort by date, most recent first
    result.sort((a, b) => {
      const dateA = new Date(a.appointmentDate || a.date || a.createdAt);
      const dateB = new Date(b.appointmentDate || b.date || b.createdAt);
      return dateB - dateA;
    });
    
    setFilteredAppointments(result);
  }, [statusFilter, typeFilter, appointments]);

  const handleViewDetails = (appointment) => {
    navigate(`/AppointmentDetails/${appointment.id || appointment._id}`, { state: { appointment } });
  };

  // Get unique appointment types for filter (using reasonOfVisit)
  const appointmentTypes = appointments.length > 0 
    ? ['all', ...new Set(appointments.map(app => app.reasonOfVisit || app.type || app.appointmentType || 'Unknown Type'))]
    : ['all'];

  // Helper function to get appointment type (using reasonOfVisit)
  const getAppointmentType = (appointment) => {
    return appointment.reasonOfVisit || appointment.type || appointment.appointmentType || 'Unknown Type';
  };

  // Helper function to get client name
  const getClientName = (appointment) => {
    // Build full name from firstName, middleInitial, lastName
    const firstName = appointment.firstName || '';
    const middleInitial = appointment.middleInitial || '';
    const lastName = appointment.lastName || '';
    
    const fullName = [firstName, middleInitial, lastName].filter(Boolean).join(' ');
    
    if (fullName) {
      return fullName;
    }
    
    // Fallback to other possible fields
    return appointment.clientName || appointment.name || appointment.userName || appointment.email || "Anonymous User";
  };

  // Helper function to format date and time
  const formatDateTime = (appointment) => {
    const date = appointment.appointmentDate || appointment.date;
    const time = appointment.appointmentTime || appointment.time;
    
    if (date) {
      const formattedDate = new Date(date).toLocaleDateString();
      return time ? `${formattedDate} | ${time}` : formattedDate;
    }
    
    // Fallback to createdAt if no specific date
    if (appointment.createdAt) {
      return new Date(appointment.createdAt).toLocaleString();
    }
    
    return 'Date not specified';
  };

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
            <div key={appointment.id || appointment._id || index} className="minimal-appointment-card">
              <div className="minimal-appointment-info">
                <div className="minimal-appointment-type">
                  {getAppointmentType(appointment)}
                </div>
                <div className="minimal-appointment-datetime">
                  {formatDateTime(appointment)}
                </div>
                <div className="minimal-appointment-user">
                  {getClientName(appointment)}
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