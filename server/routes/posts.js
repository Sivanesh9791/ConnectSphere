const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Create post
router.post('/', auth, async (req, res) => {
  const { text, image } = req.body;
  try {
    const post = new Post({ userId: req.user.id, text, image });
    await post.save();
    const populated = await Post.findById(post._id)
      .populate('userId', 'username')
      .populate('comments.userId', 'username');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username')
      .populate('comments.userId', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Like/unlike post
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    const index = post.likes.indexOf(req.user.id);
    if (index > -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    const populated = await Post.findById(post._id)
      .populate('userId', 'username')
      .populate('comments.userId', 'username');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    post.comments.push({ userId: req.user.id, text });
    await post.save();
    const populated = await Post.findById(post._id)
      .populate('userId', 'username')
      .populate('comments.userId', 'username');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Edit post
router.put('/:id', auth, async (req, res) => {
  const { text, image } = req.body;
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Ensure user owns post
    if (post.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.text = text || post.text;
    post.image = image !== undefined ? image : post.image;
    
    await post.save();
    const populated = await Post.findById(post._id)
      .populate('userId', 'username')
      .populate('comments.userId', 'username');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Ensure user owns post
    if (post.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.deleteOne();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;