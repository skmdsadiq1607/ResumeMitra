/**
 * Resume Controller — Enhanced v2
 * ────────────────────────────────────────────────────────────────────────────
 * Handles PDF upload, AI analysis with target-role support, history with
 * pagination, individual report retrieval, deletion, and comparison.
 */

const path = require('path');
const { validationResult } = require('express-validator');
const ResumeReport = require('../models/ResumeReport');
const { extractTextFromPDF, deleteFile } = require('../utils/extractText');
const { analyzeResumeWithGemini, generateLatexResume } = require('../services/geminiService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ─── Upload Resume ─────────────────────────────────────────────────────────
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded. Please upload a PDF resume.', 400);
    }
    return successResponse(res, 'Resume uploaded successfully.', {
      fileName: req.file.originalname,
      storedAs: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    next(error);
  }
};

// ─── Analyze Resume (enhanced with targetRole) ─────────────────────────────
const analyzeResume = async (req, res, next) => {
  let report = null;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 422, errors.array());
    }

    const { jobDescription, jobTitle, targetRole, filePath, fileName } = req.body;

    // Resolve file
    const resumeFile = req.file || null;
    const resolvedFilePath = resumeFile
      ? resumeFile.path
      : filePath
        ? path.join(__dirname, '..', filePath)
        : null;
    const resolvedFileName = resumeFile
      ? resumeFile.originalname
      : fileName || 'resume.pdf';

    if (!resolvedFilePath) {
      return errorResponse(res, 'Please upload a resume PDF or provide a file path.', 400);
    }

    // 1. Extract text from PDF
    const resumeText = await extractTextFromPDF(resolvedFilePath);

    // 2. Create a pending report in DB
    report = await ResumeReport.create({
      user: req.user._id,
      originalFileName: resolvedFileName,
      uploadedResumePath: resolvedFilePath,
      jobDescription,
      jobTitle: jobTitle || '',
      targetRole: targetRole || '',
      status: 'pending',
    });

    // 3. Call enhanced Gemini AI with targetRole
    const aiResult = await analyzeResumeWithGemini(resumeText, jobDescription, targetRole || '');

    // 4. Map ALL AI fields to the report document
    report.overallScore = aiResult.overallScore ?? 0;
    report.confidenceLevel = aiResult.confidenceLevel || '';
    report.scores = aiResult.scores || {};
    report.sectionScores = aiResult.sectionScores || {};
    report.scoreExplanation = aiResult.scoreExplanation || {};
    report.summary = aiResult.summary || '';
    report.recruiterVerdict = aiResult.recruiterVerdict || '';
    report.extractedKeywords = aiResult.extractedKeywords || [];
    report.matchedKeywords = aiResult.matchedKeywords || [];
    report.missingKeywords = aiResult.missingKeywords || [];
    report.strengths = aiResult.strengths || [];
    report.weaknesses = aiResult.weaknesses || [];
    report.categorizedSuggestions = aiResult.categorizedSuggestions || {};
    report.aiSuggestions = aiResult.aiSuggestions || [];
    report.quickFixes = aiResult.quickFixes || [];
    report.advancedImprovements = aiResult.advancedImprovements || [];
    report.weakPhrases = aiResult.weakPhrases || [];
    report.rewrittenBulletPoints = aiResult.rewrittenBulletPoints || [];
    report.sectionRecommendations = aiResult.sectionRecommendations || {};
    report.missingTools = aiResult.missingTools || [];
    report.learningRoadmap = aiResult.learningRoadmap || [];
    report.interviewReadiness = aiResult.interviewReadiness || {};
    report.nextSteps = aiResult.nextSteps || [];
    report.status = 'completed';

    await report.save();

    return successResponse(res, 'Resume analyzed successfully!', { report }, 201);
  } catch (error) {
    // Mark report as failed if it was already created
    if (report && report._id) {
      try {
        report.status = 'failed';
        await report.save();
      } catch (_) { /* ignore secondary error */ }
    }
    next(error);
  }
};

// ─── Get Resume History ────────────────────────────────────────────────────
const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      ResumeReport.find({ user: req.user._id, status: 'completed' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('originalFileName overallScore sectionScores scores matchedKeywords missingKeywords jobTitle targetRole createdAt confidenceLevel'),
      ResumeReport.countDocuments({ user: req.user._id, status: 'completed' }),
    ]);

    return successResponse(res, 'Resume history fetched.', {
      reports,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Single Report ─────────────────────────────────────────────────────
const getReport = async (req, res, next) => {
  try {
    const report = await ResumeReport.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select('-uploadedResumePath -__v');

    if (!report) return errorResponse(res, 'Report not found.', 404);
    return successResponse(res, 'Report fetched.', { report });
  } catch (error) {
    next(error);
  }
};

// ─── Delete Report ─────────────────────────────────────────────────────────
const deleteReport = async (req, res, next) => {
  try {
    const report = await ResumeReport.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!report) return errorResponse(res, 'Report not found.', 404);

    if (report.uploadedResumePath) deleteFile(report.uploadedResumePath);
    await report.deleteOne();
    return successResponse(res, 'Report deleted successfully.');
  } catch (error) {
    next(error);
  }
};

// ─── Compare Two Reports ──────────────────────────────────────────────────
const compareReports = async (req, res, next) => {
  try {
    const { idA, idB } = req.query;
    if (!idA || !idB) {
      return errorResponse(res, 'Please provide idA and idB query parameters.', 400);
    }

    const [a, b] = await Promise.all([
      ResumeReport.findOne({ _id: idA, user: req.user._id }).select('-uploadedResumePath -__v'),
      ResumeReport.findOne({ _id: idB, user: req.user._id }).select('-uploadedResumePath -__v'),
    ]);

    if (!a || !b) return errorResponse(res, 'One or both reports not found.', 404);

    // Build comparison delta
    const delta = {
      overallScore: b.overallScore - a.overallScore,
      scores: {},
    };

    if (a.scores && b.scores) {
      for (const key of Object.keys(b.scores.toObject ? b.scores.toObject() : b.scores)) {
        delta.scores[key] = (b.scores[key] ?? 0) - (a.scores[key] ?? 0);
      }
    }

    const newMatched = (b.matchedKeywords || []).filter(k => !(a.matchedKeywords || []).includes(k));
    const nowMissing = (b.missingKeywords || []).filter(k => !(a.missingKeywords || []).includes(k));

    return successResponse(res, 'Comparison fetched.', {
      older: a,
      newer: b,
      delta,
      newlyMatched: newMatched,
      newlyMissing: nowMissing,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Generate LaTeX ─────────────────────────────────────────────────────────
const generateLatex = async (req, res, next) => {
  try {
    const report = await ResumeReport.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!report) return errorResponse(res, 'Report not found.', 404);

    let resumeText = '';
    if (report.uploadedResumePath) {
      try {
        resumeText = await extractTextFromPDF(report.uploadedResumePath);
      } catch (err) {
        console.error('Failed to extract text for latex generation:', err);
      }
    }

    if (!resumeText) {
       return errorResponse(res, 'Could not read original resume text for LaTeX generation.', 400);
    }

    const latexResult = await generateLatexResume(resumeText, report.jobDescription, report.toObject());

    return successResponse(res, 'LaTeX generated successfully.', latexResult);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadResume, analyzeResume, getHistory, getReport, deleteReport, compareReports, generateLatex };
