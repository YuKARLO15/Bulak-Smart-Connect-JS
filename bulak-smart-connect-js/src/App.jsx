import { Route, Routes } from 'react-router-dom'; // Import necessary components from react-router-dom
import './App.css';
import SignupForm from './pages/SignUpForm'; 
import LogIn from './LogInComponents/LogIn';  
import Dashboard from './DashboardComponents/Dashboard'; 

function App() {
  return (
    <Routes>
      {/* Define Routes */}
      <Route path="/" element={<LogIn />} />
      <Route path='/SignUpForm' element={<SignupForm />} />
      <Route path='/DashBoard' element={<Dashboard />} />
    </Routes>
  );
}

export default App;
