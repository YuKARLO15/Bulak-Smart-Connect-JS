import { Route, Routes } from 'react-router-dom'; // Import necessary components from react-router-dom
import './App.css';
import SignupForm from './pages/SignUpForm'; // Assuming your SignUpForm is here
import LogIn from './LogInComponents/LogIn';  // Assuming your LogIn component is here

function App() {
  return (
    <Routes>
      {/* Define Routes for LogIn and SignUpForm */}
      <Route path="/" element={<LogIn />} />
      <Route path='/SignUpForm' element={<SignupForm />} />
    </Routes>
  );
}

export default App;
