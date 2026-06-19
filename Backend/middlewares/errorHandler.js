/**
 * Centralized Error Handler Middleware
 * Catches all errors thrown by controllers and formats consistent JSON responses
 */

const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ─── Mongoose: Duplicate Key Error ─────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `An account with this ${field} already exists.`;
    statusCode = 409;
  }

  // ─── Mongoose: Validation Error ────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((e) => e.message).join('. ');
    statusCode = 422;
  }

  // ─── Mongoose: Cast Error (invalid ObjectId) ───────────────────────────────
  if (err.name === 'CastError') {
    message = `Invalid value for field: ${err.path}`;
    statusCode = 400;
  }

  // ─── Multer: File too large ─────────────────────────────────────────────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = `File too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 5}MB.`;
    statusCode = 413;
  }

  // Log server errors in development
  if (statusCode === 500 && process.env.NODE_ENV === 'development') {
    console.error('💥 Server Error:', err.stack);
  }

  return errorResponse(res, message, statusCode);
};

module.exports = errorHandler;
