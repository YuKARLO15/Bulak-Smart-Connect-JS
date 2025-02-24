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
import { Link as RouterLink } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../firebase"; //Firbase Authentication


export default function LogInCard({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateInputs()) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();

        // Send token to backend
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          const data = await response.json();
          onLogin(data); // Save user session
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Invalid credentials");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        if (error.code === 'auth/user-not-found') {
          setError("User not found. Please check your email and password.");
        } else if (error.code === 'auth/wrong-password') {
          setError("Incorrect password. Please try again.");
        } else {
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