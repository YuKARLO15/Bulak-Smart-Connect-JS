import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { appointmentNotificationService } from '../../services/appointmentNotificationService';
import './AllAppointmentAdmin.css';
import { Box, Typography, Card, CardContent, Button, Grid, Paper, CircularProgress, Container, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const AllAppointmentsAdmin = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
   const [cancelDialog, setCancelDialog] = useState({ show: false, appointmentId: null, appointmentName: '' });


  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: '',
    endDate: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAppointments = await appointmentService.fetchAllAppointments();
      console.log('Fetched appointments:', fetchedAppointments);

     
      const appointmentsArray = Array.isArray(fetchedAppointments)
        ? fetchedAppointments
        : fetchedAppointments.appointments || fetchedAppointments.data || [];

      setAppointments(appointmentsArray);
      setFilteredAppointments(appointmentsArray);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments. Please try again.');
      setAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...appointments];

    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(appointment => {
        const firstName = (appointment.firstName || '').toLowerCase();
        const lastName = (appointment.lastName || '').toLowerCase();
        const middleInitial = (appointment.middleInitial || '').toLowerCase();
        const fullName = `${firstName} ${middleInitial} ${lastName}`.trim();
        const appointmentId = String(
          appointment.id || appointment._id || appointment.appointmentNumber || ''
        ).toLowerCase();
        const clientName = (
          appointment.clientName ||
          appointment.name ||
          appointment.userName ||
          ''
        ).toLowerCase();
        const email = (appointment.email || '').toLowerCase();
        const phone = String(appointment.phone || appointment.phoneNumber || '').toLowerCase();
        const reasonOfVisit = (
          appointment.reasonOfVisit ||
          appointment.type ||
          appointment.appointmentType ||
          ''
        ).toLowerCase();

        return (
          firstName.includes(searchLower) ||
          lastName.includes(searchLower) ||
          middleInitial.includes(searchLower) ||
          fullName.includes(searchLower) ||
          appointmentId.includes(searchLower) ||
          clientName.includes(searchLower) ||
          email.includes(searchLower) ||
          phone.includes(searchLower) ||
          reasonOfVisit.includes(searchLower)
        );
      });
    }

    if (statusFilter !== 'all') {
      result = result.filter(appointment => appointment.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      result = result.filter(appointment => {
        const appointmentType =
          appointment.reasonOfVisit || appointment.type || appointment.appointmentType;
        return appointmentType === typeFilter;
      });
    }


    if (dateRangeFilter.startDate || dateRangeFilter.endDate) {
      result = result.filter(appointment => {
        const appDate = new Date(
          appointment.appointmentDate || appointment.date || appointment.createdAt
        );
        appDate.setHours(0, 0, 0, 0);

        if (dateRangeFilter.startDate && dateRangeFilter.endDate) {
          const startDate = new Date(dateRangeFilter.startDate);
          const endDate = new Date(dateRangeFilter.endDate);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          return appDate >= startDate && appDate <= endDate;
        } else if (dateRangeFilter.startDate) {
          const startDate = new Date(dateRangeFilter.startDate);
          startDate.setHours(0, 0, 0, 0);
          return appDate >= startDate;
        } else if (dateRangeFilter.endDate) {
          const endDate = new Date(dateRangeFilter.endDate);
          endDate.setHours(23, 59, 59, 999);
          return appDate <= endDate;
        }

        return true;
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
  }, [statusFilter, typeFilter, dateRangeFilter, searchTerm, appointments]);

  const handleViewDetails = appointment => {
    const appointmentId = appointment.id || appointment._id || appointment.appointmentNumber;
    navigate(`/AppointmentDetails/${appointmentId}`, { state: { appointment } });
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      console.log(`📝 Updating appointment ${appointmentId} status to: ${newStatus}`);
      
      // Find the appointment to get email and details (keep your existing logic)
      const appointment = appointments.find(
        app => (app.id || app._id || app.appointmentNumber) === appointmentId
      );

      if (!appointment) {
        console.error('Appointment not found:', appointmentId);
        setError('Appointment not found');
        return;
      }

      // Update status in database (keep your existing API call)
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);

      // 📧 SEND STATUS UPDATE NOTIFICATION (ADD THIS SECTION)
      if (appointment.email) {
        try {
          console.log('📧 Sending status update notification...');
          const notificationResult = await appointmentNotificationService.sendStatusUpdateNotification(
            appointment.email,
            appointment.appointmentNumber || appointmentId,
            newStatus,
            appointment
          );

          if (notificationResult.success) {
            console.log('✅ Status update notification sent successfully');
          } else {
            console.log('⚠️ Status update notification failed:', notificationResult.error);
          }
        } catch (notificationError) {
          console.error('❌ Error sending status update notification:', notificationError);
        }
      } else {
        console.log('⚠️ No email found for appointment, skipping notification');
      }

      // Keep your existing refresh logic
      await fetchAppointments();

      // Enhanced success message
      alert(`Appointment ${newStatus} successfully! ${appointment.email ? 'Notification email sent.' : ''}`);
      
    } catch (error) {
      console.error('Error updating appointment status:', error);
      setError('Failed to update appointment status. Please try again.');
    }
  };
  const handleCancelAppointment = (appointmentId, appointmentName) => {
    setCancelDialog({
      show: true,
      appointmentId: appointmentId,
      appointmentName: appointmentName
    });
  };

  const confirmCancelAppointment = async () => {
    try {
      console.log(`📝 Cancelling appointment ${cancelDialog.appointmentId}`);
      
      // Find the appointment details (keep your existing logic)
      const appointment = appointments.find(
        app => (app.id || app._id || app.appointmentNumber) === cancelDialog.appointmentId
      );

      // Update status to cancelled (keep your existing API call)
      await appointmentService.updateAppointmentStatus(cancelDialog.appointmentId, 'cancelled');

      // 📧 SEND CANCELLATION NOTIFICATION (ADD THIS SECTION)
      if (appointment && appointment.email) {
        try {
          console.log('📧 Sending cancellation notification...');
          const notificationResult = await appointmentNotificationService.sendCancellationNotification(
            appointment.email,
            appointment.appointmentNumber || cancelDialog.appointmentId,
            appointment,
            'Cancelled by administrator'
          );

          if (notificationResult.success) {
            console.log('✅ Cancellation notification sent successfully');
          } else {
            console.log('⚠️ Cancellation notification failed:', notificationResult.error);
          }
        } catch (notificationError) {
          console.error('❌ Error sending cancellation notification:', notificationError);
        }
      }

      // Keep your existing refresh and dialog closing logic
      await fetchAppointments();
      setCancelDialog({ show: false, appointmentId: null, appointmentName: '' });
      
      // Enhanced success message
      alert(`Appointment cancelled successfully! ${appointment?.email ? 'Notification email sent.' : ''}`);
      
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError('Failed to cancel appointment. Please try again.');
    }
  };

  const discardCancelAppointment = () => {
    setCancelDialog({ show: false, appointmentId: null, appointmentName: '' });
  };


  const appointmentTypes =
    appointments.length > 0
      ? [
          'all',
          ...new Set(
            appointments.map(
              app => app.reasonOfVisit || app.type || app.appointmentType || 'Unknown Type'
            )
          ),
        ]
      : ['all'];

  const getAppointmentType = appointment => {
    return (
      appointment.reasonOfVisit || appointment.type || appointment.appointmentType || 'Unknown Type'
    );
  };

  const getClientName = appointment => {
    const firstName = appointment.firstName || '';
    const middleInitial = appointment.middleInitial || '';
    const lastName = appointment.lastName || '';

    const fullName = [firstName, middleInitial, lastName].filter(Boolean).join(' ');

    if (fullName) {
      return fullName;
    }

    return (
      appointment.clientName ||
      appointment.name ||
      appointment.userName ||
      appointment.email ||
      'Anonymous User'
    );
  };

  const getAppointmentId = appointment => {
    return appointment.appointmentNumber || 'N/A';
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleDateRangeChange = (field, value) => {
    setDateRangeFilter(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearDateRange = () => {
    setDateRangeFilter({
      startDate: '',
      endDate: '',
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDateRangeFilter({
      startDate: '',
      endDate: '',
    });
  };

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
      case 'declined':
        return '#f44336';
      case 'completed':
        return '#2196F3';
      default:
        return '#FF9800';
    }
  };

  const formatAppointmentDate = appointment => {

    const date = appointment.appointmentDate || appointment.date;

   
    if (date) {
      return new Date(date).toLocaleDateString();
    }
    if (appointment.createdAt) {
      return new Date(appointment.createdAt).toLocaleDateString();
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

  if (error) {
    return (
      <div className="admin-appointments-error">
        <p>{error}</p>
        <button onClick={fetchAppointments} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    statusFilter !== 'all' ||
    typeFilter !== 'all' ||
    dateRangeFilter.startDate !== '' ||
    dateRangeFilter.endDate !== '';

  return (
    <div className="all-appointments-admin">
       {cancelDialog.show && (
        <div className="cancel-dialog-overlay-ApptAdmin">
          <div className="cancel-dialog-ApptAdmin">
            <div className="cancel-dialog-header-ApptAdmin">
              <h3>Cancel Appointment</h3>
            </div>
            <div className="cancel-dialog-body-ApptAdmin">
              <p>You are about to cancel appointment ID: </p>
              <p><strong>{cancelDialog.appointmentId}</strong></p>
              <p>Client: <strong>{cancelDialog.appointmentName}</strong></p>
              <p>Are you sure you want to proceed?</p>
            </div>
            <div className="cancel-dialog-footer-ApptAdmin">
              <button 
                className="proceed-btn-ApptAdmin" 
                onClick={confirmCancelAppointment}
              >
                Proceed
              </button>
              <button 
                className="discard-btn-ApptAdmin" 
                onClick={discardCancelAppointment}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="all-appointments-filters">
        <div className="filter-group search-group">
          <label htmlFor="search-filter">Search:</label>
          <div className="search-input-container">
            <input
              type="text"
              id="search-filter"
              placeholder="Search by name, ID, email, phone..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
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
          <select id="type-filter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            {appointmentTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group date-range-group">
          <label>Date Range:</label>
          <div className="date-range-inputs">
            <div className="date-input-wrapper">
              <label htmlFor="start-date">From:</label>
             <input
  type="date"
  id="start-date"
  value={dateRangeFilter.startDate}
  onChange={e => handleDateRangeChange('startDate', e.target.value)}
  max={dateRangeFilter.endDate || undefined}
  className="date-input"
/>
            </div>
            <div className="date-input-wrapper">
              <label htmlFor="end-date">To:</label>
              <input
                type="date"
                id="end-date"
                value={dateRangeFilter.endDate}
                onChange={e => handleDateRangeChange('endDate', e.target.value)}
                min={dateRangeFilter.startDate || undefined}
                className="date-input"
              />
            </div>
            {(dateRangeFilter.startDate || dateRangeFilter.endDate) && (
              <button
                className="clear-date-range"
                onClick={clearDateRange}
                title="Clear date range"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="filter-group">
            <button className="clear-all-filters" onClick={clearAllFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <div className="appointments-summary">
        <h3>
          Appointments ({filteredAppointments.length})
          {searchTerm.trim() !== '' && (
            <span className="search-indicator">- Searching for: "{searchTerm}"</span>
          )}
          {(dateRangeFilter.startDate || dateRangeFilter.endDate) && (
            <span className="date-range-indicator">
              - Date Range:{' '}
              {dateRangeFilter.startDate
                ? new Date(dateRangeFilter.startDate).toLocaleDateString()
                : 'Start'}
              {' to '}
              {dateRangeFilter.endDate
                ? new Date(dateRangeFilter.endDate).toLocaleDateString()
                : 'End'}
            </span>
          )}
        </h3>
        <button onClick={fetchAppointments} className="refresh-btn">
          Refresh
        </button>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="admin-appointments-empty">
          <p>
            {hasActiveFilters
              ? `No appointments found matching ${searchTerm.trim() !== '' ? `"${searchTerm}"` : 'your search criteria'}.`
              : 'No appointments found.'}
          </p>
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearAllFilters}>
              Clear all filters to see all appointments
            </button>
          )}
        </div>
      ) : (
        <div className="appointment-cards-container">
          {filteredAppointments.map((appointment, index) => (
            <div
              key={appointment.id || appointment._id || index}
              className="appointment-card"
              data-status={appointment.status}
            >
              <div className="appointment-card-header">
                <h3 className="client-name">{getClientName(appointment)}</h3>
                <div className="status-actions">
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(appointment.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {appointment.status || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="appointment-card-body">
                <div className="appointment-info-grid">
                  <div className="appointment-info-item">
                    <span className="info-label">ID:</span>
                    <span className="info-value">{getAppointmentId(appointment)}</span>
                  </div>

                  <div className="appointment-info-item">
                    <span className="info-label">Type:</span>
                    <span className="info-value">{getAppointmentType(appointment)}</span>
                  </div>

                  <div className="appointment-info-item">
                    <span className="info-label">Date:</span>
                    <span className="info-value">{formatAppointmentDate(appointment)}</span>
                  </div>

                  <div className="appointment-info-item">
                    <span className="info-label">Time:</span>
                    <span className="info-value">
                      {appointment.appointmentTime || appointment.time || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="appointment-card-footer">
                <div className="appointment-actions">
                  <button
                    className="view-details-btn"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    View
                  </button>

                  {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                    <div className="status-buttons">
                      {appointment.status === 'pending' && (
                        <button
                          className="confirm-btn"
                          onClick={() =>
                            handleStatusUpdate(getAppointmentId(appointment), 'confirmed')
                          }
                        >
                          Confirm
                        </button>
                      )}

                      {appointment.status === 'confirmed' && (
                        <button
                          className="complete-btn"
                          onClick={() =>
                            handleStatusUpdate(getAppointmentId(appointment), 'completed')
                          }
                        >
                          Complete
                        </button>
                      )}

                      <button
                        className="cancel-btn"
                        onClick={() =>
                          handleCancelAppointment(getAppointmentId(appointment), getClientName(appointment))
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAppointmentsAdmin;
