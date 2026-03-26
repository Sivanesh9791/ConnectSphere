import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Avatar,
  CircularProgress
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { addComment } from '../api';
import { formatDistanceToNow } from '../utils/time';

export default function CommentSection({ postId, comments, onCommentAdded, currentUserId }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await addComment(postId, { text: text.trim() });
      setText('');
      onCommentAdded(data);
    } catch {
      setError('Failed to add comment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ px: 2, py: 1.5 }}>
      {/* Existing comments */}
      {comments.length > 0 && (
        <Box sx={{ mb: 1.5, maxHeight: 200, overflowY: 'auto', pr: 0.5 }}>
          {comments.map((c, i) => {
            const uname = c.userId?.username || 'User';
            const hue = uname.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;
            return (
              <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Avatar
                  sx={{
                    width: 28, height: 28, fontSize: 11, fontWeight: 700, flexShrink: 0,
                    background: `linear-gradient(135deg, hsl(${hue},70%,55%), hsl(${(hue + 60) % 360},70%,55%))`,
                  }}
                >
                  {uname.slice(0, 2).toUpperCase()}
                </Avatar>
                <Box sx={{
                  background: 'rgba(108,99,255,0.08)', borderRadius: 2,
                  px: 1.5, py: 0.8, flex: 1,
                }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                    <Typography variant="caption" fontWeight={700} color="text.primary">
                      {uname}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(c.createdAt)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#c0c0d8', lineHeight: 1.5 }}>
                    {c.text}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {comments.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontStyle: 'italic' }}>
          No comments yet. Be the first!
        </Typography>
      )}

      {/* Add comment */}
      {currentUserId && (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth size="small" placeholder="Write a comment..."
            value={text} onChange={(e) => setText(e.target.value)}
            error={!!error} helperText={error}
            disabled={loading}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          <Button
            type="submit" variant="contained" size="small"
            disabled={!text.trim() || loading}
            sx={{ minWidth: 40, px: 1.5, borderRadius: 3 }}
          >
            {loading ? <CircularProgress size={16} color="inherit" /> : <Send fontSize="small" />}
          </Button>
        </Box>
      )}
    </Box>
  );
}
