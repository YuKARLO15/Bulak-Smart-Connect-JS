import React, { useState } from 'react';
import './NavSide.css';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useAuth } from '../context/AuthContext'; // Import useAuth


const NavBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { logout, hasRole, user} = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const getRoute = (regularRoute, adminRoute) => {
    return (hasRole('staff') || hasRole("admin" ) || hasRole("admin" || "super_admin" )) ? adminRoute : regularRoute ;
  };

  return (
    <>
      <button
        className="SidebarToggleBtn"
        style={{ backgroundColor: isSidebarOpen ? '#8AACB5' : '#184a5b' }}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="NavigationBar">
          <div className="Profile">
        
  
            <div className="NavUserName">{user?.name || '[USERNAME]'}</div>
            <div className="NavUserEmail">{user?.email || 'User@email.com'}</div>
            <div className="NavUserRole"> {user?.roles?.[0] || 'Unknown Role'}</div>
          </div>
    
    
          <div className="NavigationButtons">
   
            {/* route links based on user role */}
            <a href={getRoute('/UserDashboard', '/AdminDashboard')}>Dashboard</a>
            <a href={getRoute('/Home', '/AdminHome')}>Home</a>
            <a href={getRoute('/AppointmentForm', '/AdminAppointmentDashboard')}>Appointments</a>
            <a href={getRoute('/ApplicationForm', '/ApplicationAdmin')}>Document Application</a>
            <a href={getRoute('/WalkInQueue', '/AdminWalkInQueue')}>Smart Walk-In</a>

            {/* Staff+ links */}
            {(hasRole('staff') || hasRole('admin') || hasRole('super_admin')) && (
              <a href="/applicationAdmin">Application Admin</a>
            )}

            {/* Admin+ links */}
            {(hasRole('admin') || hasRole('super_admin')) && (
              <a href="/AdminAccountManagement">User Management</a>
            )}

            {/* Super admin only links */}
            {hasRole('super_admin') && <a href="/system-settings">System Settings</a>}

            {/* Common links for all users cont. */}

            <a href={getRoute('/account', '/AdminAccountManagement')}>Account</a>
            <a href="/settings">Settings</a>
          </div>
          <div className="Logout">
            <Link to="/" onClick={logout}>
              Log Out
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
