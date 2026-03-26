import React, { useState } from 'react';
import {
  Card, CardContent, CardActions, Box, Avatar, Typography,
  IconButton, Chip, Divider, Collapse, Tooltip, Menu, MenuItem, ListItemIcon,
  TextField, Button,
} from '@mui/material';
import {
  Favorite, FavoriteBorder, ChatBubbleOutline, ChatBubble, MoreVert,
  DeleteOutline, EditOutlined, Send
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { likePost, deletePost, updatePost } from '../api';
import CommentSection from './CommentSection';
import { formatDistanceToNow } from '../utils/time';

export default function PostCard({ post: initialPost, currentUserId, onPostUpdated, onPostDeleted }) {
  const [post, setPost] = useState(initialPost);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ text: initialPost.text, image: initialPost.image });
  const [editLoading, setEditLoading] = useState(false);

  const isLiked = currentUserId && post.likes.some(
    (id) => id === currentUserId || id?._id === currentUserId || id?.toString() === currentUserId
  );
  
  const isOwner = currentUserId && (post.userId === currentUserId || post.userId?._id === currentUserId);
  const username = post.userId?.username || 'Unknown';
  const initials = username.slice(0, 2).toUpperCase();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLike = async () => {
    if (!currentUserId || likeLoading) return;
    setLikeLoading(true);
    try {
      const { data } = await likePost(post._id);
      setPost(data);
      onPostUpdated(data);
    } catch {}
    finally { setLikeLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(post._id);
      if (onPostDeleted) onPostDeleted(post._id);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete post');
    }
    handleMenuClose();
  };

  const handleEditSave = async () => {
    if (!editForm.text.trim() && !editForm.image.trim()) return;
    setEditLoading(true);
    try {
      const { data } = await updatePost(post._id, editForm);
      setPost(data);
      setIsEditing(false);
      onPostUpdated(data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to update post');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCommentAdded = (updatedPost) => {
    setPost(updatedPost);
    onPostUpdated(updatedPost);
  };

  // Generate a consistent hue for avatar based on username
  const hue = username.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <Card
      sx={{
        background: 'rgba(26,26,46,0.9)',
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
        },
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box
            component={RouterLink}
            to={`/profile/${post.userId?._id || post.userId}`}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: 'inherit', '&:hover .username': { color: '#6C63FF' } }}
          >
            <Avatar
              sx={{
                width: 40, height: 40, fontSize: 14, fontWeight: 700,
                background: `linear-gradient(135deg, hsl(${hue},70%,55%), hsl(${(hue + 60) % 360},70%,55%))`,
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="text.primary" className="username" sx={{ transition: '0.2s' }}>
                {username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(post.createdAt)}
              </Typography>
            </Box>
          </Box>
          
          {isOwner && (
            <>
              <IconButton size="small" onClick={handleMenuOpen} sx={{ color: '#9090b0' }}>
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: { bgcolor: '#1a1a2e', color: '#e0e0f0', border: '1px solid rgba(108,99,255,0.2)' }
                }}
              >
                <MenuItem onClick={() => { setIsEditing(true); handleMenuClose(); }}>
                  <ListItemIcon><EditOutlined fontSize="small" sx={{ color: '#6C63FF' }} /></ListItemIcon>
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: '#FF6584' }}>
                  <ListItemIcon><DeleteOutline fontSize="small" sx={{ color: '#FF6584' }} /></ListItemIcon>
                  Delete
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Content */}
        {isEditing ? (
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth multiline minRows={2}
              value={editForm.text}
              onChange={(e) => setEditForm(prev => ({ ...prev, text: e.target.value }))}
              variant="outlined"
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(0,0,0,0.2)' } }}
            />
            <TextField
              fullWidth margin="dense" size="small" label="Image URL"
              value={editForm.image}
              onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))}
              sx={{ mt: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1.5 }}>
              <Button size="small" color="inherit" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button
                size="small" variant="contained"
                onClick={handleEditSave} disabled={editLoading}
                startIcon={editLoading ? null : <Send fontSize="small" />}
              >
                Save
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            {post.text && (
              <Typography variant="body1" sx={{ mb: 1.5, lineHeight: 1.7, color: '#d0d0e8', whiteSpace: 'pre-wrap' }}>
                {post.text}
              </Typography>
            )}

            {post.image && (
              <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 1.5 }}>
                <img
                  src={post.image}
                  alt="post"
                  style={{ width: '100%', maxHeight: 320, objectFit: 'cover', display: 'block' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </Box>
            )}
          </>
        )}
      </CardContent>

      {/* Stats row */}
      <Box sx={{ px: 2, pb: 0.5, display: 'flex', gap: 1 }}>
        {post.likes.length > 0 && (
          <Chip
            icon={<Favorite sx={{ fontSize: 14, color: '#FF6584 !important' }} />}
            label={post.likes.length}
            size="small"
            sx={{ background: 'rgba(255,101,132,0.1)', color: '#FF6584', fontSize: 12, height: 22 }}
          />
        )}
        {post.comments.length > 0 && (
          <Chip
            icon={<ChatBubble sx={{ fontSize: 14, color: '#6C63FF !important' }} />}
            label={`${post.comments.length} comment${post.comments.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{ background: 'rgba(108,99,255,0.1)', color: '#8b85ff', fontSize: 12, height: 22 }}
          />
        )}
      </Box>

      <Divider sx={{ mx: 2, mt: 0.5, borderColor: 'rgba(108,99,255,0.1)' }} />

      {/* Actions */}
      <CardActions sx={{ px: 1, py: 0.5 }}>
        <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
          <Box component="span">
            <IconButton
              onClick={handleLike}
              disabled={likeLoading || !currentUserId}
              size="small"
              sx={{
                gap: 0.5, borderRadius: 2, px: 1.5, py: 0.8,
                color: isLiked ? '#FF6584' : '#9090b0',
                '&:hover': { background: 'rgba(255,101,132,0.1)', color: '#FF6584' },
              }}
            >
              {isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
              <Typography variant="caption" fontWeight={600}>
                {isLiked ? 'Liked' : 'Like'}
              </Typography>
            </IconButton>
          </Box>
        </Tooltip>

        <IconButton
          onClick={() => setCommentsOpen(!commentsOpen)}
          size="small"
          sx={{
            gap: 0.5, borderRadius: 2, px: 1.5, py: 0.8,
            color: commentsOpen ? '#6C63FF' : '#9090b0',
            '&:hover': { background: 'rgba(108,99,255,0.1)', color: '#6C63FF' },
          }}
        >
          {commentsOpen ? <ChatBubble fontSize="small" /> : <ChatBubbleOutline fontSize="small" />}
          <Typography variant="caption" fontWeight={600}>Comment</Typography>
        </IconButton>
      </CardActions>

      {/* Comment Section (collapsible) */}
      <Collapse in={commentsOpen} timeout="auto" unmountOnExit>
        <Divider sx={{ borderColor: 'rgba(108,99,255,0.1)' }} />
        <CommentSection
          postId={post._id}
          comments={post.comments}
          onCommentAdded={handleCommentAdded}
          currentUserId={currentUserId}
        />
      </Collapse>
    </Card>
  );
}
