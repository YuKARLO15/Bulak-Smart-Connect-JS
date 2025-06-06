import { Route, Routes } from 'react-router-dom';
//import { useEffect } from 'react'; 
import './App.css';

//-----------COMPONENTS --------------//
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './components/Unauthorized';
import InstallPrompt from './components/InstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';

//-----------SERVICES --------------//
//import { localStorageManager } from './services/localStorageManager';

//-----------USER SIDE --------------//

// User Privacy Policy //
import PrivacyPolicy from './UserBulakSmartConnect/TermsAndConditionComponents/TermsAndCondition';

//Login and SignUp//
import LogIn from './LogInComponents/LogIn';
import SignUpForm from './UserBulakSmartConnect/SignUpComponents/SignUpForm';
import LandingPage from './LandingPageComponents/LandingPage';

//Dashboard//
import UserDashboard from './UserBulakSmartConnect/UserDashboard/UserDashboard';

//Appointment//
import AppoionmentForm from './UserBulakSmartConnect/AppointmentComponents/AppointemtForm';
import QRCodeAppointment from './UserBulakSmartConnect/AppointmentComponents/QRCodeAppointment';
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
import CopyBirthCertificate from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/BirthCertificateForm/CopyBirthCertificate';
import BirthApplicationSummary from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/BirthApplicationSummary';
import MarriageCertificateForm from './UserBulakSmartConnect/ApplicationComponents/MarriageCertificateApplications/MarriageCertificateForm/MarriageCertificateForm';
import MarriageSummaryForm from './UserBulakSmartConnect/ApplicationComponents/MarriageCertificateApplications/MarriageCertificateForm/MarriageSummaryForm';
import CTCBirthCertificate from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/CTCBirthcertificate';
import RequirementBirthList from './UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/RequirementBirthList';
import MarriageDashboard from './UserBulakSmartConnect/ApplicationComponents/MarriageCertificateApplications/MarriageDashboard';
import MarriageCertificateApplication from './UserBulakSmartConnect/ApplicationComponents/MarriageCertificateApplications/MarriageCertificateApplication';
import MarriageLicenseSummary from './UserBulakSmartConnect/ApplicationComponents/MarriageCertificateApplications/MarriageCertificateForm/MarriageLicenseSummary';
import RequirementMarriageList from './UserBulakSmartConnect/ApplicationComponents/MarriageCertificateApplications/RequirementMarriageList';
//WalkIn//
import WalkInQueueContainer from './UserBulakSmartConnect/WalkInComponents/WalkInDashBoard';
import WalkInForm from './UserBulakSmartConnect/WalkInComponents/WalkInForm';
import WalkInQueueDetail from './UserBulakSmartConnect/WalkInComponents/WalkInDetails';

//User Accouunt//
import UserAccount from './UserBulakSmartConnect/UserAccountSettings/UserAccount';
//-----------ADMIN SIDE --------------//
//Admin Dashboard//
import AdminDashboard from './AdminBulakSmartConnect/AdminDashboard/AdminDashboard';
// Admin Account Management //
import AdminAccountManagement from './AdminBulakSmartConnect/AccountManagementComponents/AccountManagement';
import SearchAddUser from './AdminBulakSmartConnect/AccountManagementComponents/SearchAdd';
import AdminAddUser from './AdminBulakSmartConnect/AccountManagementComponents/AdminAddAccount';

// Admin Announcement //
import AdminAnnouncement from './AdminBulakSmartConnect/AdminAnnouncementComponents/AdminAnnouncement';

// Admin Application  //
import AdminApplicationDashboard from './AdminBulakSmartConnect/AdminApplicationComponents/ApplicationAdminDashboard';
import AdminApplicationForm from './AdminBulakSmartConnect/AdminApplicationComponents/AdminApplicationDetails';
import AppointmentDetailsCard from './AdminBulakSmartConnect/AppointmentDetailsComponents/AppointmentDetails';
// Admin Appointment  //
import AdminAppointmentDashboard from './AdminBulakSmartConnect/AdminAppointmentDashboard/AdminAppointmentDashboard';

// Admin WalkIn //
import AdminWalkInQueue from './AdminBulakSmartConnect/AdminWalkInQueue/AdminWalkInQueue';
import AdminWalkInDetails from './AdminBulakSmartConnect/AdminWalkInDetails/AdminWalkInDetails';

//Admin Account//
import AdminAccount from './AdminBulakSmartConnect/AdminAccount/AdminAccount';

function App() {
  /*
  // Initialize localStorageManager
  useEffect(() => {
    // Start monitoring localStorage usage
    localStorageManager.startMonitoring();
    
    // Log initial storage status
    const report = localStorageManager.getUsageReport();
    console.log('📊 Initial localStorage usage:', report);
    
    // Clean up on app start if needed
    if (parseFloat(report.percentage) > 80) {
      console.log('🧹 Performing initial cleanup...');
      localStorageManager.performCleanup(0.3);
    }
  }, []);
  */

  // App Routes
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/SignUpForm" element={<SignUpForm />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin routes - Protected for admin and super_admin */}
        <Route element={<PrivateRoute allowedRoles={['admin', 'super_admin']} />}>
          <Route path="/AdminAccountManagement" element={<AdminAccountManagement />} />
          <Route path="/SearchAddUser" element={<SearchAddUser />} />
          <Route path="/add-user" element={<AdminAddUser />} />
          <Route path="/admin-user-management" element={<AdminAccountManagement />} />

          {/* Admin Announcement */}
          <Route path="/AdminAnnouncement" element={<AdminAnnouncement />} />

          {/* Admin Account */}
          <Route path="/AdminAccount" element={<AdminAccount />} />
        </Route>


        {/* Staff routes - Protected for staff, admin and super_admin */}
        <Route element={<PrivateRoute allowedRoles={['staff', 'admin', 'super_admin']} />}>
          <Route path="/ApplicationAdmin" element={<AdminApplicationDashboard />} />
          <Route path="/ApplicationDetails/:id" element={<AdminApplicationForm />} />
          <Route path="AppointmentDetailsCard" element={<AppointmentDetailsCard />} />
          <Route path="/AdminWalkInQueue" element={<AdminWalkInQueue />} />
          <Route path="/AdminHome" element={<AdminDashboard />} />
          <Route path="/AdminWalkInDetails" element={<AdminWalkInDetails />} />
          <Route path="/AdminWalkInDetails/:id" element={<AdminWalkInDetails />} />
          <Route path="/AdminAppointmentDashboard" element={<AdminAppointmentDashboard />} />
        </Route>

        {/* User routes - Any authenticated user */}
        <Route element={<PrivateRoute />}>
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
          <Route path="/MarriageDashboard" element={<MarriageDashboard />} />
          <Route
            path="/MarriageCertificateApplication"
            element={<MarriageCertificateApplication />}
          />
          <Route path="/MarriageLicenseSummary" element={<MarriageLicenseSummary />} />

          <Route path="/QrCodeAppointment/:id" element={<QRCodeAppointment />} />
          <Route path="/BirthCertificateForm" element={<BirthCertificateForm />} />
          <Route path="/BirthApplicationSummary" element={<BirthApplicationSummary />} />
          <Route path="/MarriageForm" element={<MarriageCertificateForm />} />
          <Route path="/WalkInQueue" element={<WalkInQueueContainer />} />
          <Route path="/WalkInForm" element={<WalkInForm />} />
          <Route path="/WalkInDetails" element={<WalkInQueueDetail />} />
          <Route path="/CTCBirthCertificate" element={<CTCBirthCertificate />} />
          <Route path="/RequestACopyBirthCertificate" element={<CopyBirthCertificate />} />
          <Route path="/RequirementBirthList" element={<RequirementBirthList />} />
          <Route path="/MarriageSummaryForm" element={<MarriageSummaryForm />} />
          <Route path="/RequirementMarriageList" element={<RequirementMarriageList />} />
            <Route path="/UserAccount" element={<UserAccount />} />

          {/* User Privacy Policy */}
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        </Route>
      </Routes>
      <InstallPrompt />
      <OfflineIndicator />
    </AuthProvider>
  );
}

export default App;
