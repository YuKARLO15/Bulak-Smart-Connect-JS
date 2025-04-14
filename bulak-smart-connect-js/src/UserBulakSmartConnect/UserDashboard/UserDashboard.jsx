import React, { useState } from 'react';
import NavBar from '../NavSide';
import './UserDashboard.css'; // Import the CSS file
import DashboardContent from './DashboardContent';
import RecentApplicationsComponent from '../ApplicationComponents/RecentApplicationsComponent';
import DashboardButtons from './DashboardButtons';
import RecentAppointments from '../AppointmentComponents/RecentAppointment';
import Footer from '../../footer';

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <div className={`UserDashboardContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <DashboardContent />
        <DashboardButtons />
        <div className="BottomDashboard">
          <RecentAppointments />
          <RecentApplicationsComponent />
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};
export default UserDashboard;
