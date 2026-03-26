import React, { useState, useContext } from 'react';
import {
  Card, CardContent, TextField, Button, Box, Avatar,
  Typography, Alert, LinearProgress, IconButton, Tooltip,
} from '@mui/material';
import { Send, ImageOutlined, Close } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { createPost } from '../api';

export default function CreatePost({ onPostCreated }) {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [showImageField, setShowImageField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : '?';
  const canSubmit = (text.trim() || image.trim()) && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const { data } = await createPost({ text: text.trim(), image: image.trim() });
      onPostCreated(data);
      setText('');
      setImage('');
      setShowImageField(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <Card sx={{ background: 'rgba(26,26,46,0.9)', backdropFilter: 'blur(10px)' }}>
      {loading && <LinearProgress sx={{ borderRadius: '12px 12px 0 0', '& .MuiLinearProgress-bar': { background: '#6C63FF' } }} />}
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Avatar sx={{
            background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
            width: 40, height: 40, fontSize: 14, fontWeight: 700, flexShrink: 0,
          }}>
            {initials}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth multiline minRows={2} maxRows={6}
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: 15, color: '#e0e0f0', '&::placeholder': { color: '#9090b0' } },
              }}
            />

            {showImageField && (
              <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth size="small" placeholder="Paste image URL..."
                  value={image} onChange={(e) => setImage(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <IconButton size="small" onClick={() => { setShowImageField(false); setImage(''); }}>
                  <Close fontSize="small" sx={{ color: '#9090b0' }} />
                </IconButton>
              </Box>
            )}

            {image && (
              <Box sx={{ mt: 1.5, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                <img
                  src={image} alt="preview"
                  style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </Box>
            )}

            {error && <Alert severity="error" sx={{ mt: 1.5, borderRadius: 2, py: 0 }}>{error}</Alert>}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
              <Tooltip title="Add image URL">
                <IconButton
                  size="small"
                  onClick={() => setShowImageField(!showImageField)}
                  sx={{ color: showImageField ? '#6C63FF' : '#9090b0' }}
                >
                  <ImageOutlined />
                </IconButton>
              </Tooltip>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">Ctrl+Enter</Typography>
                <Button
                  variant="contained" size="small"
                  endIcon={<Send fontSize="small" />}
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  sx={{ px: 2 }}
                >
                  Post
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
