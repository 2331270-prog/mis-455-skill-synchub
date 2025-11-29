const CollabRequest = require('../models/CollabRequest');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all collaboration requests (public)
// @route   GET /api/collab/public
// @access  Public
exports.getCollabRequestsPublic = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by priority if provided
    if (priority) {
      query.priority = priority;
    }

    const skip = (page - 1) * limit;
    const collabRequests = await CollabRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CollabRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      count: collabRequests.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(total / limit)
      },
      data: collabRequests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all collaboration requests
// @route   GET /api/collab
// @access  Private/Admin
exports.getCollabRequests = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by priority if provided
    if (priority) {
      query.priority = priority;
    }

    const skip = (page - 1) * limit;
    const collabRequests = await CollabRequest.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CollabRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      count: collabRequests.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(total / limit)
      },
      data: collabRequests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single collaboration request
// @route   GET /api/collab/:id
// @access  Private/Admin
exports.getCollabRequest = async (req, res, next) => {
  try {
    const collabRequest = await CollabRequest.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('response.respondedBy', 'name email');

    if (!collabRequest) {
      return next(new ErrorResponse(`Collaboration request not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: collabRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new collaboration request
// @route   POST /api/collab
// @access  Public
exports.createCollabRequest = async (req, res, next) => {
  try {
    const collabRequest = await CollabRequest.create(req.body);

    res.status(201).json({
      success: true,
      data: collabRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update collaboration request
// @route   PUT /api/collab/:id
// @access  Private/Admin
exports.updateCollabRequest = async (req, res, next) => {
  try {
    const { status, message, priority, assignedTo } = req.body;
    
    let collabRequest = await CollabRequest.findById(req.params.id);

    if (!collabRequest) {
      return next(new ErrorResponse(`Collaboration request not found with id of ${req.params.id}`, 404));
    }

    // Update fields
    if (status) {
      await collabRequest.updateStatus(status, message, req.user.id);
    }
    
    if (priority) {
      collabRequest.priority = priority;
    }
    
    if (assignedTo) {
      collabRequest.assignedTo = assignedTo;
    }

    await collabRequest.save();

    res.status(200).json({
      success: true,
      data: collabRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete collaboration request
// @route   DELETE /api/collab/:id
// @access  Private/Admin
exports.deleteCollabRequest = async (req, res, next) => {
  try {
    const collabRequest = await CollabRequest.findById(req.params.id);

    if (!collabRequest) {
      return next(new ErrorResponse(`Collaboration request not found with id of ${req.params.id}`, 404));
    }

    await collabRequest.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get collaboration requests by status
// @route   GET /api/collab/status/:status
// @access  Private/Admin
exports.getCollabRequestsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const collabRequests = await CollabRequest.getRequestsByStatus(status);

    res.status(200).json({
      success: true,
      count: collabRequests.length,
      data: collabRequests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending collaboration requests
// @route   GET /api/collab/pending
// @access  Private/Admin
exports.getPendingCollabRequests = async (req, res, next) => {
  try {
    const collabRequests = await CollabRequest.getPendingRequests();

    res.status(200).json({
      success: true,
      count: collabRequests.length,
      data: collabRequests
    });
  } catch (error) {
    next(error);
  }
};