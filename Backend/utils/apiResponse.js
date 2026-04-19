/**
 * Standardized API Response Utility
 * Ensures all responses follow a consistent JSON shape
 */

/**
 * Send a successful response
 * @param {Object} res - Express response object
 * @param {string} message - Human-readable success message
 * @param {*} data - Response payload (object, array, etc.)
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} errors - Optional validation errors array
 */
const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};

module.exports = { successResponse, errorResponse };
