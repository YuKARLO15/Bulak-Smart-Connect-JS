import { Route, Routes } from 'react-router-dom'; // Import necessary components from react-router-dom
import './App.css';
//import SignUpForm from './SignUpComponents/SignUpForm'; //(FIRST SIGNUP HINDI NAKA HIWALAY PER COMPONENT)
import LogIn from './LogInComponents/LogIn';  
import UserDashboard from './UserDashboard/UserDashboard'; 
import AppoionmentForm from './AppointmentComponents/AppointemtForm'; 
import ApplicationForm from './ApplicationComponents/ApplicationForm'; 
import SignUpForm from './SignUpComponents/SignUpForm'; //(gumagana)
import QRCodePage from './QRCodeComponents/QR';
import FileUploadForm from './ApplicationComponents/BirthCertificateApplications/CorrectionClericalError';
import BirthCertificateDashboard from './ApplicationComponents/BirthCertificateApplications/BirthCertificateDashboard';




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
      <Route path='/FileUploadForm' element={<FileUploadForm />} />
      <Route path='/BirthCertificateDashboard' element={<BirthCertificateDashboard />} />
    </Routes>
  );
}

export default App
