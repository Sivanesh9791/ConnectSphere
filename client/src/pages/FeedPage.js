import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { fetchPosts } from '../api';
import { AuthContext } from '../context/AuthContext';

export default function FeedPage() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = useCallback(async () => {
    try {
      setError('');
      const { data } = await fetchPosts();
      setPosts(data);
    } catch {
      setError('Failed to load posts. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f0f1a 0%, #0f0f1a 100%)' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ pt: 3, pb: 8 }}>
        <CreatePost onPostCreated={handlePostCreated} />

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress sx={{ color: '#6C63FF' }} />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary">No posts yet.</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Be the first to share something!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user?.id}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
