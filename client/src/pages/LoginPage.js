import React, { useState, useContext, useEffect } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Link, Alert, CircularProgress, InputAdornment, IconButton, Stack,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { AuthContext } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ user_email_field: '', user_password_field: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    // Force clear inputs on component mount
    setForm({ user_email_field: '', user_password_field: '' });
    setEmailError('');
    setError('');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'user_email_field') {
      setEmailError(value && !EMAIL_REGEX.test(value) ? 'Enter a valid email address' : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.user_email_field || !EMAIL_REGEX.test(form.user_email_field)) {
      setEmailError('Enter a valid email address');
      return;
    }

    if (!form.user_password_field) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      // Map back to original field names for backend
      const loginData = {
        email: form.user_email_field,
        password: form.user_password_field
      };
      const { data } = await loginUser(loginData);
      login(data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        px: 2,
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: '-10%',
          left: '-10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(108,99,255,0.12)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '-10%',
          right: '-10%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'rgba(255,101,132,0.10)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          zIndex: 1,
          borderRadius: 3,
          p: 2,
          bgcolor: 'rgba(18, 21, 40, 0.88)',
          boxShadow: '0 20px 45px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                }}
              >
                ConnectSphere
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Welcome back! Sign in to continue.
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ borderRadius: 2 }} role="alert">{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email Address"
                  name="user_email_field"
                  type="email"
                  value={form.user_email_field}
                  onChange={handleChange}
                  autoComplete="off"
                  autoFocus
                  aria-label="Email Address"
                  aria-required="true"
                  error={!!emailError}
                  helperText={emailError || ' '}
                  InputLabelProps={{ style: { color: '#b0b0cc' } }}
                  InputProps={{
                    autoComplete: "off",
                    'aria-describedby': 'signup-email-helper-text'
                  }}
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
                  label="Password"
                  name="user_password_field"
                  type={showPassword ? 'text' : 'password'}
                  value={form.user_password_field}
                  onChange={handleChange}
                  autoComplete="new-password"
                  aria-label="Password"
                  aria-required="true"
                  InputLabelProps={{ style: { color: '#b0b0cc' } }}
                  InputProps={{
                    autoComplete: "new-password",
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          sx={{ color: '#b0b0cc' }}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || !form.user_email_field || !form.user_password_field || !!emailError}
                  sx={{ py: 1.4, borderRadius: 2 }}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
                </Button>
              </Stack>
            </Box>

            <Typography align="center" variant="body2" color="text.secondary">
              Don&apos;t have an account?{' '}
              <Link component={RouterLink} to="/signup" sx={{ color: '#6C63FF', fontWeight: 600 }}>
                Sign Up
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

