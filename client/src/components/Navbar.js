import React, { useContext } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar, Tooltip, Container,
} from '@mui/material';
import { Logout, Hub } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '?';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(15,15,26,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(108,99,255,0.15)',
      }}
    >
      <Container maxWidth="sm">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 0.5 }}>
          {/* Brand */}
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
            <Hub sx={{ color: '#6C63FF', fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                letterSpacing: '-0.3px',
              }}
            >
              ConnectSphere
            </Typography>
          </Box>

          {/* User area */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title="View Profile">
              <Avatar
                component={RouterLink}
                to={`/profile/${user?.id}`}
                sx={{
                  width: 34, height: 34, fontSize: 13, fontWeight: 700,
                  background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  border: '2px solid transparent',
                  transition: '0.2s',
                  '&:hover': { border: '2px solid #6C63FF', transform: 'scale(1.05)' }
                }}
              >
                {initials}
              </Avatar>
            </Tooltip>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Logout fontSize="small" />}
              onClick={logout}
              sx={{
                borderColor: 'rgba(108,99,255,0.4)',
                color: '#9090b0',
                '&:hover': {
                  borderColor: '#FF6584',
                  color: '#FF6584',
                  background: 'rgba(255,101,132,0.08)',
                },
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
