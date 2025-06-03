import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePickerInputAppointForm from './DataPickerAppointmentForm';
import './AppointmentContent.css';
import { saveRecentAppointments } from './RecentAppointmentData';
import { appointmentService } from '../../services/appointmentService'; 
import axios from 'axios';

const steps = [
  { label: 'Book Appointment' },
  { label: 'Save/Screenshot Summary' },
  { label: 'Visit Registrar Office' }
];

const AppointmentContainer = ({ onBack, preselectedDate }) => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(true);
  const [isForSelf, setIsForSelf] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingUserData, setFetchingUserData] = useState(false);

  const [userData, setUserData] = useState({
    lastName: '',
    firstName: '',
    middleInitial: '',
    address: '',
    phoneNumber: '',
  });

  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleInitial: '',
    address: '',
    phoneNumber: '',
    reason: '',
    date: '',
    time: '',
  });

  const [errors, setErrors] = useState({});
  const [selectedDate, setSelectedDate] = useState(preselectedDate || null);
  const [tooltip, setTooltip] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]); 
  const [loadingSlots, setLoadingSlots] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setFetchingUserData(true);
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axios.get('http://localhost:3000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          const user = response.data;
          setUserData({
            lastName: user.lastName || '',
            firstName: user.firstName || '',
            middleInitial: user.middleInitial || '',
            address: user.address || '',
            phoneNumber: user.phoneNumber || user.contactNumber || '', 
          });
        }
      } catch {}
      finally {
        setFetchingUserData(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (selectedDate) fetchAvailableSlots();

  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      const dateStr = selectedDate.toISOString().split('T')[0]; 
      const slots = await appointmentService.fetchAvailableSlots(dateStr);
      setAvailableSlots(slots);
    } catch {
      setAvailableSlots(generateTimeSlots());
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDialogChoice = forSelf => {
    setIsForSelf(forSelf);
    setShowDialog(false);
    if (forSelf) {
      setFormData({
        ...formData,
        lastName: userData.lastName,
        firstName: userData.firstName,
        middleInitial: userData.middleInitial  || '',
        address: userData.address,
        phoneNumber: userData.phoneNumber,
      });
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    let hour = 8, minute = 0;
    while (hour < 17) {
      let startTime = `${hour === 12 ? 12 : hour % 12}:${minute === 0 ? '00' : '30'} ${hour < 12 ? 'AM' : 'PM'}`;
      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour += 1;
      }
      let endTime = `${hour === 12 ? 12 : hour % 12}:${minute === 0 ? '00' : '30'} ${hour < 12 ? 'AM' : 'PM'}`;
      slots.push(`${startTime} - ${endTime}`);
    }
    return slots;
  };

  const timeSlots = availableSlots.length > 0 ? availableSlots : generateTimeSlots();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handlePhoneNumberChange = e => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 11) {
      setFormData({ ...formData, phoneNumber: value });
      if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: null });
    }
  };

  const handleDateChange = date => {
    if (date.getDay() === 0 || date.getDay() === 6) setTooltip(true);
    else {
      setTooltip(false);
      setSelectedDate(date);
      setFormData({ ...formData, date: date.toLocaleDateString() });
      if (errors.date) setErrors({ ...errors, date: null });
    }
  };

  const handleSubmit = async () => { 
   let newErrors = {};
  Object.keys(formData).forEach(key => {
    if (!formData[key] && key !== 'middleInitial') {
      
      if (key === 'date' && !selectedDate) {
        newErrors[key] = 'Please select a date.';
      } else if (key !== 'date') {
        newErrors[key] = 'This field is required.';
      }
    }
  });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      const appointmentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleInitial: formData.middleInitial || '',
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        reasonOfVisit: formData.reason, 
        appointmentDate: selectedDate.toISOString().split('T')[0], 
        appointmentTime: formData.time,
        isGuest: !isForSelf
      };

      const result = await appointmentService.createAppointment(appointmentData);

      const newAppointment = {
        id: result.appointmentNumber || `APPT-${Date.now()}`,
        appointmentNumber: result.appointmentNumber,
        type: formData.reason,
        date: selectedDate.toISOString().split('T')[0],
        time: formData.time,
        lastName: formData.lastName,
        firstName: formData.firstName,
        middleInitial: formData.middleInitial,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        reasonOfVisit: formData.reason,
        appointmentDate: selectedDate.toISOString().split('T')[0],
        appointmentTime: formData.time,
        status: result.status || 'pending',
        dbId: result.id,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      };

      saveRecentAppointments(newAppointment);

      alert('Your appointment has been confirmed!');

      navigate(`/QRCodeAppointment/${newAppointment.appointmentNumber || newAppointment.id}`, { 
        state: { appointment: newAppointment } 
      });

      setFormData({
        lastName: '',
        firstName: '',
        middleInitial: '',
        address: '',
        phoneNumber: '',
        reason: '',
        date: '',
        time: '',
      });

    } catch (error) {
      let errorMessage = 'Failed to create appointment. Please try again.';
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.message) errorMessage = error.message;
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

   const dialogPrompt = (
    <div className="DialogBoxAppointForm">
      {onBack && (
        <button className="DialogBackButtonAppointForm" onClick={onBack} aria-label="Go back">
          <span aria-hidden="true">&times;</span> <p className='DialoagBackp'> Close</p>
        </button>
      )}
      <h3 className="DialogTextAppointForm">Appointment for:</h3>
      
      <div className="DialogButtonsAppointForm">
        <button 
          className={`DialogButtonAppointForm SelfButtonAppointForm${isForSelf === true ? ' SelectedAppointForm' : ''}`} 
          onClick={() => handleDialogChoice(true)}
          disabled={fetchingUserData}
        >
          {fetchingUserData ? 'Loading your data...' : 'Myself'}
        </button>
        <button
          className={`DialogButtonAppointForm OtherButtonAppointForm${isForSelf === false ? ' SelectedAppointForm' : ''}`}
          onClick={() => handleDialogChoice(false)}
        >
          Someone Else
        </button>
      </div>
    </div>
  );
   const Stepper = () => (
    <div className="StepperContainerAppointForm">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className={`StepAppointForm${idx === 0 ? ' ActiveAppointForm' : ''}`}>
            <div className="StepCircleAppointForm">{idx + 1}</div>
            <div className="StepLabelAppointForm">{step.label}</div>
          </div>
          {idx !== steps.length - 1 && <div className="StepLineAppointForm" />}
        </React.Fragment>
      ))}
    </div>
  );
 

  return (
    
    <div className="AppointmentFormsContainerAppointForm ProStyledAppointForm">
        {showDialog && (
        <div className="DialogOverlayAppointForm">{dialogPrompt}</div>
      )}


    
      {!showDialog && (
        
        <div className="AppointmentFContainerAppointForm">
                <div className="BackButtonWrapperAppointForm">
        <button className="ActualBackButtonAppointForm" onClick={onBack}>
          &larr; Back
        </button>
      </div>
      <Stepper />

          <h2 className="AppointmentTitleAppointForm">Booking Appointment</h2>
      
          <div className="AppointmentLayoutAppointForm">
            <div className="AppointmentFormSectionAppointForm">
              <div className="FormGroupAppointForm RowGroupAppointForm">
                <div className="InputWrapperAppointForm">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                  />
                  {errors.lastName && <span className="ErrorTextAppointForm">{errors.lastName}</span>}
                </div>
                <div className="InputWrapperAppointForm">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                  />
                  {errors.firstName && <span className="ErrorTextAppointForm">{errors.firstName}</span>}
                </div>
                <div className="InputWrapperAppointForm SmallInputAppointForm">
                  <label>Middle Initial</label>
                  <input
                    type="text"
                    name="middleInitial"
                    value={formData.middleInitial}
                    onChange={handleChange}
                    maxLength="1"
                    autoComplete="additional-name"
                  />
                </div>
              </div>
              <div className="FormGroupAppointForm RowGroupAppointForm">
                <div className="InputWrapperAppointForm LargeInputAppointForm">
                  <label>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} autoComplete="street-address" />
                  {errors.address && <span className="ErrorTextAppointForm">{errors.address}</span>}
                </div>
                <div className="InputWrapperAppointForm">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    maxLength="11"
                    placeholder="e.g. 09123456789"
                    autoComplete="tel"
                  />
                  {errors.phoneNumber && <span className="ErrorTextAppointForm">{errors.phoneNumber}</span>}
                </div>
              </div>
              <div className="FormGroupAppointForm SlotGroupAppointForm">
                <div className="InputWrapperAppointForm AppointTimeAppointForm">
                  <label>Reason for Visit</label>
                  <select name="reason" value={formData.reason} onChange={handleChange}>
                    <option value="">Select a Reason</option>
                    <option value="Birth Certificate">Birth Certificate</option>
                    <option value="Marriage Certificate">Marriage Certificate</option>
                    <option value="Death Certificate">Death Certificate</option>
                  </select>
                  {errors.reason && <span className="ErrorTextAppointForm">{errors.reason}</span>}
                </div>
                <div className="InputWrapperAppointForm AppointTimeAppointForm">
                  <label className="AppointTimeSelectedAppointForm">Select Time</label>
                  <select 
                    name="time" 
                    value={formData.time} 
                    onChange={handleChange}
                    disabled={loadingSlots}
                  >
                    <option value="">
                      {loadingSlots ? 'Loading available times...' : 'Select a Time Slot'}
                    </option>
                    {timeSlots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {errors.time && <span className="ErrorTextAppointForm">{errors.time}</span>}
                  {loadingSlots && <span className="InfoTextAppointForm">Fetching real-time availability...</span>}
                </div>
              </div>
              <div className="FormGroupAppointForm RowGroupAppointForm">
                <div className="InputWrapperAppointForm">
                  <label>Select Date of Visit</label>
   <DatePickerInputAppointForm
    value={selectedDate}
    onChange={date => {
      setTooltip(false);
      setSelectedDate(date);
      setFormData({
        ...formData,
        date: date ? date.toLocaleDateString() : ""
      });
      if (errors.date) setErrors({ ...errors, date: null });
    }}
    error={errors.date}
    placeholder="Select date"
  />
                </div>
                 </div>
                <div className="ConfirmContainerAppointForm">
                  <button 
                    className="ConfirmButtonAppointForm" 
                    onClick={handleSubmit}
                    disabled={isSubmitting || loadingSlots}
                  >
                    {isSubmitting ? 'Booking Appointment...' : 'Confirm Appointment'}
                  </button>
                </div>
              
            </div>
            {/* Summary/Instruction Panel */}
            <div className="AppointmentSummaryPanelAppointForm">
              <h4 className="SummaryTitleAppointForm">How to Book Your Appointment</h4>
              <ol className="SummaryStepsAppointForm">
                <li>Book appointment by filling in your details on this page.</li>
                <li>Screenshot or save your appointment summary after confirmation.</li>
                <li>Go to the Municipal Civil Registrar's Office on your chosen date and time. Please bring your appointment summary and required documents.</li>
              </ol>
              <div className="SummaryNoteAppointForm">
                <strong>Note:</strong> If you do not arrive within 15 minutes of your scheduled time, your appointment may be rescheduled.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentContainer;