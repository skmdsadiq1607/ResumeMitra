/**
 * Gemini AI Service — Enhanced v2
 * ────────────────────────────────────────────────────────────────────────────
 * Deep, recruiter-grade resume analysis using Google Gemini.
 * Returns a rich, structured JSON object covering 15+ evaluation dimensions
 * with explainable scoring, strengths, weaknesses, and mentor-style guidance.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ─────────────────────────── Prompt Engineering ─────────────────────────── */

/**
 * Build a comprehensive prompt that asks Gemini to act as both an ATS engine
 * AND a senior technical recruiter. The prompt produces structured JSON that
 * the front-end can render into a rich, data-dense dashboard.
 *
 * @param {string} resumeText  - plain text extracted from the PDF
 * @param {string} jobDescription - job posting text
 * @param {string} targetRole  - optional role the user selected (e.g. "Frontend Developer")
 */
const buildAnalysisPrompt = (resumeText, jobDescription, targetRole = '') => {
  const roleContext = targetRole
    ? `\nThe user is specifically targeting the role: "${targetRole}". Prioritize skills, keywords, and expectations relevant to this role.\n`
    : '';

  return `
You are a world-class ATS (Applicant Tracking System) engine combined with a senior technical recruiter who has 18+ years of experience hiring for top tech companies (Google, Meta, Amazon, Microsoft, startups).

Your task is to perform an EXHAUSTIVE, data-rich analysis of the resume below against the job description. Think like BOTH the automated ATS scanner AND the human hiring manager who reads the resume after it passes the filter.
${roleContext}
────────────────────────────── RULES ──────────────────────────────
1. Respond ONLY with a single valid JSON object — no markdown, no code fences, no prose.
2. NEVER fabricate content that isn't in the resume or JD. Base every observation on actual text.
3. Be honest, constructive, and specific. Reference real lines / phrases from the resume.
4. Every score MUST be an integer 0-100. Every array MUST have ≥ 3 items (unless genuinely fewer exist).
5. Suggestions must feel like advice from a mentor — explain WHY, not just WHAT.

────────────────────────────── RESUME ──────────────────────────────
"""
${resumeText}
"""

────────────────────────── JOB DESCRIPTION ────────────────────────
"""
${jobDescription}
"""

────────────────────── REQUIRED JSON SCHEMA ──────────────────────

{
  "overallScore": <int 0-100>,
  "confidenceLevel": "<high | medium | low — how confident you are in this analysis based on resume and JD quality>",

  "scores": {
    "keywordMatch": <int 0-100 — % of critical JD keywords found in resume>,
    "contentStrength": <int 0-100 — bullet-point impact, quantified achievements, action verbs>,
    "skillsAlignment": <int 0-100 — how well resume skills match JD requirements>,
    "experienceImpact": <int 0-100 — depth, relevance, and impact of work experience>,
    "projectRelevance": <int 0-100 — how relevant listed projects are to the JD>,
    "educationFit": <int 0-100 — degree/coursework relevance>,
    "formattingATS": <int 0-100 — ATS-safe formatting, section headings, parsability>,
    "readability": <int 0-100 — overall clarity, conciseness, professional language>
  },

  "scoreExplanation": {
    "positiveFactors": ["<specific factor that boosted the score>", "..."],
    "negativeFactors": ["<specific factor that reduced the score>", "..."],
    "sectionWeights": {
      "keywordMatch": 25,
      "skillsAlignment": 20,
      "experienceImpact": 20,
      "contentStrength": 15,
      "projectRelevance": 10,
      "formattingATS": 5,
      "readability": 3,
      "educationFit": 2
    }
  },

  "summary": "<3-4 sentence executive recruiter summary. Mention the biggest strengths and the single most impactful improvement the candidate can make.>",

  "recruiterVerdict": "<2-3 sentence verdict as if you are the hiring manager. Would you shortlist this candidate? Why or why not?>",

  "matchedKeywords": ["<keyword from JD found in resume>", "..."],
  "missingKeywords": ["<important keyword from JD NOT in resume>", "..."],
  "extractedKeywords": ["<technical skills/terms found in the resume>", "..."],

  "strengths": [
    "<What is genuinely good about this resume — be specific, reference actual content>",
    "...(3-5 items)"
  ],
  "weaknesses": [
    "<What is hurting the candidate's chances — be specific>",
    "...(3-5 items)"
  ],

  "quickFixes": [
    {
      "issue": "<short label>",
      "description": "<what's wrong>",
      "fix": "<exactly what to do>",
      "impact": "<high | medium>"
    }
  ],

  "advancedImprovements": [
    {
      "area": "<Skills | Experience | Projects | Content | Strategy>",
      "issue": "<what's wrong>",
      "why": "<why this matters to recruiters / ATS>",
      "howToFix": "<step-by-step guidance>",
      "example": "<before → after example if applicable>"
    }
  ],

  "categorizedSuggestions": {
    "critical": ["<Must-fix for ATS pass>", "..."],
    "highImpact": ["<Will significantly improve chances>", "..."],
    "polish": ["<Nice-to-have refinements>", "..."],
    "atsOptimization": ["<Formatting/keyword tweaks for ATS>", "..."],
    "roleSpecific": ["<Tailored to the target role>", "..."]
  },

  "weakPhrases": [
    {
      "original": "<exact weak phrase from resume>",
      "problem": "<why it's weak>",
      "replacement": "<stronger ATS-friendly version>"
    }
  ],

  "rewrittenBulletPoints": [
    {
      "original": "<original bullet from resume (or 'NEW' if suggesting a new one)>",
      "improved": "<stronger version with action verb + metric + impact>",
      "reason": "<why the rewrite is better>"
    }
  ],

  "sectionRecommendations": {
    "skills": "<1-2 sentence advice for the Skills section>",
    "experience": "<advice for Experience section>",
    "projects": "<advice for Projects section>",
    "education": "<advice for Education section>",
    "summary": "<advice for Summary/Objective section>"
  },

  "missingTools": ["<tools/technologies mentioned in JD but absent from resume>", "..."],

  "learningRoadmap": [
    "<Ranked skill/tool the candidate should learn first to match this role>",
    "...(3-5 items)"
  ],

  "interviewReadiness": {
    "score": <int 0-100>,
    "clues": ["<signal from resume that indicates interview-readiness or lack thereof>", "..."]
  },

  "nextSteps": [
    "<Actionable next step 1>",
    "<Actionable next step 2>",
    "<Actionable next step 3>"
  ]
}

SCORING GUIDELINES:
- overallScore = weighted average using sectionWeights
- A resume with < 50% keyword match should NEVER score above 60 overall
- Penalize heavily for: missing critical skills, no quantified achievements, vague bullet points
- Reward: action-verb-first bullets, measurable impact, role-relevant projects, clean formatting
- Be calibrated: 90+ = exceptional (top 5%), 70-89 = strong, 50-69 = needs work, <50 = major rewrite needed.

Reply with ONLY the JSON object. Nothing else.
`.trim();
};

/* ─────────────────────── Analysis Function ──────────────────────────────── */

/**
 * Helper to run a model name through a quick test to see if it exists
 */
const tryModel = async (modelName, prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    await model.generateContent({ contents: [{ role: 'user', parts: [{ text: 'say ok' }] }] });
    return true;
  } catch (e) {
    return false;
  }
};

const analyzeResumeWithGemini = async (resumeText, jobDescription, targetRole = '') => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.');
  }

  // List of models to try in order of preference
  const modelsToTry = [
    (process.env.GEMINI_MODEL || '').trim(),
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro'
  ].filter(Boolean);

  let model;
  let selectedName = '';

  // Try each model until one works
  for (const name of [...new Set(modelsToTry)]) {
    try {
      console.log(`📡 Attempting to use model: ${name}...`);
      const testModel = genAI.getGenerativeModel({ model: name });
      // Very short test request to see if 404
      await testModel.generateContent({ contents: [{ role: 'user', parts: [{ text: 'hi' }] }] });
      model = testModel;
      selectedName = name;
      console.log(`✅ Success! Using model: ${selectedName}`);
      break;
    } catch (err) {
      if (err.message.includes('404')) {
        console.warn(`⚠️ Model ${name} not found (404). Trying next...`);
        continue;
      }
      throw err; // If it's a 401/403 or other error, stop and report it
    }
  }

  if (!model) {
    throw new Error('No supported Gemini models found for your API key. Please check your Google AI Studio project.');
  }
  
  // Set configuration on the working model instance
  model.generationConfig = {
    temperature: 0.25,
    topP: 0.85,
    maxOutputTokens: 8192,
  };

  const prompt = buildAnalysisPrompt(resumeText, jobDescription, targetRole);

  let rawText;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    rawText = response.text();
  } catch (error) {
    console.error('Gemini API raw error:', error);
    throw new Error(`Gemini API error: ${error.message}`);
  }

  // ─── Parse, validate, and sanitize the JSON response ──────────────────────
  try {
    const cleaned = rawText
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // ── Score clamping ──
    const clamp = (v) => Math.max(0, Math.min(100, Math.round(v ?? 0)));

    parsed.overallScore = clamp(parsed.overallScore);

    if (parsed.scores) {
      Object.keys(parsed.scores).forEach((k) => {
        parsed.scores[k] = clamp(parsed.scores[k]);
      });
    }

    if (parsed.interviewReadiness) {
      parsed.interviewReadiness.score = clamp(parsed.interviewReadiness.score);
    }

    // ── Ensure arrays are arrays ──
    const arrayFields = [
      'matchedKeywords', 'missingKeywords', 'extractedKeywords',
      'strengths', 'weaknesses', 'missingTools', 'learningRoadmap', 'nextSteps',
    ];
    arrayFields.forEach((f) => {
      if (!Array.isArray(parsed[f])) parsed[f] = [];
    });

    // ── Ensure nested objects exist ──
    parsed.scores = parsed.scores || {};
    parsed.scoreExplanation = parsed.scoreExplanation || { positiveFactors: [], negativeFactors: [], sectionWeights: {} };
    parsed.categorizedSuggestions = parsed.categorizedSuggestions || {};
    parsed.sectionRecommendations = parsed.sectionRecommendations || {};
    parsed.interviewReadiness = parsed.interviewReadiness || { score: 0, clues: [] };

    if (!Array.isArray(parsed.quickFixes)) parsed.quickFixes = [];
    if (!Array.isArray(parsed.advancedImprovements)) parsed.advancedImprovements = [];
    if (!Array.isArray(parsed.weakPhrases)) parsed.weakPhrases = [];
    if (!Array.isArray(parsed.rewrittenBulletPoints)) parsed.rewrittenBulletPoints = [];

    // ── Backwards compatibility: flatten sectionScores for old DB schema ──
    parsed.sectionScores = {
      skills: parsed.scores.skillsAlignment ?? 0,
      experience: parsed.scores.experienceImpact ?? 0,
      education: parsed.scores.educationFit ?? 0,
      projects: parsed.scores.projectRelevance ?? 0,
      keywords: parsed.scores.keywordMatch ?? 0,
      formatting: parsed.scores.formattingATS ?? 0,
    };

    // ── Flatten aiSuggestions from categories for old schema compat ──
    const cats = parsed.categorizedSuggestions;
    parsed.aiSuggestions = [
      ...(cats.critical || []),
      ...(cats.highImpact || []),
      ...(cats.atsOptimization || []),
      ...(cats.roleSpecific || []),
      ...(cats.polish || []),
    ].slice(0, 12);

    return parsed;

  } catch (parseError) {
    console.error('Failed to parse Gemini response. First 800 chars:', rawText?.substring(0, 800));
    throw new Error(`AI returned an invalid response. Please try again. (${parseError.message})`);
  }
};

const generateLatexResume = async (resumeText, jobDescription, reportData) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured.');
  }

  // List of models to try in order of preference
  const modelsToTry = [
    (process.env.GEMINI_MODEL || '').trim(),
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro'
  ].filter(Boolean);

  let model;
  for (const name of [...new Set(modelsToTry)]) {
    try {
      const testModel = genAI.getGenerativeModel({ model: name });
      await testModel.generateContent({ contents: [{ role: 'user', parts: [{ text: 'hi' }] }] });
      model = testModel;
      break;
    } catch (err) {
      if (err.message.includes('404')) continue;
      throw err;
    }
  }

  if (!model) throw new Error('No supported Gemini models found.');
  
  model.generationConfig = {
    temperature: 0.2,
    topP: 0.85,
    maxOutputTokens: 8192,
  };

  const prompt = `
You are an expert ATS resume writer and LaTeX resume formatter.

Generate a clean ATS-friendly LaTeX resume for Overleaf using ONLY the provided resume data and job description.
Do not invent fake experience, fake CGPA, fake dates, fake companies, fake certifications, or fake metrics.
Improve wording where possible based on the ATS analysis.
Use job-relevant keywords naturally.
Keep it one-page friendly.
Use simple ATS-safe LaTeX formatting.

────────────────────────────── RESUME ──────────────────────────────
${resumeText}

────────────────────────── JOB DESCRIPTION ────────────────────────
${jobDescription}

────────────────────────── ATS ANALYSIS ───────────────────────────
Strengths: ${reportData.strengths?.join(', ')}
Missing Keywords: ${reportData.missingKeywords?.join(', ')}

Return JSON ONLY in this format:
{
  "latexCode": "<the full latex code document>",
  "improvementsMade": ["<improvement 1>", "<improvement 2>"],
  "missingDataPlaceholders": ["<placeholder 1>"],
  "atsFriendlyNotes": ["<note 1>"]
}
  `.trim();

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    
    const cleaned = rawText
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .trim();
      
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.error('Gemini LaTeX API error:', error);
    throw new Error('Failed to generate LaTeX resume.');
  }
};

module.exports = { analyzeResumeWithGemini, generateLatexResume };
