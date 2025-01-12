import { Route, Routes } from 'react-router-dom'; // Import necessary components from react-router-dom
import './App.css';
import SignupForm from './pages/SignUpForm'; 
import LogIn from './LogInComponents/LogIn';  
import UserDashboard from './UserDashboard/UserDashboard'; 



function App() {
 
  return (
 <div><SignUpForm></SignUpForm></div>
  )
function App() {
  return (
    <Routes>
      {/* Define Routes */}
      <Route path="/" element={<LogIn />} />
      <Route path='/SignUpForm' element={<SignupForm />} />
      <Route path='/UserDashBoard' element={<UserDashboard />} />
    </Routes>
  );
}

export default App;
