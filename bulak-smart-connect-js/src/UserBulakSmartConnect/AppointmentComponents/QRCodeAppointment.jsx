import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../../NavigationComponents/NavSide';
import { Box, Typography } from '@mui/material';
import './QrCodeAppointment.css';


const QRCodeAppointment = () => {
  const { id } = useParams();
  const location = useLocation();
  const { appointment, source } = location.state || {};
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
const steps = [
  { label: 'Book Appointment' },
  { label: 'Save/Screenshot Summary' },
  { label: 'Visit Registrar Office' }
];

  const handleViewRequirements = () => {
    // Convert the appointment type to lowercase and check
    const type = appointment.type.toLowerCase();
    
    if (type?.includes('birth') || type?.includes('birth certificate')) {
      navigate('/RequirementBirthList');
    } 
    else if (type?.includes('marriage') || type?.includes('marriage certificate')) {
      navigate('/RequirementMarriageList');
    }
    else {
      // For other types, we could navigate to a general requirements page or show a message
      navigate('/RequirementBirthList'); 
    }
  };



  if (!appointment) return (
    <div className="ErrorContainerAppointment">
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="MessageContainerAppointment">
        <h2>No appointment found.</h2>
        <p>Please check your appointment details and try again.</p>
      </div>
    </div>
  );
 const getButtonText = () => {
    // If source is 'appointmentForm', return 'Back' otherwise return 'Complete'
    return source === 'appointmentDashboard' ? 'Back' : 'Complete';
  };

  if (!appointment) return (
    <div className="ErrorContainerAppointment">
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="MessageContainerAppointment">
        <h2>No appointment found.</h2>
        <p>Please check your appointment details and try again.</p>
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

    const Stepper = () => (
      <div className="StepperContainerAppointForm">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className={`StepAppointForm${idx === 1 ? ' ActiveAppointForm' : ''}`}>
              <div className="StepCircleAppointForm">{idx + 1}</div>
              <div className="StepLabelAppointForm">{step.label}</div>
            </div>
            {idx !== steps.length - 1 && <div className="StepLineAppointForm" />}
          </React.Fragment>
        ))}
      </div>
    );

  return (
    <div className={`QrCodeContainerAppointment ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
       <Typography variant="h4" className="TitleNavAppointmenSummary">
        {' '}
        APPOINTMENT{' '}
      </Typography>
 <Stepper />
      <div className="QueueInfoAppointment">
        
        <h2>
          Your appointment has been scheduled at{' '}
          <span className="HighlightAppointment">Civil Registrar Office</span>!
        </h2>
        <p className="LabelAppointmentID">Appointment ID:</p>
        <h1 className="QueueNumberAppointment">{id}</h1>

        <div className="AppointmentDetailsSectionAppointment">
          <h3 className="DetailsSectionTitleAppointment">Appointment Details</h3>
          <div className="AppointmentDetailsAppointment">
            <p>
              <strong>Appointment Type:</strong> {appointment.type}
            </p>
            <p>
              <strong>Appointment Date:</strong> {formatDate(appointment.date)}
            </p>
            <p>
              <strong>Appointment Time:</strong> {appointment.time}
            </p>
            <p>
              <strong>Client Name:</strong> {appointment.firstName} {appointment.lastName}
            </p>
            <p>
              <strong>Address:</strong> {appointment.address}
            </p>
            <p>
              <strong>Phone Number:</strong> {appointment.phoneNumber}
            </p>
          </div>
        </div>
   <a
          onClick={handleViewRequirements} 
          className="RequirementsLinkAppointment"
        >
          View Document Requirements
        </a>
        <div className="NoteContainerAppointment">
          <h3 className="NoteTitleAppointment">Important Notes</h3>
          <ul className="NoteListAppointment">
            <li>
              All clients are required to arrive at least 15 minutes before their scheduled
              appointment time.
            </li>
            <li>
              Late arrivals will need to reschedule.
            </li>
            <li>
              Please bring all required documents on the day of your appointment.
            </li>
          </ul>
        </div>

        <button 
         onClick={() => navigate('/AppointmentForm')}
          className="CompleteAppointment"
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

export default QRCodeAppointment;