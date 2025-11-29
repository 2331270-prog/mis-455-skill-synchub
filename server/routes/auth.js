const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current logged in user
router.get('/me', protect, getMe);

// Log user out
router.get('/logout', protect, logout);

// Update user details
router.put('/updatedetails', protect, updateDetails);

// Update password
router.put('/updatepassword', protect, updatePassword);

module.exports = router;