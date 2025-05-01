import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WalkInForm.css';
import NavBar from '../../NavigationComponents/NavSide';

const WalkInForm = () => {
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

  useEffect(() => {
    const mockRegisteredUser = {
      lastName: 'Francisco',
      firstName: 'John',
      middleInitial: 'D',
      address: '123 Pinaod San Ildefonso, Bulacan',
      phoneNumber: '09123456789',
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

    setAppointmentType(isOwner ? 'self' : 'other');
  };

  const handleSubmit = e => {
    e.preventDefault();

    const lastQueueId = localStorage.getItem('lastQueueId') || '  WK000';
    const queueNumber = parseInt(lastQueueId.replace('WK', '')) + 1;
    const newQueueId = `WK${queueNumber.toString().padStart(3, '0')}`;

    const today = new Date();
    const dateStr = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear().toString().slice(2)}`;

    const queueEntry = {
      id: newQueueId,
      date: dateStr,
      userData: formData,
      appointmentType,
      isAccountOwner,
    };

    localStorage.setItem('lastQueueId', newQueueId);
    localStorage.setItem('userQueue', JSON.stringify(queueEntry));

    const pendingQueues = JSON.parse(localStorage.getItem('pendingQueues') || '[]');
    localStorage.setItem('pendingQueues', JSON.stringify([...pendingQueues, queueEntry]));

    navigate('/WalkInDetails');
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
