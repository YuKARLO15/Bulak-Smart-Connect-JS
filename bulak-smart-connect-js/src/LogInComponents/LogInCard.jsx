import React, { useState } from "react"; //useState Here
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ForgotPassword from "./ForgotPassword";
import "./LogInCard.css";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; //Auth Context, updated with API service in code
import { authService } from "../services/api"; //API Service to NestJS, initially used on early iteration of the login, without the roles

export default function LogInCard({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // login function from AuthContext

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateInputs()) {
      try {
        console.log('Sending login request with:', { email, password });
        
        //Old Logic to use the API service from api.js, now using the AuthContext
        //const data = await authService.login(email, password);
        //console.log('Login successful:', data);
        //onLogin(data.user);
        //login(); // Set auth context
        //navigate("/UserDashboard");

        // Use the login function from AuthContext directly, eliminating the one used in api.js
        const success = await login(email, password);
        
        console.log('Login successful:', success);
        // If login is successful, navigate to the home page
        if (success) {
          navigate("/Home");
        } else {
          setError("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Login error:", error);
        
        if (error.response) {
          // Include more details for debugging
          console.log('Error status:', error.response.status);
          console.log('Error data:', error.response.data);
          setError(error.response.data.message || "Invalid credentials");
        } else {
          // Network error or other issue
          setError("An error occurred during login. Please try again.");
        }
      }
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <Card className="LogInCardContainer">
      <Typography variant="h4" className="LogInTitle">
        LOG IN
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        className="LogInForm"
      >
        <FormControl>
          <FormLabel htmlFor="email" className="LogInLabel">
            Email
          </FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            className={`TextField ${emailError ? "error" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Box className="PasswordContainer">
            <FormLabel htmlFor="password" className="LogInLabel">
              Password
            </FormLabel>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              className="ForgotPassword"
            >
              Forgot your password?
            </Link>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            className={`TextField ${passwordError ? "error" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControlLabel
          control={<Checkbox value="remember" color="#184a5b" />}
          label="Remember me"
          className="RememberMe"
        />
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          className="LoginButton"
        >
          Log In
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Card>
  );
}