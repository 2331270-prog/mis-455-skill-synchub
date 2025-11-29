const express = require('express');
const router = express.Router();
const {
  getProposal,
  updateProposal,
  getProposalVersions,
  archiveProposal
} = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/auth');

// Get current project proposal
router.get('/', getProposal);

// Update project proposal (admin only)
router.put('/', protect, authorize('admin'), updateProposal);

// Get all proposal versions (admin only)
router.get('/versions', protect, authorize('admin'), getProposalVersions);

// Archive proposal (admin only)
router.put('/:id/archive', protect, authorize('admin'), archiveProposal);

module.exports = router;