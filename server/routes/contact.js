const express = require('express');
const router = express.Router();
const {
  getContactMessages,
  getContactMessagesPublic,
  getContactMessage,
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
  getContactMessagesByStatus,
  getNewContactMessages,
  markAsRead
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Create contact message (public)
router.post('/', createContactMessage);

// Get all contact messages (public - for recent messages display)
router.get('/public', getContactMessagesPublic);

// Get all contact messages (admin only)
router.get('/', protect, authorize('admin'), getContactMessages);

// Get single contact message (admin only)
router.get('/:id', protect, authorize('admin'), getContactMessage);

// Update contact message (admin only)
router.put('/:id', protect, authorize('admin'), updateContactMessage);

// Delete contact message (admin only)
router.delete('/:id', protect, authorize('admin'), deleteContactMessage);

// Get contact messages by status (admin only)
router.get('/status/:status', protect, authorize('admin'), getContactMessagesByStatus);

// Get new contact messages (admin only)
router.get('/new', protect, authorize('admin'), getNewContactMessages);

// Mark contact message as read (admin only)
router.put('/:id/read', protect, authorize('admin'), markAsRead);

module.exports = router;