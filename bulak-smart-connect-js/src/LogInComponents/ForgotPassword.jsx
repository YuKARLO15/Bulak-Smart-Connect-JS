import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import './ForgotPassword.css'; // Import the CSS file

export default function ForgotPassword({ open, handleClose }) {
  return (
    <Dialog
      open={open}
      className='DialogForgetPassword'
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          handleClose();
        },
      }}
    >
      <DialogTitle className="DialogTitle">Reset password</DialogTitle>
      <DialogContent className="DialogContent">
        <DialogContentText className="DiallogContentText">
          Enter your account&apos;s email address, and we&apos;ll send you a link to reset your password.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions className="DialogActions">
        <Button onClick={handleClose} className='CancelButton'>Cancel</Button>
        <Button variant="contained" className='ContinueButton' type="submit">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
