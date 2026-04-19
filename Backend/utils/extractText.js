/**
 * PDF Text Extraction Utility
 * Extracts plain text from uploaded PDF files using pdf-parse
 */

const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

/**
 * Extract text content from a PDF file
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error('Resume file not found on server');
    }

    const dataBuffer = fs.readFileSync(absolutePath);
    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text?.trim();
    if (!text || text.length < 50) {
      throw new Error('Could not extract enough text from the PDF. Please ensure the PDF is not image-only or password-protected.');
    }

    // Clean up excessive whitespace while preserving structure
    return text.replace(/\n{3,}/g, '\n\n').trim();
  } catch (error) {
    if (error.message.includes('Could not extract')) throw error;
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

/**
 * Delete a file safely (e.g., after processing or on failure)
 * @param {string} filePath - Path to the file to delete
 */
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Warning: Could not delete file:', filePath, err.message);
  }
};

module.exports = { extractTextFromPDF, deleteFile };
