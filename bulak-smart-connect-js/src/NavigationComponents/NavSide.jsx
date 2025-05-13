import React, { useState } from 'react';
import './NavSide.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DescriptionIcon from '@mui/icons-material/Description';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import TuneIcon from '@mui/icons-material/Tune';

const NavBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { logout, hasRole, user } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const getRoute = (regularRoute, adminRoute) => {
    return (hasRole('staff') || hasRole('admin') || hasRole('super_admin')) ? adminRoute : regularRoute;
  };

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <button
        className={`SidebarToggleBtn ${isSidebarOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="NavigationBar">
          <div className="Profile">
            <div className="NavUserName">{user?.name || 'Welcome'}</div>
            <div className="NavUserEmail">{user?.email || 'user@email.com'}</div>
            <div className="NavUserRole">{user?.roles?.[0] || 'User'}</div>
          </div>
    
          <div className="NavigationButtons">
            {/* Dashboard */}
            <Link 
              to={getRoute('/UserDashboard', '/AdminDashboard')} 
              className={isActive(getRoute('/UserDashboard', '/AdminDashboard')) ? 'active' : ''}
            >
              <DashboardIcon /> Dashboard
            </Link>
            
            {/* Home */}
            <Link 
              to={getRoute('/Home', '/AdminHome')} 
              className={isActive(getRoute('/Home', '/AdminHome')) ? 'active' : ''}
            >
              <HomeIcon /> Home
            </Link>
            
            {/* Appointments */}
            <Link 
              to={getRoute('/AppointmentForm', '/AdminAppointmentDashboard')} 
              className={isActive(getRoute('/AppointmentForm', '/AdminAppointmentDashboard')) ? 'active' : ''}
            >
              <EventNoteIcon /> Appointments
            </Link>
            
            {/* Document Applications */}
            <Link 
              to={getRoute('/ApplicationForm', '/ApplicationAdmin')} 
              className={isActive(getRoute('/ApplicationForm', '/ApplicationAdmin')) ? 'active' : ''}
            >
              <DescriptionIcon /> Document Application
            </Link>
            
            {/* Smart Walk-In */}
            <Link 
              to={getRoute('/WalkInQueue', '/AdminWalkInQueue')} 
              className={isActive(getRoute('/WalkInQueue', '/AdminWalkInQueue')) ? 'active' : ''}
            >
              <DirectionsWalkIcon /> Smart Walk-In
            </Link>

            {/* Staff+ links */}
            {(hasRole('staff') || hasRole('admin') || hasRole('super_admin')) && (
              <Link 
                to="/applicationAdmin" 
                className={isActive('/applicationAdmin') ? 'active' : ''}
              >
                <AdminPanelSettingsIcon /> Application Admin
              </Link>
            )}

            {/* Admin+ links */}
            {(hasRole('admin') || hasRole('super_admin')) && (
              <Link 
                to="/AdminAccountManagement" 
                className={isActive('/AdminAccountManagement') ? 'active' : ''}
              >
                <ManageAccountsIcon /> User Management
              </Link>
            )}

            {/* Super admin only links */}
            {hasRole('super_admin') && (
              <Link 
                to="/system-settings" 
                className={isActive('/system-settings') ? 'active' : ''}
              >
                <TuneIcon /> System Settings
              </Link>
            )}

            {/* Account */}
            <Link 
              to={getRoute('/account', '/AdminAccountManagement')} 
              className={isActive(getRoute('/account', '/AdminAccountManagement')) ? 'active' : ''}
            >
              <AccountCircleIcon /> Account
            </Link>
            
            {/* Settings */}
            <Link 
              to="/settings" 
              className={isActive('/settings') ? 'active' : ''}
            >
              <SettingsIcon /> Settings
            </Link>
          </div>
          
          <div className="Logout">
            <Link to="/" onClick={logout}>
              <LogoutIcon /> Log Out
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;