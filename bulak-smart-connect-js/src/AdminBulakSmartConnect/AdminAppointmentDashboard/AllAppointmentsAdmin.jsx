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
  const [dateFilter, setDateFilter] = useState('');

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

  useEffect(() => {
    let result = [...appointments];
    
    if (statusFilter !== 'all') {
      result = result.filter(appointment => appointment.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
      result = result.filter(appointment => {
        const appointmentType = appointment.reasonOfVisit || appointment.type || appointment.appointmentType;
        return appointmentType === typeFilter;
      });
    }
    
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0); 
      
      const nextDay = new Date(filterDate);
      nextDay.setDate(nextDay.getDate() + 1); 
      
      result = result.filter(appointment => {
        const appDate = new Date(appointment.appointmentDate || appointment.date || appointment.createdAt);
        return appDate >= filterDate && appDate < nextDay;
      });
    }
    
    result.sort((a, b) => {
      if ((a.status === 'completed') !== (b.status === 'completed')) {
        return a.status === 'completed' ? 1 : -1; 
      }
      
      const dateA = new Date(a.appointmentDate || a.date || a.createdAt);
      const dateB = new Date(b.appointmentDate || b.date || b.createdAt);
      
      if (dateA.toDateString() === dateB.toDateString()) {
        const timeA = a.appointmentTime || '';
        const timeB = b.appointmentTime || '';
        
        if (timeA && timeB) {
          return timeA.localeCompare(timeB);
        }
      }
      
      return dateA - dateB; 
    });
    
    setFilteredAppointments(result);
  }, [statusFilter, typeFilter, dateFilter, appointments]);

  const handleViewDetails = (appointment) => {
    navigate(`/AppointmentDetails/${appointment.id || appointment._id}`, { state: { appointment } });
  };

  const appointmentTypes = appointments.length > 0 
    ? ['all', ...new Set(appointments.map(app => app.reasonOfVisit || app.type || app.appointmentType || 'Unknown Type'))]
    : ['all'];

  const getAppointmentType = (appointment) => {
    return appointment.reasonOfVisit || appointment.type || appointment.appointmentType || 'Unknown Type';
  };

  const getClientName = (appointment) => {
    const firstName = appointment.firstName || '';
    const middleInitial = appointment.middleInitial || '';
    const lastName = appointment.lastName || '';
    
    const fullName = [firstName, middleInitial, lastName].filter(Boolean).join(' ');
    
    if (fullName) {
      return fullName;
    }
    
    return appointment.clientName || appointment.name || appointment.userName || appointment.email || "Anonymous User";
  };

  const formatDateTime = (appointment) => {
    const date = appointment.appointmentDate || appointment.date;
    const time = appointment.appointmentTime || appointment.time;
    
    if (date) {
      const formattedDate = new Date(date).toLocaleDateString();
      return time ? `${formattedDate} | ${time}` : formattedDate;
    }
    
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
        
        <div className="filter-group">
          <label htmlFor="date-filter">Date:</label>
          <input
            type="date"
            id="date-filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          {dateFilter && (
            <button 
              className="clear-date-filter"
              onClick={() => setDateFilter('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="admin-appointments-empty">
          <p>No appointments found matching your filters.</p>
        </div>
      ) : (
        <div className="minimal-appointments-list">
          {filteredAppointments.map((appointment, index) => (
            <div 
              key={appointment.id || appointment._id || index} 
              className={`minimal-appointment-card ${appointment.status === 'completed' ? 'completed-appointment' : ''}`}
            >
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
                <div className="minimal-appointment-status">
                  {appointment.status || 'pending'}
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