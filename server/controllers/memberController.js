const Member = require('../models/Member');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all members
// @route   GET /api/members
// @access  Public
exports.getMembers = async (req, res, next) => {
  try {
    const members = await Member.getActiveMembers();

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Public
exports.getMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return next(new ErrorResponse(`Member not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new member
// @route   POST /api/members
// @access  Private/Admin
exports.createMember = async (req, res, next) => {
  try {
    const member = await Member.create(req.body);

    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private/Admin
exports.updateMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!member) {
      return next(new ErrorResponse(`Member not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private/Admin
exports.deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return next(new ErrorResponse(`Member not found with id of ${req.params.id}`, 404));
    }

    await member.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};