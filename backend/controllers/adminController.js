const User = require('../models/User');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');

// @desc    Get admin platform analytics & dashboard KPIs
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalResumes = await Resume.countDocuments();
    const totalAnalyses = await Analysis.countDocuments();

    // Average match score across all analyses
    const scoreAgg = await Analysis.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$matchScore' },
          highestScore: { $max: '$matchScore' },
          lowestScore: { $min: '$matchScore' },
        },
      },
    ]);

    const avgScore = scoreAgg.length > 0 ? Math.round(scoreAgg[0].avgScore) : 0;
    const highestScore = scoreAgg.length > 0 ? scoreAgg[0].highestScore : 0;
    const lowestScore = scoreAgg.length > 0 ? scoreAgg[0].lowestScore : 0;

    // Score distribution (buckets: <60, 60-74, 75-89, 90+)
    const scoreBuckets = await Analysis.aggregate([
      {
        $bucket: {
          groupBy: '$matchScore',
          boundaries: [0, 60, 75, 90, 101],
          default: 'Other',
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    // Format score distribution for frontend chart
    const distributionMap = {
      '0': { label: 'Needs Improvement (<60)', count: 0 },
      '60': { label: 'Fair Match (60-74)', count: 0 },
      '75': { label: 'Good Match (75-89)', count: 0 },
      '90': { label: 'Excellent Match (90-100)', count: 0 },
    };

    scoreBuckets.forEach((b) => {
      if (distributionMap[b._id.toString()]) {
        distributionMap[b._id.toString()].count = b.count;
      }
    });

    // Recent 5 users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 analyses
    const recentAnalyses = await Analysis.find()
      .populate('userId', 'username email')
      .sort({ analysisDate: -1 })
      .limit(5);

    // Engine statistics (Rule-based vs Gemini AI)
    const aiCount = await Analysis.countDocuments({ isAiGenerated: true });
    const ruleCount = totalAnalyses - aiCount;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalResumes,
        totalAnalyses,
        activeUsers: Math.min(totalUsers, Math.max(1, Math.ceil(totalUsers * 0.85))),
        avgScore,
        highestScore,
        lowestScore,
        scoreDistribution: Object.values(distributionMap),
        engineStats: {
          aiEnhanced: aiCount,
          ruleBased: ruleCount,
        },
        recentUsers,
        recentAnalyses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with analytics
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Attach analysis & resume counts for each user
    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const resumeCount = await Resume.countDocuments({ userId: u._id });
        const analysisCount = await Analysis.countDocuments({ userId: u._id });
        return {
          ...u.toObject(),
          resumeCount,
          analysisCount,
        };
      })
    );

    res.json({
      success: true,
      count: usersWithCounts.length,
      data: usersWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and cascade delete their data
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent self-deletion of currently logged in admin
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Administrator cannot delete their own active account.',
      });
    }

    // Cascade delete user resumes and analyses
    await Resume.deleteMany({ userId: user._id });
    await Analysis.deleteMany({ userId: user._id });
    await user.deleteOne();

    res.json({
      success: true,
      message: `User ${user.username} (${user.email}) and all associated records deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (promote/demote)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Must be "user" or "admin".',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}.`,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  deleteUser,
  updateUserRole,
};
