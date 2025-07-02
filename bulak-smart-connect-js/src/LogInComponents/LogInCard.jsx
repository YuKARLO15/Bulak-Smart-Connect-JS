import React, { useState, useEffect } from 'react'; //useState Here
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ForgotPassword from './ForgotPassword';
import './LogInCard.css';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; //Current AuthContext to handle login and roles
import { authService } from '../services/api'; //API Service to NestJS, initially used on early iteration of the login, without the roles

export default function LogInCard({ onLogin }) {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [loginType, setLoginType] = useState('email');  // Add login type state
  const [showPassword, setShowPassword] = useState(false); // Show password state
  const [rememberMe, setRememberMe] = useState(false); // Remember me state
  const navigate = useNavigate();
  const { login, hasRole, isStaff } = useAuth(); // New AuthContext to handle login and roles

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const savedLoginType = localStorage.getItem('rememberedLoginType');
    const wasRemembered = localStorage.getItem('rememberMe') === 'true';
    
    if (wasRemembered && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setLoginType(savedLoginType || 'email');
      setRememberMe(true);
    }
  }, []);

  // Show message from password change redirect
  useEffect(() => {
    if (location.state?.message) {
      setMessage({ 
        text: location.state.message, 
        type: location.state.type || 'success' 
      });
      // Clear the state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const toggleLoginType = () => {
    const newType = loginType === 'email' ? 'username' : 'email';
    setLoginType(newType);
    
    // Clear validation errors when switching
    setEmailError(false);
    setEmailErrorMessage('');
    setEmail('');
  };

  // Get input label based on login type
  const getInputLabel = () => loginType === 'email' ? 'Email' : 'Username';

  // Get placeholder text based on login type
  const getPlaceholder = () => loginType === 'email' ? 'your@email.com' : 'username';

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    
    if (validateInputs()) {
      try {
        console.log(`Sending login request with ${loginType}:`, { [loginType]: email, password });

        // Old Method to use the API service from api.js, now using the AuthContext
        //console.log('Sending login request with:', { email, password });
  
        //Old Logic to use the API service from api.js, now using the AuthContext
        //const data = await authService.login(email, password);
        //console.log('Login successful:', data);
        //onLogin(data.user);
        //login(); // Set auth context
        //navigate("/UserDashboard");

        // Use the login function from AuthContext directly, eliminating the one used in api.js
        //const { success, user } = await login(email, password);
        // Old Method to use the API service from api.js, now using the AuthContext

        // Use the login function from AuthContext
        const { success, user } = await login(email, password, loginType);

        console.log('Login successful:', success);
        //Auth Success Step
        if (success) {
          // Handle "Remember Me" functionality
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
            localStorage.setItem('rememberedLoginType', loginType);
            localStorage.setItem('rememberMe', 'true');
          } else {
            // Clear saved credentials if "Remember Me" is unchecked
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
            localStorage.removeItem('rememberedLoginType');
            localStorage.removeItem('rememberMe');
          }

          if (user && (user.roles?.includes('staff') || 
              user.roles?.includes('admin') || 
              user.roles?.includes('super_admin'))) {
            console.log('User has admin role - navigating to AdminHome');
            navigate("/AdminHome");
          } else {
            console.log('User is a regular user - navigating to Home');
            navigate("/Home");
          }
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } catch (error) {
        console.error('Login error:', error);

        if (error.response) {
          console.log('Error status:', error.response.status);
          console.log('Error data:', error.response.data);
          setError(error.response.data.message || 'Invalid credentials');
        } else {
          setError("An error occurred during login. Please try again.");
        }
      }
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (loginType === 'email') {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setEmailError(true);
        setEmailErrorMessage('Please enter a valid email address.');
        isValid = false;
      } else {
        setEmailError(false);
        setEmailErrorMessage('');
      }
    } else {
      // Username validation
      if (!email || email.trim() === '') {
        setEmailError(true);
        setEmailErrorMessage('Please enter a valid username.');
        isValid = false;
      } else {
        setEmailError(false);
        setEmailErrorMessage('');
      }
    }

    // Password validation remains the same
    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <Card className="LogInCardContainer">
      <Typography variant="h4" className="LogInTitle">
        LOG IN
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate className="LogInForm">
        <FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormLabel htmlFor="email" className="LogInLabel">
              {getInputLabel()}
            </FormLabel>
          </Box>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type={loginType === 'email' ? 'email' : 'text'}
            name={loginType}
            placeholder={getPlaceholder()}
            autoComplete={loginType === 'email' ? 'email' : 'username'}
            autoFocus
            required
            fullWidth
            variant="outlined"
            className={`TextField ${emailError ? 'error' : ''}`}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Box className="PasswordContainer">
            <FormLabel htmlFor="password" className="LogInLabel">
              Password
            </FormLabel>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            className={`TextField ${passwordError ? 'error' : ''}`}
            value={password}
            onChange={e => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    sx={{ color: '#ffffff' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
           <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              className="ForgotPassword"
            >
              Forgot your password?
            </Link>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox 
              checked={rememberMe}
              onChange={handleRememberMeChange}
              value="remember" 
              sx={{ color: '#184a5b' }}
            />
          }
          label="Remember me"
          className="RememberMe"
        />
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button type="submit" fullWidth variant="contained" className="LoginButton">
          Log In
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Card>
  );
}
