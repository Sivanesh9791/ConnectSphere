import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, InputAdornment, Alert, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { changePassword } from '../api';

export default function ChangePasswordModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      handleClose();
      onSuccess(response.data.msg || 'Password updated successfully');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      color: '#e5e5ff',
      backgroundColor: 'rgba(24, 29, 59, 0.9)',
      borderRadius: 2,
      '& fieldset': { borderColor: 'rgba(108,99,255,0.35)' },
      '&:hover fieldset': { borderColor: '#6C63FF' },
      '&.Mui-focused fieldset': { borderColor: '#6C63FF' },
    },
    '& .MuiInputLabel-root': { color: '#b0b0cc' }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      sx={{ backdropFilter: 'blur(5px)' }}
      PaperProps={{
        sx: {
          backgroundColor: '#1e1e2f',
          padding: 3,
          borderRadius: 4,
          color: '#e5e5ff',
          border: '1px solid rgba(108,99,255,0.2)'
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid rgba(108,99,255,0.1)', mb: 2 }}>
        Change Password
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1, overflowY: 'visible' }}>
          {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
          
          <TextField
            fullWidth
            variant="outlined"
            label="Current Password"
            name="currentPassword"
            type={showCurrent ? 'text' : 'password'}
            value={form.currentPassword}
            onChange={handleChange}
            sx={{ ...inputStyles, mt: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowCurrent(!showCurrent)} sx={{ color: '#b0b0cc' }}>
                    {showCurrent ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="New Password"
            name="newPassword"
            type={showNew ? 'text' : 'password'}
            value={form.newPassword}
            onChange={handleChange}
            sx={inputStyles}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNew(!showNew)} sx={{ color: '#b0b0cc' }}>
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Confirm New Password"
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={handleChange}
            sx={inputStyles}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)} sx={{ color: '#b0b0cc' }}>
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pb: 0, borderTop: '1px solid rgba(108,99,255,0.1)', mt: 3 }}>
          <Button onClick={handleClose} sx={{ color: '#b0b0cc' }} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
              '&:hover': { filter: 'brightness(1.1)' }
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Update Password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
