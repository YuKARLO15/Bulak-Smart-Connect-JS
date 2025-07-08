import React, { useState, useEffect } from 'react'; //useState Here
import logger from '../utils/logger';
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
import { authLockoutService } from '../services/authLockoutService';

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
  const [loginType, setLoginType] = useState('email'); // Add login type state
  const [showPassword, setShowPassword] = useState(false); // Show password state
  const [rememberMe, setRememberMe] = useState(false); // Remember me state
  const [isLoginAttempting, setIsLoginAttempting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
  const [message, setMessage] = useState({ text: '', type: '' });
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
        type: location.state.type || 'success',
      });
      // Clear the state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Helper function to format time remaining
  const formatTimeRemaining = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Check lockout status when email changes
  useEffect(() => {
    if (email && email.trim()) {
      checkLockoutStatus();
    }
  }, [email]);

  // Add timer ref to store timer ID
  const [timerRef, setTimerRef] = useState(null);

  const checkLockoutStatus = async () => {
    if (!email || !email.trim()) return;

    // Clear any existing timer first
    if (timerRef) {
      clearInterval(timerRef);
      setTimerRef(null);
    }

    try {
      const lockoutData = await authLockoutService.checkAccountLockout(email);

      if (lockoutData.isLocked) {
        setIsAccountLocked(true);
        setLockoutTimeRemaining(lockoutData.timeRemaining);
        setLoginAttempts(lockoutData.attemptsUsed);

        // Start countdown timer and store reference
        const timer = setInterval(() => {
          setLockoutTimeRemaining(prev => {
            if (prev <= 1) {
              setIsAccountLocked(false);
              setLoginAttempts(0);
              clearInterval(timer);
              setTimerRef(null); // Clear the ref
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Store timer reference for cleanup
        setTimerRef(timer);
      } else {
        setIsAccountLocked(false);
        setLoginAttempts(lockoutData.attempts);
      }
    } catch (error) {
      logger.error('Error checking lockout status:', error);
    }
  };

  // Add cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (timerRef) {
        clearInterval(timerRef);
      }
    };
  }, [timerRef]);

  const toggleLoginType = () => {
    const newType = loginType === 'email' ? 'username' : 'email';
    setLoginType(newType);

    // Clear validation errors when switching
    setEmailError(false);
    setEmailErrorMessage('');
    setEmail('');
  };

  // Get input label based on login type
  const getInputLabel = () => (loginType === 'email' ? 'Email' : 'Username');

  // Get placeholder text based on login type
  const getPlaceholder = () => (loginType === 'email' ? 'your@email.com' : 'username');

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = event => {
    setRememberMe(event.target.checked);
  };

  // Replace your existing handleSubmit function
  const handleSubmit = async event => {
    event.preventDefault();

    // Check if account is locked
    if (isAccountLocked) {
      setError(`🔒 Account is locked. Try again in ${formatTimeRemaining(lockoutTimeRemaining)} or use "Forgot Password" to reset.`);
      return;
    }

    if (validateInputs()) {
      try {
        setIsLoginAttempting(true);
        logger.log(`Sending login request with ${loginType}:`, { [loginType]: email, password });

        // Old Method to use the API service from api.js, now using the AuthContext
        //logger.log('Sending login request with:', { email, password });

        //Old Logic to use the API service from api.js, now using the AuthContext
        //const data = await authService.login(email, password);
        //logger.log('Login successful:', data);
        //onLogin(data.user);
        //login(); // Set auth context
        //navigate("/UserDashboard");

        // Use the login function from AuthContext directly, eliminating the one used in api.js
        //const { success, user } = await login(email, password);
        // Old Method to use the API service from api.js, now using the AuthContext

        // Use the login function from AuthContext
        const { success, user } = await login(email, password, loginType);

        logger.log('Login successful:', success);

        if (success) {
          // Clear lockout on successful login
          await authLockoutService.clearAccountLockout(email);
          setLoginAttempts(0);
          setIsAccountLocked(false);

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

          if (
            user &&
            (user.roles?.includes('staff') ||
              user.roles?.includes('admin') ||
              user.roles?.includes('super_admin'))
          ) {
            logger.log('User has admin role - navigating to AdminHome');
            navigate('/AdminHome');
          } else {
            logger.log('User is a regular user - navigating to Home');
            navigate('/Home');
          }
        } else {
          await handleLoginFailure('Login failed. Please check your credentials.');
        }
      } catch (error) {
        logger.error('Login error:', error);

        let errorMessage = 'An error occurred during login. Please try again.';

        if (error.response) {
          logger.log('Error status:', error.response.status);
          logger.log('Error data:', error.response.data);

          // Check for specific error types
          if (error.response.status === 401) {
            errorMessage = error.response.data.message || 'Invalid credentials. Please check your email/username and password.';
          } else if (error.response.status === 404) {
            errorMessage = 'Account not found. Please check your email/username.';
          } else if (error.response.status === 403) {
            errorMessage = 'Account is disabled. Please contact support.';
          } else {
            errorMessage = error.response.data.message || 'Login failed. Please try again.';
          }
        }

        await handleLoginFailure(errorMessage);
      } finally {
        setIsLoginAttempting(false);
      }
    }
  };

  // Replace your existing handleLoginFailure function
  const handleLoginFailure = async errorMessage => {
    // 🔧 AUTO CLEAR PASSWORD ON FAILED LOGIN
    setPassword('');
    localStorage.removeItem('rememberedPassword');

    try {
      const attemptResult = await authLockoutService.recordFailedAttempt(email);
      
      setLoginAttempts(attemptResult.attempts);

      if (attemptResult.isLocked) {
        setIsAccountLocked(true);
        setLockoutTimeRemaining(attemptResult.timeRemaining);
        setError(`🔒 Account locked due to multiple failed attempts. Try again in ${Math.floor(attemptResult.timeRemaining / 60)} minutes or use "Forgot Password" to reset your account.`);

        // Start countdown timer
        const timer = setInterval(() => {
          setLockoutTimeRemaining(prev => {
            if (prev <= 1) {
              setIsAccountLocked(false);
              setLoginAttempts(0);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return;
      }

      // Set error message with attempt counter
      let finalErrorMessage = errorMessage;

      if (attemptResult.attempts >= 3) {
        const attemptsLeft = 5 - attemptResult.attempts;
        finalErrorMessage += ` (${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining before lockout)`;
      }

      // 🔧 SHOW ADDITIONAL HELP AFTER MULTIPLE FAILED ATTEMPTS
      if (attemptResult.attempts >= 3) {
        finalErrorMessage += ' Having trouble? Try using the "Forgot Password" option below.';
      }

      setError(finalErrorMessage);
    } catch (error) {
      logger.error('Error recording failed attempt:', error);
      setError(errorMessage);
    }

    // Auto focus and shake animation
    setTimeout(() => {
      const passwordInput = document.getElementById('password');
      if (passwordInput) {
        passwordInput.focus();
        passwordInput.classList.add('error-shake');
        setTimeout(() => passwordInput.classList.remove('error-shake'), 500);
      }
    }, 100);
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          className={`LoginButton ${isAccountLocked ? 'locked' : ''}`}
          disabled={isLoginAttempting || isAccountLocked}
        >
          {isAccountLocked
            ? `Locked (${formatTimeRemaining(lockoutTimeRemaining)})`
            : isLoginAttempting
              ? 'Logging in...'
              : 'Log In'}
        </Button>
        {error && (
          <Box sx={{ mt: 2 }}>
            <Typography
              color="error"
              sx={{
                fontSize: '0.9rem',
                textAlign: 'center',
                backgroundColor: isAccountLocked ? '#ffebee' : 'transparent',
                padding: isAccountLocked ? '12px' : '0',
                borderRadius: isAccountLocked ? '8px' : '0',
                border: isAccountLocked ? '1px solid #ffcdd2' : 'none',
              }}
            >
              {error}
            </Typography>

            {/* Show unlock countdown if account is locked */}
            {isAccountLocked && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  🕐 Account will unlock in: {formatTimeRemaining(lockoutTimeRemaining)}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClickOpen}
                  sx={{ mt: 1, color: '#184a5b', borderColor: '#184a5b' }}
                >
                  Reset Password Instead
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Card>
  );
}
