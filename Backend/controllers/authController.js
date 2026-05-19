/**
 * Auth Controller
 * Handles user registration, login, and profile retrieval
 */

const { validationResult } = require('express-validator');
const axios = require('axios');
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

// ─── Google Login ──────────────────────────────────────────────────────────
const googleLogin = async (req, res, next) => {
  try {
    const { credential, accessToken } = req.body;
    let email, name, avatar;

    if (credential) {
      // Validate Google ID Token (credential) using Google tokeninfo endpoint
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      const payload = response.data;
      email = payload.email;
      name = payload.name;
      avatar = payload.picture;
    } else if (accessToken) {
      // Validate Google Access Token using standard userinfo endpoint
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const payload = response.data;
      email = payload.email;
      name = payload.name;
      avatar = payload.picture;
    } else {
      return errorResponse(res, 'Google credential or access token is required.', 400);
    }

    if (!email) {
      return errorResponse(res, 'Failed to retrieve user information from Google.', 400);
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (!user) {
      // Create a new user with Google details
      const crypto = require('crypto');
      const dummyPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name,
        email,
        password: dummyPassword,
        avatar,
      });
    } else {
      // If user exists, optionally update their avatar or lastLogin details
      let needsSave = false;
      if (avatar && user.avatar !== avatar) {
        user.avatar = avatar;
        needsSave = true;
      }
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account has been deactivated. Contact support.', 403);
    }

    const token = generateToken(user);
    return successResponse(res, 'Logged in with Google successfully!', {
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('Google Auth Error:', error.response?.data || error.message);
    return errorResponse(res, 'Google Authentication failed. Please try again.', 401);
  }
};

module.exports = { register, login, getMe, updateProfile, googleLogin };
