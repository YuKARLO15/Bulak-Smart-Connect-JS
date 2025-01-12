import { Route, Routes } from 'react-router-dom'; // Import necessary components from react-router-dom
import './App.css';
import SignUpForm from './pages/SignUpForm'; 
import LogIn from './LogInComponents/LogIn';  
import UserDashboard from './UserDashboard/UserDashboard'; 




function App() {
  return (
    <Routes>
      {/* Define Routes */}
      <Route path="/" element={<LogIn />} />
      <Route path='/SignUpForm' element={<SignUpForm />} />
      <Route path='/UserDashBoard' element={<UserDashboard />} />
    </Routes>
  );
}

export default App
