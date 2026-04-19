/**
 * Auth Controller
 * Handles user registration, login, and profile retrieval
 */

const { validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ─── Register ──────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array());
    }

    const { name, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'An account with this email already exists.', 409);
    }

    // Create user (password is hashed by pre-save hook in model)
    const user = await User.create({ name, email, password });

    const token = generateToken(user);

    return successResponse(
      res,
      'Account created successfully! Welcome aboard.',
      { token, user: user.toSafeObject() },
      201
    );
  } catch (error) {
    next(error);
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array());
    }

    const { email, password } = req.body;

    // Include password field for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account has been deactivated. Contact support.', 403);
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user);

    return successResponse(res, 'Logged in successfully!', {
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Current User (me) ─────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }
    return successResponse(res, 'User profile fetched.', { user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// ─── Update Profile ────────────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array());
    }

    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    );

    return successResponse(res, 'Profile updated successfully.', { user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
