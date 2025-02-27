import { Route, Routes } from 'react-router-dom'; // Import necessary components from react-router-dom
import './App.css';
import LogIn from './LogInComponents/LogIn';  
import UserDashboard from './UserDashboard/UserDashboard'; 
import AppoionmentForm from './AppointmentComponents/AppointemtForm'; 
import ApplicationForm from './ApplicationComponents/ApplicationForm'; 
import SignUpForm from './SignUpComponents/SignUpForm'; 
import QRCodePage from './QRCodeComponents/QR';
import ClericalErrorApplication from './ApplicationComponents/BirthCertificateApplications/CorrectionClericalError';
import BirthCertificateDashboard from './ApplicationComponents/BirthCertificateApplications/BirthCertificateDashboard';
import FirstNameCorrection from './ApplicationComponents/BirthCertificateApplications/FristNameCorrection';
import MarriageLicenseApplication from './ApplicationComponents/MarriageCertificateApplications/MarriageLicenseApplication';
import Above18Registration from './ApplicationComponents/BirthCertificateApplications/DelayedAbove18';
import Below18Registration from './ApplicationComponents/BirthCertificateApplications/DelayedBelow18';





function App() {
  return (
    <Routes>
      {/* Define Routes */}
      <Route path="/" element={<LogIn />} />
      <Route path='/SignUpForm' element={<SignUpForm />} /> 
      <Route path='/UserDashBoard' element={<UserDashboard />} />
      <Route path='/AppointmentForm' element={<AppoionmentForm />} />
      <Route path='/ApplicationForm' element={<ApplicationForm/>} />
      <Route path='/QR' element={<QRCodePage />} />
      <Route path='/ClericalErrorApplication' element={<ClericalErrorApplication />} />
      <Route path='/BirthCertificateDashboard' element={<BirthCertificateDashboard />} />
      <Route path='/FirstNameCorrection' element={<FirstNameCorrection />} />
      <Route path='/MarriageLicenseApplication' element={<MarriageLicenseApplication />} />
      <Route path='/Above18Registration' element={<Above18Registration />} />
      <Route path='/Below18Registration' element={<Below18Registration />} />
      
    </Routes>
  );
}

export default App
