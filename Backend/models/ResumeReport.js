/**
 * ResumeReport Model — Enhanced v2
 * ────────────────────────────────────────────────────────────────────────────
 * Stores the full AI analysis output alongside the original file metadata.
 * The schema now supports 15+ dimensions including explainable scoring,
 * categorized suggestions, weak-phrase detection, and learning roadmaps.
 */

const mongoose = require('mongoose');

/* ─── Sub-schemas (no _id for embedded docs) ──────────────────────────────── */

const scoresSchema = new mongoose.Schema({
  keywordMatch: { type: Number, default: 0 },
  contentStrength: { type: Number, default: 0 },
  skillsAlignment: { type: Number, default: 0 },
  experienceImpact: { type: Number, default: 0 },
  projectRelevance: { type: Number, default: 0 },
  educationFit: { type: Number, default: 0 },
  formattingATS: { type: Number, default: 0 },
  readability: { type: Number, default: 0 },
}, { _id: false });

const sectionScoreSchema = new mongoose.Schema({
  skills: { type: Number, default: 0 },
  experience: { type: Number, default: 0 },
  education: { type: Number, default: 0 },
  projects: { type: Number, default: 0 },
  keywords: { type: Number, default: 0 },
  formatting: { type: Number, default: 0 },
}, { _id: false });

const scoreExplanationSchema = new mongoose.Schema({
  positiveFactors: { type: [String], default: [] },
  negativeFactors: { type: [String], default: [] },
  sectionWeights: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { _id: false });

const quickFixSchema = new mongoose.Schema({
  issue: { type: String, default: '' },
  description: { type: String, default: '' },
  fix: { type: String, default: '' },
  impact: { type: String, enum: ['high', 'medium', 'low', ''], default: '' },
}, { _id: false });

const advancedImprovementSchema = new mongoose.Schema({
  area: { type: String, default: '' },
  issue: { type: String, default: '' },
  why: { type: String, default: '' },
  howToFix: { type: String, default: '' },
  example: { type: String, default: '' },
}, { _id: false });

const weakPhraseSchema = new mongoose.Schema({
  original: { type: String, default: '' },
  problem: { type: String, default: '' },
  replacement: { type: String, default: '' },
}, { _id: false });

const rewrittenBulletSchema = new mongoose.Schema({
  original: { type: String, default: '' },
  improved: { type: String, default: '' },
  reason: { type: String, default: '' },
}, { _id: false });

const categorizedSuggestionsSchema = new mongoose.Schema({
  critical: { type: [String], default: [] },
  highImpact: { type: [String], default: [] },
  polish: { type: [String], default: [] },
  atsOptimization: { type: [String], default: [] },
  roleSpecific: { type: [String], default: [] },
}, { _id: false });

const sectionRecommendationsSchema = new mongoose.Schema({
  skills: { type: String, default: '' },
  experience: { type: String, default: '' },
  projects: { type: String, default: '' },
  education: { type: String, default: '' },
  summary: { type: String, default: '' },
}, { _id: false });

const interviewReadinessSchema = new mongoose.Schema({
  score: { type: Number, default: 0 },
  clues: { type: [String], default: [] },
}, { _id: false });

/* ─── Main Report Schema ──────────────────────────────────────────────────── */

const resumeReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // ── File metadata ──
    originalFileName: { type: String, required: true },
    uploadedResumePath: { type: String, required: true },
    jobDescription: { type: String, required: true, maxlength: [15000, 'Job description too long'] },
    jobTitle: { type: String, default: '', trim: true },
    targetRole: { type: String, default: '', trim: true },

    // ── Core scores ──
    overallScore: { type: Number, default: 0, min: 0, max: 100 },
    confidenceLevel: { type: String, enum: ['high', 'medium', 'low', ''], default: '' },
    scores: { type: scoresSchema, default: () => ({}) },
    sectionScores: { type: sectionScoreSchema, default: () => ({}) }, // backwards compat
    scoreExplanation: { type: scoreExplanationSchema, default: () => ({}) },

    // ── Keywords ──
    extractedKeywords: { type: [String], default: [] },
    matchedKeywords: { type: [String], default: [] },
    missingKeywords: { type: [String], default: [] },

    // ── Recruiter insights ──
    summary: { type: String, default: '' },
    recruiterVerdict: { type: String, default: '' },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },

    // ── Categorized suggestions ──
    categorizedSuggestions: { type: categorizedSuggestionsSchema, default: () => ({}) },
    aiSuggestions: { type: [String], default: [] }, // flat array for backwards compat

    // ── Actionable fixes ──
    quickFixes: { type: [quickFixSchema], default: [] },
    advancedImprovements: { type: [advancedImprovementSchema], default: [] },

    // ── Content rewriting ──
    weakPhrases: { type: [weakPhraseSchema], default: [] },
    rewrittenBulletPoints: { type: [rewrittenBulletSchema], default: [] },

    // ── Section advice ──
    sectionRecommendations: { type: sectionRecommendationsSchema, default: () => ({}) },

    // ── Advanced insights ──
    missingTools: { type: [String], default: [] },
    learningRoadmap: { type: [String], default: [] },
    interviewReadiness: { type: interviewReadinessSchema, default: () => ({}) },
    nextSteps: { type: [String], default: [] },

    // ── Status ──
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

resumeReportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ResumeReport', resumeReportSchema);
