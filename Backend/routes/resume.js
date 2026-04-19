/**
 * Resume Routes — Enhanced v2
 * Adds targetRole validation + compare endpoint
 */

const express = require('express');
const { body } = require('express-validator');
const {
  uploadResume,
  analyzeResume,
  getHistory,
  getReport,
  deleteReport,
  compareReports,
} = require('../controllers/resumeController');
const { protect } = require('../middlewares/auth');
const upload = require('../config/multer');

const router = express.Router();
router.use(protect);

const analyzeValidation = [
  body('jobDescription')
    .trim()
    .notEmpty().withMessage('Job description is required')
    .isLength({ min: 50 }).withMessage('Job description must be at least 50 characters')
    .isLength({ max: 15000 }).withMessage('Job description is too long (max 15,000 characters)'),
  body('jobTitle').optional().trim().isLength({ max: 100 }),
  body('targetRole').optional().trim().isLength({ max: 60 }),
];

router.post('/upload', upload.single('resume'), uploadResume);
router.post('/analyze', upload.single('resume'), analyzeValidation, analyzeResume);
router.get('/history', getHistory);
router.get('/report/:id', getReport);
router.delete('/report/:id', deleteReport);
router.get('/compare', compareReports);

module.exports = router;
