const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Update user profile
router.put('/update', auth, async (req, res) => {
  const { username, email } = req.body;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (username) {
        // Check if username is taken by someone else
        const existingUsername = await User.findOne({ username, _id: { $ne: req.user.id } });
        if (existingUsername) {
            return res.status(400).json({ msg: 'Username is already taken' });
        }
        user.username = username;
    }

    if (email) {
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ msg: 'Please enter a valid email address' });
        }
        // Check if email is taken by someone else
        const existingEmail = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (existingEmail) {
            return res.status(400).json({ msg: 'Email is already registered' });
        }
        user.email = email;
    }

    await user.save();
    
    // Return updated user (excluding password)
    res.json({
        id: user.id,
        username: user.username,
        email: user.email
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Change Password
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: 'Please provide both current and new passwords' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ msg: 'New password must be at least 6 characters' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect current password' });
    }

    // Hash and update new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
