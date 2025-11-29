const Contact = require('../models/Contact');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all contact messages (public)
// @route   GET /api/contact/public
// @access  Public
exports.getContactMessagesPublic = async (req, res, next) => {
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
    const contactMessages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      count: contactMessages.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(total / limit)
      },
      data: contactMessages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
exports.getContactMessages = async (req, res, next) => {
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
    const contacts = await Contact.find(query)
      .populate('assignedTo', 'name email')
      .populate('response.respondedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(total / limit)
      },
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContactMessage = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('response.respondedBy', 'name email');

    if (!contact) {
      return next(new ErrorResponse(`Contact message not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
exports.createContactMessage = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContactMessage = async (req, res, next) => {
  try {
    const { status, message, priority, assignedTo } = req.body;
    
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(new ErrorResponse(`Contact message not found with id of ${req.params.id}`, 404));
    }

    // Update fields
    if (status) {
      if (status === 'read') {
        await contact.markAsRead();
      } else if (status === 'responded' && message) {
        await contact.addResponse(message, req.user.id);
      } else if (status === 'closed') {
        await contact.close();
      }
    }
    
    if (priority) {
      contact.priority = priority;
    }
    
    if (assignedTo) {
      contact.assignedTo = assignedTo;
    }

    await contact.save();

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContactMessage = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(new ErrorResponse(`Contact message not found with id of ${req.params.id}`, 404));
    }

    await contact.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact messages by status
// @route   GET /api/contact/status/:status
// @access  Private/Admin
exports.getContactMessagesByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const contacts = await Contact.getMessagesByStatus(status);

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new/unread contact messages
// @route   GET /api/contact/new
// @access  Private/Admin
exports.getNewContactMessages = async (req, res, next) => {
  try {
    const contacts = await Contact.getNewMessages();

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark contact message as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
exports.markAsRead = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(new ErrorResponse(`Contact message not found with id of ${req.params.id}`, 404));
    }

    await contact.markAsRead();

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};