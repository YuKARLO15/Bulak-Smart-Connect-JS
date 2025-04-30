import React from 'react';
import './AppointmentDetails.css';
import UserInfoCard from './UserInfoCard';
// import NavBar from "../../NavigationComponents";  DI KO MAKUHA NAVBAR HUHU

const AppointmentDetailsCard = () => {
  const applicationData = {
    applicationNumber: 'AD003',
    lastName: 'Dela Cruz',
    firstName: 'Lorem Ipsum',
    middleInitial: 'B.',
    phone: '09123456789',
    email: 'loremipsumdelacruz@gmail.com',
    applicationType: 'Birth Certificate',
    subType: '(Delayed Registration Below 18 )',
    submissionDate: 'January 20, 2025',
  };

  return (
    <div className="main-container">
      {/* <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} /> */}
      {/*DI PA TAPOS <h2 className="document-title">Document Application</h2> */}
      <div className="appointment-wrapper">
        <UserInfoCard data={applicationData} />
      </div>
    </div>
  );
};

export default AppointmentDetailsCard;
