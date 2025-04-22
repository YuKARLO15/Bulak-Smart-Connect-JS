import { Route, Routes } from 'react-router-dom'; 
import './App.css';

//-----------USER SIDE --------------//
//Login and SignUp//
import LogIn from './LogInComponents/LogIn';
import SignUpForm from './UserBulakSmartConnect/SignUpComponents/SignUpForm';
import LandingPage from './LandingPageComponents/LandingPage';

//Dashboard//
import UserDashboard from './UserBulakSmartConnect/UserDashboard/UserDashboard';

//Appointment//
import AppoionmentForm from './UserBulakSmartConnect/AppointmentComponents/AppointemtForm';
import QRCodeAppointment from './UserBulakSmartConnect/AppointmentComponents/QRCodeAppointment'
import QRCodePage from './UserBulakSmartConnect/QRCodeComponents/QR';

//Application//
import ApplicationForm from './UserBulakSmartConnect/ApplicationComponents/ApplicationForm';
import ClericalErrorApplication from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/CorrectionClericalError';
import BirthCertificateDashboard from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/BirthCertificateDashboard';
import FirstNameCorrection from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/FirstNameCorrection';
import MarriageLicenseApplication from './UserBulakSmartConnect/ApplicationComponents/MarriageCertificateApplications/MarriageLicenseApplication';
import Above18Registration from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/DelayedAbove18';
import Below18Registration from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/DelayedBelow18';
import SexDobCorrection from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/CorrectionChildSex';
import DelayedOutOfTownRegistration from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/DelayedOutOfTown';
import DelayedOneParentForeignerRegistration from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/DelayedOneParentForeigner';
import BirthCertificateForm from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/BirthCertificateForm';

import PrivateRoute from './components/PrivateRoute';
import BirthApplicationSummary from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/BirthApplicationSummary';
import MarriageCertificateForm from './UserBulakSmartConnect/ApplicationComponents/MarriageCertificateApplications/MarriageCertificateForm/MarriageCertificateForm';
import MarriageSummaryForm from './UserBulakSmartConnect/ApplicationComponents/MarriageCertificateApplications/MarriageCertificateForm/MarriageSummaryForm';
//WalkIn//
import WalkInQueueContainer from './UserBulakSmartConnect/WalkInComponents/WalkInDashBoard';
import WalkInForm from './UserBulakSmartConnect/WalkInComponents/WalkInForm';
import WalkInQueueDetail from './UserBulakSmartConnect/WalkInComponents/WalkInDetails';

//-----------ADMIN SIDE --------------//

// Admin Account Management //
import AdminAccountManagement from './AdminBulakSmartConnect/AccountManagementComponents/AccountManagement';
import SearchAddUser from './AdminBulakSmartConnect/AccountManagementComponents/SearchAdd';
import AdminAddUser from './AdminBulakSmartConnect/AccountManagementComponents/AdminAddAccount';

// Admin Announcement //
// import AdminAnnouncement from './AdminBulakSmartConnect/AnnouncementComponents/AdminAnnouncement';
import AdminAnnouncement from './AdminBulakSmartConnect/AdminAnnouncementComponents/AdminAnnouncement';

// Application  //
import AdminApplicationDashboard from './AdminBulakSmartConnect/AdminApplicationComponents/ApplicationAdminDashboard';
import AdminApplicationForm from './AdminBulakSmartConnect/AdminApplicationComponents/AdminApplicationDetails';
import AppointmentDetailsCard from './AdminBulakSmartConnect/AppointmentDetailsComponents/AppointmentDetails';

function App() {
  return (
    <Routes>
      {/* Define Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/LogIn" element={<LogIn />} />
      <Route path="/SignUpForm" element={<SignUpForm />} />
      {/* Admin Accountmanagement */}
      <Route path="/AdminAccountManagement" element={<AdminAccountManagement />} />
      <Route path="AppointmentDetailsCard" element={<AppointmentDetailsCard/>} />
      <Route path="/SearchAddUser" element={<SearchAddUser />} />
      <Route path="/add-user" element={<AdminAddUser />} /> 
      {/* Admin Announcement */}
      {/* <Route path="/AdminAnnouncement" element={<AdminAnnouncement />} />  */}
      <Route path="/AdminAnnouncement" element={<AdminAnnouncement />} /> 
      <Route element={<PrivateRoute />}>
        {' '}
        {/* Protected Route Start */}
        <Route path="/Home" element={<LandingPage />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/AppointmentForm" element={<AppoionmentForm />} />
        <Route path="/ApplicationForm" element={<ApplicationForm />} />
        <Route path="/QR" element={<QRCodePage />} />
        <Route path="/ClericalErrorApplication" element={<ClericalErrorApplication />} />
        <Route path="/BirthCertificateDashboard" element={<BirthCertificateDashboard />} />
        <Route path="/FirstNameCorrection" element={<FirstNameCorrection />} />
        <Route path="/MarriageLicenseApplication" element={<MarriageLicenseApplication />} />
        <Route path="/Above18Registration" element={<Above18Registration />} />
        <Route path="/Below18Registration" element={<Below18Registration />} />
        <Route path="/SexDobCorrection" element={<SexDobCorrection />} />
        <Route path="/DelayedOutOfTownRegistration" element={<DelayedOutOfTownRegistration />} />
        <Route
          path="/DelayedOneParentForeignerRegistration"
          element={<DelayedOneParentForeignerRegistration />}
        />
        <Route path="/MarriageSummaryForm" element={<MarriageSummaryForm />} />
        <Route path="/QrCodeAppointment/:id" element={<QRCodeAppointment />} />
        <Route path="/BirthCertificateForm" element={<BirthCertificateForm />} />
        <Route path="/BirthApplicationSummary" element={<BirthApplicationSummary />} />
        <Route path="/MarriageCertificateForm" element={<MarriageCertificateForm />} />
        <Route path="/WalkInQueue" element={<WalkInQueueContainer />} />
        <Route path="/WalkInForm" element={<WalkInForm />} />
        <Route path="/WalkInDetails" element={<WalkInQueueDetail />} />
        <Route path="/applicationAdmin" element={<AdminApplicationDashboard />} />
        <Route path="/ApplicationDetails/:id" element={<AdminApplicationForm/>} />
      </Route>{' '}
      {/* Protected Route End */}
    </Routes>
  );
}

export default App;
