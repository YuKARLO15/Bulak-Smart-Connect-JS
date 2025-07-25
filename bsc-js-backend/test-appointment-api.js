const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.SERVER_URL || 'http://localhost:3000';

async function testAppointmentEndpoints() {
  try {
    // Get available slots for a specific date
    const availableSlotsResponse = await axios.get(`${API_BASE_URL}/appointments/available-slots?date=2025-05-30`);
    console.log('Available slots:', availableSlotsResponse.data);
    
    // Create a test appointment
    const createAppointmentResponse = await axios.post(`${API_BASE_URL}/appointments`, {
      firstName: 'Test',
      lastName: 'User',
      middleInitial: 'T',
      address: '123 Test Street, Test City',
      phoneNumber: '09123456789',
      reasonOfVisit: 'Birth Certificate',
      appointmentDate: '2025-05-30',
      appointmentTime: '10:00 AM - 10:30 AM',
      isGuest: true
    });
    console.log('Created appointment:', createAppointmentResponse.data);
    
    // Retrieve the appointment by ID
    const appointmentId = createAppointmentResponse.data.id;
    const getAppointmentResponse = await axios.get(`${API_BASE_URL}/appointments/${appointmentId}`);
    console.log('Retrieved appointment:', getAppointmentResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testAppointmentEndpoints();
