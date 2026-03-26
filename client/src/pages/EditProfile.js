import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Button, TextField,
  Stack, Alert, CircularProgress, Snackbar
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../api';
import ChangePasswordModal from '../components/ChangePasswordModal';

export default function EditProfile() {
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('Profile updated successfully!');
  const [emailError, setEmailError] = useState('');
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Pre-fill user data
  useEffect(() => {
    if (currentUser) {
      setForm({
        username: currentUser.username || '',
        email: currentUser.email || '',
      });
    }
  }, [currentUser]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      setEmailError(value && !EMAIL_REGEX.test(value) ? 'Enter a valid email address' : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.username.trim()) {
      setError('Username is required.');
      return;
    }

    if (!form.email || !EMAIL_REGEX.test(form.email)) {
      setEmailError('Enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(form);
      
      // Update local storage and context token if backend issues a new one
      // Since our new backend route returns the user object, we can't update token
      // But we can show a success message!
      
      setSuccessMsg('Profile updated successfully!');
      setSuccess(true);
      setTimeout(() => {
        navigate(`/profile/${currentUser.id}`);
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValid = 
    form.username.trim().length > 0 && 
    form.email.trim().length > 0 && 
    EMAIL_REGEX.test(form.email);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f0f1a 0%, #0f0f1a 100%)', pb: 8 }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ pt: 4 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(26,26,46,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(108,99,255,0.2)',
          }}
        >
          <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 3, color: '#9090b0' }}>
            Back
          </Button>
          
          <Typography variant="h4" fontWeight={800} sx={{ color: '#e0e0f0', mb: 4 }}>
            Edit Profile
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
              
              <TextField
                fullWidth
                variant="outlined"
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                InputLabelProps={{ style: { color: '#b0b0cc' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e5e5ff',
                    backgroundColor: 'rgba(24, 29, 59, 0.9)',
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(108,99,255,0.35)' },
                    '&:hover fieldset': { borderColor: '#6C63FF' },
                    '&.Mui-focused fieldset': { borderColor: '#6C63FF' },
                  },
                }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                error={!!emailError}
                helperText={emailError || ' '}
                InputLabelProps={{ style: { color: '#b0b0cc' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e5e5ff',
                    backgroundColor: 'rgba(24, 29, 59, 0.9)',
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(108,99,255,0.35)' },
                    '&:hover fieldset': { borderColor: '#6C63FF' },
                    '&.Mui-focused fieldset': { borderColor: '#6C63FF' },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || !isValid}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                sx={{ 
                  mt: 2, 
                  py: 1.5, 
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                  '&:hover': {
                    filter: 'brightness(1.1)'
                  }
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(108,99,255,0.1)', textAlign: 'center' }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => setIsPasswordModalOpen(true)}
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none', 
                color: '#b0b0cc',
                borderColor: 'rgba(108,99,255,0.3)',
                '&:hover': {
                  borderColor: '#FF6584',
                  color: '#FF6584'
                }
              }}
            >
              Change Password
            </Button>
          </Box>
        </Paper>
      </Container>
      
      <ChangePasswordModal 
        open={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={(msg) => {
          setSuccessMsg(msg);
          setSuccess(true);
        }}
      />

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
