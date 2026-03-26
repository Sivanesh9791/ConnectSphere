import React, { useState, useContext, useEffect } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Link, Alert, CircularProgress, InputAdornment, IconButton, Stack,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { AuthContext } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    user_signup_user: '', 
    user_signup_email: '', 
    user_signup_pass: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    // Force clear inputs on component mount
    setForm({ 
      user_signup_user: '', 
      user_signup_email: '', 
      user_signup_pass: '' 
    });
    setEmailError('');
    setError('');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'user_signup_email') {
      setEmailError(value && !EMAIL_REGEX.test(value) ? 'Enter a valid email address' : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.user_signup_user.trim()) {
      setError('Username is required.');
      return;
    }

    if (!form.user_signup_email || !EMAIL_REGEX.test(form.user_signup_email)) {
      setEmailError('Enter a valid email address');
      return;
    }

    if (form.user_signup_pass.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      // Map back to original field names for backend
      const signupData = {
        username: form.user_signup_user,
        email: form.user_signup_email,
        password: form.user_signup_pass
      };
      const { data } = await registerUser(signupData);
      login(data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    form.user_signup_user.trim().length > 0 &&
    form.user_signup_email.trim().length > 0 &&
    EMAIL_REGEX.test(form.user_signup_email) &&
    form.user_signup_pass.length >= 6;

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
                Create your account and join the sphere.
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Username"
                  name="user_signup_user"
                  value={form.user_signup_user}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  aria-label="Username"
                  aria-required="true"
                  InputLabelProps={{ style: { color: '#b0b0cc' } }}
                  InputProps={{
                    autoComplete: "off",
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
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
                  name="user_signup_email"
                  type="email"
                  value={form.user_signup_email}
                  onChange={handleChange}
                  autoComplete="off"
                  required
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
                  name="user_signup_pass"
                  type={showPassword ? 'text' : 'password'}
                  value={form.user_signup_pass}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  aria-label="Password"
                  aria-required="true"
                  helperText="At least 6 characters"
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
                  disabled={loading || !isValid}
                  sx={{ py: 1.4, borderRadius: 2 }}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
                </Button>
              </Stack>
            </Box>

            <Typography align="center" variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" sx={{ color: '#6C63FF', fontWeight: 600 }}>
                Sign In
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
