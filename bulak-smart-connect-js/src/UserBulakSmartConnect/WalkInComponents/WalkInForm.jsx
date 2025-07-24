import React, { useState, useEffect } from 'react';
import logger from '../../utils/logger';
import { useNavigate } from 'react-router-dom';
import './WalkInForm.css';
import NavBar from '../../NavigationComponents/NavSide';
import { queueService } from '../../services/queueService'; // Queue service import
import { useAuth } from '../../context/AuthContext'; // Auth context import
import { use } from 'react'; // Importing use from react for potential future use

// Helper function to format backend queue numbers to WK format
const formatWKNumber = queueNumber => {
  if (typeof queueNumber === 'string' && queueNumber.startsWith('WK')) {
    return queueNumber;
  }

  const numberPart = queueNumber?.includes('-') ? queueNumber.split('-')[1] : queueNumber;
  const num = parseInt(numberPart, 10) || 0;
  return `WK${String(num).padStart(3, '0')}`;
};

const WalkInForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleInitial: '',
    address: '',
    phoneNumber: '',
    reasonOfVisit: '',
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointmentType, setAppointmentType] = useState('');
  const [showDialog, setShowDialog] = useState(true);
  const [isAccountOwner, setIsAccountOwner] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [registeredUserData, setRegisteredUserData] = useState(null);

  // Check if the user is logged in
  const userId = user?.id || 'guest';

  useEffect(() => {
    const mockRegisteredUser = {
      lastName: user.lastName || '',
      firstName: user.firstName || '',
      middleInitial: user.middleName || '',
      address: user.address || '',
      phoneNumber: user.contactNumber || '',
    };

    setRegisteredUserData(mockRegisteredUser);
  }, []);

  useEffect(() => {
    if (isAccountOwner && registeredUserData) {
      setFormData({
        ...formData,
        lastName: registeredUserData.lastName,
        firstName: registeredUserData.firstName,
        middleInitial: registeredUserData.middleInitial,
        address: registeredUserData.address,
        phoneNumber: registeredUserData.phoneNumber,
      });
    }
  }, [isAccountOwner, registeredUserData]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAppointmentTypeChange = type => {
    setAppointmentType(type);
  };

  const handleDialogResponse = isOwner => {
    setIsAccountOwner(isOwner);
    setShowDialog(false);
    setShowForm(true);

    // Clear the form if user chooses to enter new details (guest)
    if (!isOwner) {
      setFormData({
        lastName: '',
        firstName: '',
        middleInitial: '',
        address: '',
        phoneNumber: '',
        reasonOfVisit: '',
      });
    }

    setAppointmentType(isOwner ? 'self' : 'other');

    // Add console log to verify the state
    logger.log('Dialog response - isAccountOwner:', isOwner, 'will be guest:', !isOwner);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      logger.log('=== FRONTEND QUEUE CREATION DEBUG ===');
      logger.log('User object:', user);
      logger.log('isAccountOwner state:', isAccountOwner);

      const actualUserId = user?.id || null;

      // FIXED: Send boolean instead of number
      // When user clicks "Yes, use my details" -> isAccountOwner = true -> isGuest = false
      // When user clicks "No, enter new details" -> isAccountOwner = false -> isGuest = true
      const isGuestValue = !isAccountOwner; // Direct boolean conversion

      logger.log('Final values:');
      logger.log('- actualUserId:', actualUserId);
      logger.log('- isAccountOwner:', isAccountOwner);
      logger.log('- isGuestValue (boolean):', isGuestValue);

      const requestPayload = {
        userId: actualUserId,
        isGuest: isGuestValue, // Send as boolean

        firstName: formData.firstName,
        lastName: formData.lastName,
        middleInitial: formData.middleInitial || '',
        address: formData.address || '',
        phoneNumber: formData.phoneNumber || '',
        reasonOfVisit: formData.reasonOfVisit,
        appointmentType: formData.reasonOfVisit,
      };

      logger.log('Request payload being sent:', requestPayload);

      const response = await queueService.createQueue(requestPayload);

      logger.log('Queue creation response:', response);

      // Format the queue number to WK format for display
      const queueNumber = formatWKNumber(response.queue.queueNumber);

      const newQueue = {
        id: queueNumber,
        dbId: response.queue.id,
        queueNumber: queueNumber,
        date: new Date().toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: '2-digit',
        }),
        userData: formData,
        appointmentType: formData.reasonOfVisit,
        isUserQueue: true,
        userId: actualUserId,
        isGuest: isGuestValue,
      };

      // Store in localStorage
      localStorage.setItem(`userQueue_${actualUserId}`, JSON.stringify(newQueue));

      try {
        const storedQueues = localStorage.getItem(`userQueues_${actualUserId}`);
        let userQueues = storedQueues ? JSON.parse(storedQueues) : [];
        if (!Array.isArray(userQueues)) userQueues = [];

        userQueues.push(newQueue);
        localStorage.setItem(`userQueues_${actualUserId}`, JSON.stringify(userQueues));
        localStorage.setItem('userQueue', JSON.stringify(newQueue));
      } catch (e) {
        logger.error('Error updating user queues:', e);
        localStorage.setItem(`userQueues_${actualUserId}`, JSON.stringify([newQueue]));
      }

      window.location.href = '/WalkInDetails';
    } catch (error) {
      logger.error('Error creating queue:', error);
      logger.error('Error details:', error.response?.data || error.message);
      // alert('Failed to create queue. Please try again.');
    }
  };

  // Initial dialog screen
  if (showDialog) {
    return (
      <div className="WalkInFormContainerWalkIn">
        <div className="DialogOverlay">
          <div className="DialogBox">
            <h3>Account Verification</h3>
            <p>Are you the owner of this account?</p>
            <div className="DialogActions">
              <button className="DialogBtn YesBtn" onClick={() => handleDialogResponse(true)}>
                Yes, use my details
              </button>
              <button className="DialogBtn NoBtn" onClick={() => handleDialogResponse(false)}>
                No, enter new details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form screen (only shown after dialog response)
  return (
    <div className={`WalkInFormContainerWalkIn ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="FormHeaderWalkIn">
        <h1>Walk - In</h1>
      </div>
      <div className="FormTitleWalkIn">
        <h2>Walk-In Form</h2>
        <p>Please fill in the details below:</p>
      </div>
      <div className="WalkInForm">
        <form onSubmit={handleSubmit}>
          <div className="FormRowWalkIn">
            <div className="FormGroupWalkIn">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="FormGroupWalkIn">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="FormGroupWalkIn SmallWalkIn">
              <label htmlFor="middleInitial">Middle Initial</label>
              <input
                type="text"
                id="middleInitial"
                name="middleInitial"
                maxLength="1"
                value={formData.middleInitial}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="FormRowWalkIn">
            <div className="FormGroupWalkIn">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="FormGroupWalkIn">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="FormRowWalkIn">
            <div className="FormGroupWalkIn">
              <label htmlFor="reasonOfVisit">Reason of Visit</label>
              <select
                id="reasonOfVisit"
                name="reasonOfVisit"
                value={formData.reasonOfVisit}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select reason
                </option>
                <option value="Birth Certificate">Birth Certificate</option>
                <option value="Marriage Certificate">Marriage Certificate</option>
                <option value="Death Certificate">Death Certificate</option>
                <option value="Inqury">Inqury</option>
              </select>
            </div>
          </div>

          <div className="FormActionsWalkIn">
     
            <button
              type="button"
              className="BackBtnWalkIn"
              style={{ marginLeft: '10px' }}
              onClick={() => navigate('/WalkInQueue')}
            >
              Back
            </button>
            <button type="submit" className="ConfirmBtnWalkIn">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalkInForm;
