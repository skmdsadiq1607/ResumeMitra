/**
 * Dashboard Controller
 * Provides aggregated stats for the authenticated user's dashboard
 */

const ResumeReport = require('../models/ResumeReport');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ─── Get Dashboard Stats ───────────────────────────────────────────────────
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalReports, reports] = await Promise.all([
      ResumeReport.countDocuments({ user: userId, status: 'completed' }),
      ResumeReport.find({ user: userId, status: 'completed' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('originalFileName overallScore sectionScores createdAt jobTitle'),
    ]);

    if (totalReports === 0) {
      return successResponse(res, 'Dashboard stats fetched.', {
        totalAnalyses: 0,
        averageScore: 0,
        bestScore: 0,
        recentReports: [],
        improvement: 0,
      });
    }

    // Calculate aggregate stats from all reports
    const allReports = await ResumeReport.find({ user: userId, status: 'completed' })
      .select('overallScore createdAt');

    const scores = allReports.map((r) => r.overallScore);
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const bestScore = Math.max(...scores);

    // Improvement: difference between latest and first score
    const sortedByDate = [...allReports].sort((a, b) => a.createdAt - b.createdAt);
    const firstScore = sortedByDate[0]?.overallScore || 0;
    const latestScore = sortedByDate[sortedByDate.length - 1]?.overallScore || 0;
    const improvement = latestScore - firstScore;

    return successResponse(res, 'Dashboard stats fetched.', {
      totalAnalyses: totalReports,
      averageScore,
      bestScore,
      improvement,
      recentReports: reports,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
