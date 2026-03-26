import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Avatar, Paper, Stack, Divider,
  CircularProgress, Alert, Button
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { getUserProfile } from '../api';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await getUserProfile(userId);
      setProfileData(data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handlePostUpdated = (updatedPost) => {
    setProfileData(prev => ({
      ...prev,
      posts: prev.posts.map(p => p._id === updatedPost._id ? updatedPost : p)
    }));
  };

  const handlePostDeleted = (deletedId) => {
    setProfileData(prev => ({
      ...prev,
      posts: prev.posts.filter(p => p._id !== deletedId)
    }));
  };

  const handleEditProfile = () => {
    console.log("Edit Profile Clicked");
    navigate("/edit-profile");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f0f1a' }}>
        <Navbar />
        <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress sx={{ color: '#6C63FF' }} />
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f0f1a' }}>
        <Navbar />
        <Container sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
          <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mt: 2 }}>
            Go Back
          </Button>
        </Container>
      </Box>
    );
  }

  const { user, posts } = profileData;
  const isOwnProfile = currentUser?.id === user._id;
  const hue = user.username.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f0f1a 0%, #0f0f1a 100%)', pb: 8 }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ pt: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 2, color: '#9090b0' }}>
          Back
        </Button>
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(26,26,46,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(108,99,255,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative background blur */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(108,99,255,0.15)',
              filter: 'blur(40px)',
              zIndex: 0
            }}
          />

          <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: 40,
                fontWeight: 800,
                background: `linear-gradient(135deg, hsl(${hue},70%,55%), hsl(${(hue + 60) % 360},70%,55%))`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                border: '4px solid rgba(255,255,255,0.05)'
              }}
            >
              {user.username.slice(0, 2).toUpperCase()}
            </Avatar>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={800} sx={{ color: '#e0e0f0' }}>
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>

            <Divider sx={{ width: '100%', borderColor: 'rgba(108,99,255,0.1)' }} />

            <Stack direction="row" spacing={4} sx={{ width: '100%', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} color="#6C63FF">
                  {posts.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">Posts</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} color="#FF6584">
                   {new Date(user.createdAt).getFullYear()}
                </Typography>
                <Typography variant="caption" color="text.secondary">Joined</Typography>
              </Box>
            </Stack>

            {isOwnProfile && (
              <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={handleEditProfile}
                sx={{ borderRadius: 2, textTransform: 'none', borderColor: 'rgba(108,99,255,0.4)', color: '#9090b0' }}
              >
                Edit Profile
              </Button>
            )}
          </Stack>
        </Paper>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, px: 1 }}>
            {isOwnProfile ? 'Your Posts' : `Posts by ${user.username}`}
          </Typography>
          
          {posts.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', background: 'rgba(26,26,46,0.6)', borderRadius: 3 }}>
              <Typography color="text.secondary">No posts to show yet.</Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {posts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={currentUser?.id}
                  onPostUpdated={handlePostUpdated}
                  onPostDeleted={handlePostDeleted}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
}
