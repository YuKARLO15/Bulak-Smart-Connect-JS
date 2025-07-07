import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { appointmentNotificationService } from '../../services/appointmentNotificationService';
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
      console.log('📧 Fetching appointment with user details for notifications...');
      const appointmentData = await appointmentService.getAppointmentById(id);
      console.log('📧 Appointment data with user relationship:', appointmentData);
      setAppointment(appointmentData);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced email lookup function
  const getAppointmentEmail = appointment => {
    try {
      // Check user relationship first
      if (appointment.user && appointment.user.email) {
        console.log('📧 Found email in appointment.user.email:', appointment.user.email);
        return appointment.user.email;
      }

      // Check direct email field
      if (appointment.email) {
        console.log('📧 Found email in appointment.email:', appointment.email);
        return appointment.email;
      }

      // Check if User object exists with email (different casing)
      if (appointment.User && appointment.User.email) {
        console.log('📧 Found email in appointment.User.email:', appointment.User.email);
        return appointment.User.email;
      }

      // Check if userEmail field exists
      if (appointment.userEmail) {
        console.log('📧 Found email in appointment.userEmail:', appointment.userEmail);
        return appointment.userEmail;
      }

      console.log('⚠️ No email found for appointment. Available fields:', Object.keys(appointment));
      console.log('📋 User object:', appointment.user);
      return null;
    } catch (error) {
      console.error('Error getting appointment email:', error);
      return null;
    }
  };

  // Enhanced handleStatusUpdate function
  const handleStatusUpdate = async newStatus => {
    try {
      console.log(`📝 Updating appointment ${id} status to: ${newStatus}`);

      if (!appointment) {
        console.error('No appointment data available');
        alert('Error: Appointment data not available');
        return;
      }

      // Update status in database (keep your existing API call)
      await appointmentService.updateAppointmentStatus(id, newStatus);

      // Update local state (keep your existing state update)
      setAppointment(prev => ({ ...prev, status: newStatus }));

      // 📧 SEND STATUS UPDATE NOTIFICATION
      const appointmentEmail = getAppointmentEmail(appointment);

      if (appointmentEmail) {
        try {
          console.log(`📧 Sending status update notification to: ${appointmentEmail}`);
          const notificationResult =
            await appointmentNotificationService.sendStatusUpdateNotification(
              appointmentEmail,
              appointment.appointmentNumber || id,
              newStatus,
              appointment
            );

          if (notificationResult.success) {
            console.log('✅ Status update notification sent successfully');
            alert(
              `Appointment ${newStatus} successfully! Notification email sent to ${appointmentEmail}.`
            );
          } else {
            console.log('⚠️ Status update notification failed:', notificationResult.error);
            alert(
              `Appointment ${newStatus} successfully! However, notification email could not be sent.`
            );
          }
        } catch (notificationError) {
          console.error('❌ Error sending status update notification:', notificationError);
          alert(
            `Appointment ${newStatus} successfully! However, notification email could not be sent.`
          );
        }
      } else {
        console.log('⚠️ No email found for appointment, skipping notification');
        console.log('📋 Available appointment fields:', Object.keys(appointment));
        alert(`Appointment ${newStatus} successfully! No email available for notification.`);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Error updating appointment status');
    }
  };

  const handleBack = () => {
    navigate('/AdminAppointmentDashboard');
  };

  const handleNext = () => {
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
  const getApplicationData = appointment => {
    if (!appointment) return null;

    const formatDate = dateString => {
      if (!dateString) return 'Not specified';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    // Enhanced email lookup for display
    const appointmentEmail = getAppointmentEmail(appointment);

    return {
      applicationNumber: appointment.appointmentNumber || appointment.id || 'N/A',
      lastName: appointment.lastName || 'Not provided',
      firstName: appointment.firstName || 'Not provided',
      middleInitial: appointment.middleInitial || '',
      phone: appointment.phoneNumber || 'Not provided',
      email: appointmentEmail || 'Not provided',
      applicationType: appointment.reasonOfVisit || 'Not specified',
      subType: appointment.appointmentTime ? `(${appointment.appointmentTime})` : '',
      submissionDate: formatDate(appointment.appointmentDate),
      status: appointment.status || 'pending',
      address: appointment.address || 'Not provided',
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
