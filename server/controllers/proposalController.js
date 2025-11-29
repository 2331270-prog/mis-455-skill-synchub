const Proposal = require('../models/Proposal');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get current project proposal
// @route   GET /api/proposal
// @access  Public
exports.getProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.getCurrentProposal();

    if (!proposal) {
      return res.status(200).json({
        success: true,
        data: {
          title: "SkillSync Hub",
          description: "Collaborative Talent & Portfolio Sharing Platform",
          objectives: [
            {
              title: "Connect students via skill sharing",
              description: "Create a platform where students can share their skills and collaborate on projects"
            },
            {
              title: "Mini portfolio for each user",
              description: "Provide users with a personal space to showcase their skills and achievements"
            },
            {
              title: "Collaboration request",
              description: "Enable users to request collaboration based on their skills and project needs"
            },
            {
              title: "Skill-based search",
              description: "Allow users to find collaborators based on specific skills and expertise"
            },
            {
              title: "Messaging/Contact",
              description: "Provide communication tools for seamless collaboration between users"
            }
          ]
        }
      });
    }

    res.status(200).json({
      success: true,
      data: proposal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project proposal
// @route   PUT /api/proposal
// @access  Private/Admin
exports.updateProposal = async (req, res, next) => {
  try {
    // Check if proposal exists
    let proposal = await Proposal.getCurrentProposal();

    if (!proposal) {
      // Create new proposal if none exists
      proposal = await Proposal.create({
        ...req.body,
        lastEditedBy: req.user.id
      });
    } else {
      // Update existing proposal
      proposal = await Proposal.findByIdAndUpdate(
        proposal._id,
        { ...req.body, lastEditedBy: req.user.id },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      data: proposal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all proposal versions
// @route   GET /api/proposal/versions
// @access  Private/Admin
exports.getProposalVersions = async (req, res, next) => {
  try {
    const proposals = await Proposal.find().sort({ version: -1 });

    res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive proposal
// @route   PUT /api/proposal/:id/archive
// @access  Private/Admin
exports.archiveProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return next(new ErrorResponse(`Proposal not found with id of ${req.params.id}`, 404));
    }

    proposal.status = 'archived';
    await proposal.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};