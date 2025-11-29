// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Helper: create JWT (prefer model helper if available)
 */
const createTokenForUser = (user) => {
  if (typeof user.getSignedJwtToken === 'function') {
    return user.getSignedJwtToken();
  }
  const secret = process.env.JWT_SECRET || 'change_this_secret';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const name = req.body.name?.trim();
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = req.body.password;
    const role = req.body.role || 'user';

    if (!name || !email || !password) {
      return next(new ErrorResponse('Name, email and password are required', 400));
    }

    // Check if user already exists (use normalized email)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('User already exists with this email', 400));
    }

    // Create user (schema pre-save will hash password)
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Create token
    const token = createTokenForUser(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// inside controllers/authController.js — replace the existing login function with this
exports.login = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = req.body.password;

    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // IMPORTANT: include password because schema sets select: false
    const user = await User.findOne({ email }).select('+password');

    // DEBUG: temporary logs to troubleshoot why matchPassword fails
    console.log('--- LOGIN DEBUG ---');
    console.log('Normalized email:', email);
    console.log('User found:', !!user);
    if (user) {
      console.log('Stored password hash (first 10 chars):', String(user.password || '').slice(0, 10));
      console.log('Full stored hash exists?:', !!user.password);
    }
    console.log('Incoming plain password (first 10 chars):', String(password).slice(0, 10));
    console.log('-------------------');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    if (!user.password) {
      // This should not happen because we used .select('+password'), but detect just in case
      console.error('Login failed: password field missing from DB query for user:', email);
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    console.log('bcrypt compare result:', isMatch);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Create token
    const token = user.getSignedJwtToken ? user.getSignedJwtToken() : createTokenForUser(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    // req.user should be set by protect middleware
    if (!req.user || !req.user.id) {
      return next(new ErrorResponse('Not authorized', 401));
    }

    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = String(req.body.email).toLowerCase().trim();

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return next(new ErrorResponse('Please provide current password and new password', 400));
    }

    // Need password to compare, schema has select:false
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    // Create token
    const token = createTokenForUser(user);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    next(error);
  }
};
