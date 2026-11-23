const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: username, email, and password.',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Check if this should be initial admin (first user or explicit admin email)
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser || email.toLowerCase().includes('admin@resumeai') ? 'admin' : 'user';

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        title: user.title,
        bio: user.bio,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Explicitly select password field
    let user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // Auto-seed demo accounts if someone attempts to log in with demo credentials and they don't exist yet
    if (!user && (email.toLowerCase() === 'admin@resumeai.com' || email.toLowerCase() === 'demo@resumeai.com')) {
      const isDemoAdmin = email.toLowerCase() === 'admin@resumeai.com';
      user = await User.create({
        username: isDemoAdmin ? 'Admin System' : 'Demo Candidate',
        email: email.toLowerCase(),
        password: isDemoAdmin ? 'admin123' : 'demo123',
        role: isDemoAdmin ? 'admin' : 'user',
        title: isDemoAdmin ? 'Platform Administrator' : 'Senior Full-Stack Engineer',
      });
      // Re-fetch with password for compare
      user = await User.findById(user._id).select('+password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    res.json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        title: user.title,
        bio: user.bio,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { username, email, title, bio } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (username) user.username = username;
    if (email) {
      const emailLower = email.toLowerCase();
      // Check duplicate
      const duplicate = await User.findOne({ email: emailLower, _id: { $ne: user._id } });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'That email address is already in use by another account.',
        });
      }
      user.email = emailLower;
    }
    if (title !== undefined) user.title = title;
    if (bio !== undefined) user.bio = bio;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        title: updatedUser.title,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
};
