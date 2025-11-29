const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember
} = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

// Get all members
router.get('/', getMembers);

// Get single member
router.get('/:id', getMember);

// Create member (admin only)
router.post('/', protect, authorize('admin'), createMember);

// Update member (admin only)
router.put('/:id', protect, authorize('admin'), updateMember);

// Delete member (admin only)
router.delete('/:id', protect, authorize('admin'), deleteMember);

module.exports = router;