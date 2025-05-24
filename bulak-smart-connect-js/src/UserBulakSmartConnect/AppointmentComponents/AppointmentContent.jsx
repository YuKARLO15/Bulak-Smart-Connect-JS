import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AppointmentContent.css';
import { saveRecentAppointments } from './RecentAppointmentData';
import { appointmentService } from '../../services/appointmentService'; 

const AppointmentContainer = ({ onBack, preselectedDate }) => {
  const navigate = useNavigate();

  const [showDialog, setShowDialog] = useState(true);
  const [isForSelf, setIsForSelf] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userData, setUserData] = useState({
    lastName: 'Francisco',
    firstName: 'Luan',
    middleInitial: 'D',
    address: '123 Main St, Evetywhere, Bulacan',
    phoneNumber: '09124458403',
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
  const [selectedDate, setSelectedDate] = useState(preselectedDate);
  const [tooltip, setTooltip] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]); 
  const [loadingSlots, setLoadingSlots] = useState(false); 

  const handleDialogChoice = forSelf => {
    setIsForSelf(forSelf);
    setShowDialog(false);

    if (forSelf) {
      setFormData({
        ...formData,
        lastName: userData.lastName,
        firstName: userData.firstName,
        middleInitial: userData.middleInitial,
        address: userData.address,
        phoneNumber: userData.phoneNumber,
      });
    }
  };

  useEffect(() => {
    if (preselectedDate) {
      setSelectedDate(preselectedDate);
      setFormData({ ...formData, date: preselectedDate.toLocaleDateString() });
    }
  }, [preselectedDate]);

  // Fetch real available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      const dateStr = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const slots = await appointmentService.fetchAvailableSlots(dateStr);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // Fallback to existing generated slots if API fails
      setAvailableSlots(generateTimeSlots());
    } finally {
      setLoadingSlots(false);
    }
  };

  // Keep existing generateTimeSlots as fallback
  const generateTimeSlots = () => {
    const slots = [];
    let hour = 8;
    let minute = 0;

    while (hour < 17) {
      let startTime = `${hour}:${minute === 0 ? '00' : '30'} ${hour < 12 ? 'AM' : 'PM'}`;
      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour += 1;
      }
      let endTime = `${hour}:${minute === 0 ? '00' : '30'} ${hour < 12 ? 'AM' : 'PM'}`;
      slots.push(`${startTime} - ${endTime}`);
    }
    return slots;
  };

  // Use real slots if available, otherwise fallback to generated slots
  const timeSlots = availableSlots.length > 0 ? availableSlots : generateTimeSlots();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneNumberChange = e => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 11) {
      setFormData({ ...formData, phoneNumber: value });
    }
  };

  const handleDateChange = date => {
    if (date.getDay() === 0 || date.getDay() === 6) {
      setTooltip(true);
    } else {
      setTooltip(false);
      setSelectedDate(date);
      setFormData({ ...formData, date: date.toLocaleDateString() });
    }
  };

  const handleSubmit = async () => { 
    let newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) newErrors[key] = 'This field is required.';
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      // Keep existing appointmentId generation
      const appointmentId = `APPT-${Date.now()}`;

      // Prepare data for backend API (real data)
      const appointmentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleInitial: formData.middleInitial || '',
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        reasonOfVisit: formData.reason, // Map 'reason' to 'reasonOfVisit'
        appointmentDate: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        appointmentTime: formData.time,
        isGuest: !isForSelf
      };

      console.log('Submitting real appointment data to backend:', appointmentData);

      // Create appointment via backend API using real data
      const result = await appointmentService.createAppointment(appointmentData);
      
      console.log('Real appointment created successfully:', result);

      // Keep existing local appointment structure for backwards compatibility
      const newAppointment = {
        id: result.appointmentNumber || appointmentId, // Use real appointmentNumber from backend
        appointmentNumber: result.appointmentNumber, // Store real appointment number
        type: formData.reason,
        date: selectedDate.toISOString().split('T')[0], // Use consistent date format
        time: formData.time,
        lastName: formData.lastName,
        firstName: formData.firstName,
        middleInitial: formData.middleInitial,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        reasonOfVisit: formData.reason,
        appointmentDate: selectedDate.toISOString().split('T')[0],
        appointmentTime: formData.time,
        status: result.status || 'pending', // Use real status from backend
        // Include all real backend data
        dbId: result.id, // Store database ID
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      };

      // Keep existing local storage save
      saveRecentAppointments(newAppointment);

      alert('Appointment Confirmed!');

      // Navigate with the real appointment data
      navigate(`/QRCodeAppointment/${result.appointmentNumber || appointmentId}`, { 
        state: { 
          appointment: {
            ...newAppointment,
            // Pass real backend data
            id: result.id,
            appointmentNumber: result.appointmentNumber,
            status: result.status
          }
        } 
      });

      // Keep existing form reset
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
      console.error('Error creating real appointment:', error);
      
      // Show error message from backend
      let errorMessage = 'Failed to create appointment. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="AppointmentFormsContainer">
      {showDialog && (
        <div className="DialogOverlay">
          <div className="DialogBox">
            {onBack && (
              <button className="DialogBackButton" onClick={onBack}>
                X
              </button>
            )}

            <h3 className="DialogText">Who is this appointment for?</h3>
            <div className="DialogButtons">
              <button className="DialogButton SelfButton" onClick={() => handleDialogChoice(true)}>
                For Myself
              </button>
              <button
                className="DialogButton OtherButton"
                onClick={() => handleDialogChoice(false)}
              >
                For Someone Else
              </button>
            </div>
          </div>
        </div>
      )}

      {!showDialog && (
        <div className="AppointmentFContainer">
          <h2 className="AppointmentTitle">APPOINTMENT FORM</h2>

          <div className="FormGroup RowGroup">
            <div className="InputWrapper">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <span className="ErrorText">{errors.lastName}</span>}
            </div>
            <div className="InputWrapper">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <span className="ErrorText">{errors.firstName}</span>}
            </div>
            <div className="InputWrapper SmallInput">
              <label>Middle Initial</label>
              <input
                type="text"
                name="middleInitial"
                value={formData.middleInitial}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="FormGroup RowGroup">
            <div className="InputWrapper LargeInput">
              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
              {errors.address && <span className="ErrorText">{errors.address}</span>}
            </div>
            <div className="InputWrapper">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handlePhoneNumberChange}
                maxLength="11"
              />
              {errors.phoneNumber && <span className="ErrorText">{errors.phoneNumber}</span>}
            </div>
          </div>

          <div className="FormGroup SlotGroup">
            <div className="InputWrapper AppointTime">
              <label>Reason for Visit</label>
              <select name="reason" value={formData.reason} onChange={handleChange}>
                <option value="">Select a Reason</option>
                <option value="Birth Certificate">Birth Certificate</option>
                <option value="Marriage Certificate">Marriage Certificate</option>
                <option value="Death Certificate">Death Certificate</option>
              </select>
              {errors.reason && <span className="ErrorText">{errors.reason}</span>}
            </div>

            <div className="InputWrapper AppointTime">
              <label className="AppointTimeSelected">Select Time</label>
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
              {errors.time && <span className="ErrorText">{errors.time}</span>}
              {loadingSlots && <span className="InfoText">Fetching real-time availability...</span>}
            </div>
          </div>

          <div className="FormGroup RowGroup">
            <div className="InputWrapper">
              <label>Select Date of Visit</label>
              <Calendar
                className="Calendar"
                onChange={handleDateChange}
                value={selectedDate}
                tileDisabled={({ date }) =>
                  date.getDay() === 0 || date.getDay() === 6 || date < new Date()
                }
              />
              {errors.date && <span className="ErrorText">{errors.date}</span>}
              {tooltip && <span className="ErrorText">Office is closed on weekends.</span>}
              {selectedDate && (
                <div className="SelectedDateInfo">
                  Selected: {selectedDate.toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="ConfirmContainer">
              <button 
                className="ConfirmButton" 
                onClick={handleSubmit}
                disabled={isSubmitting || loadingSlots}
              >
                {isSubmitting ? 'Creating Appointment...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentContainer;
