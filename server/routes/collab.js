const express = require('express');
const router = express.Router();
const {
  getCollabRequests,
  getCollabRequestsPublic,
  getCollabRequest,
  createCollabRequest,
  updateCollabRequest,
  deleteCollabRequest,
  getCollabRequestsByStatus,
  getPendingCollabRequests
} = require('../controllers/collabController');
const { protect, authorize } = require('../middleware/auth');

// Create collaboration request (public)
router.post('/', createCollabRequest);

// Get all collaboration requests (public - for recent requests display)
router.get('/public', getCollabRequestsPublic);

// Get all collaboration requests (admin only)
router.get('/', protect, authorize('admin'), getCollabRequests);

// Get single collaboration request (admin only)
router.get('/:id', protect, authorize('admin'), getCollabRequest);

// Update collaboration request (admin only)
router.put('/:id', protect, authorize('admin'), updateCollabRequest);

// Delete collaboration request (admin only)
router.delete('/:id', protect, authorize('admin'), deleteCollabRequest);

// Get collaboration requests by status (admin only)
router.get('/status/:status', protect, authorize('admin'), getCollabRequestsByStatus);

// Get pending collaboration requests (admin only)
router.get('/pending', protect, authorize('admin'), getPendingCollabRequests);

module.exports = router;