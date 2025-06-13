import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import './AppointmentDetails.css';
import UserInfoCard from './UserInfoCard';
import NavBar from '../../NavigationComponents/NavSide';

const AppointmentDetailsCard = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [id]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      
      // First try to get appointment from location state
      if (location.state?.appointment) {
        setAppointment(location.state.appointment);
        setLoading(false);
        return;
      }
      
      // If not in state, fetch from API
      const appointmentData = await appointmentService.getAppointmentById(id);
      setAppointment(appointmentData);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(id, newStatus);
      setAppointment(prev => ({ ...prev, status: newStatus }));
      alert(`Appointment ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Error updating appointment status');
    }
  };

  const handleBack = () => {
    navigate('/AdminAppointmentDashboard');
  };

  const handleNext = () => {
    // You can implement any next action here
    // For now, let's just show available status updates
    if (appointment?.status === 'pending') {
      const action = window.confirm('Confirm this appointment?');
      if (action) {
        handleStatusUpdate('confirmed');
      }
    } else if (appointment?.status === 'confirmed') {
      const action = window.confirm('Mark this appointment as completed?');
      if (action) {
        handleStatusUpdate('completed');
      }
    }
  };

  // Transform appointment data to match the expected format
  const getApplicationData = (appointment) => {
    if (!appointment) return null;

    const formatDate = (dateString) => {
      if (!dateString) return 'Not specified';
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    return {
      applicationNumber: appointment.appointmentNumber || appointment.id || 'N/A',
      lastName: appointment.lastName || 'Not provided',
      firstName: appointment.firstName || 'Not provided',
      middleInitial: appointment.middleInitial || '',
      phone: appointment.phoneNumber || 'Not provided',
      email: appointment.email || 'Not provided',
      applicationType: appointment.reasonOfVisit || 'Not specified',
      subType: appointment.appointmentTime ? `(${appointment.appointmentTime})` : '',
      submissionDate: formatDate(appointment.appointmentDate),
      status: appointment.status || 'pending',
      address: appointment.address || 'Not provided'
    };
  };

  if (loading) {
    return (
      <div className="main-container">
        <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="main-container">
        <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="error-content">
          <h2>Appointment Not Found</h2>
          <p>The appointment you're looking for doesn't exist.</p>
          <button onClick={handleBack} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const applicationData = getApplicationData(appointment);

  return (
    <div className="main-container">
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="appointment-wrapper">
        <UserInfoCard 
          data={applicationData} 
          onBack={handleBack}
          onNext={handleNext}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};

export default AppointmentDetailsCard;
