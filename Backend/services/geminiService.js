/**
 * Gemini AI Service — Hybrid Routing Implementation
 * Supports both direct Google Gemini API and OpenRouter.
 * - If GEMINI_API_KEY starts with 'sk-or-v1-', routes through OpenRouter.
 * - Otherwise, uses direct Google Generative Language API.
 */

const axios = require('axios');

// ─── Shared Prompt Builder ──────────────────────────────────────────────────

const buildPrompt = (resumeText, jobDescription) => `
Act as a Senior Technical Recruiter and ATS Engine. 
Analyze the following Resume against the Job Description.
Return ONLY a valid JSON object following the schema provided.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

JSON SCHEMA:
{
  "overallScore": 0,
  "scores": {
    "keywordMatch": 0,
    "skillsAlignment": 0,
    "experienceImpact": 0
  },
  "summary": "...",
  "recruiterVerdict": "...",
  "matchedKeywords": [],
  "missingKeywords": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}
`;

// ─── Response Normalizer ────────────────────────────────────────────────────

const normalizeResult = (parsed) => ({
  ...parsed,
  score: parsed.overallScore || 0,
  grade: parsed.overallScore > 80 ? 'A' : 'B',
  dimensions: {
    keyword:    { label: 'Keywords',   score: parsed.scores.keywordMatch,     max: 100, color: 'primary' },
    skill:      { label: 'Skills',     score: parsed.scores.skillsAlignment,  max: 100, color: 'violet' },
    experience: { label: 'Experience', score: parsed.scores.experienceImpact, max: 100, color: 'emerald' }
  },
  aiSuggestions: parsed.suggestions || []
});

const extractJSON = (rawText) => {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  const cleaned = jsonMatch
    ? jsonMatch[0]
    : rawText.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
  return JSON.parse(cleaned);
};

// ─── OpenRouter Path ────────────────────────────────────────────────────────

const analyzeViaOpenRouter = async (apiKey, prompt) => {
  // Prefer paid model, fall back to free tier
  const models = [
    (process.env.GEMINI_MODEL || '').trim(),
    'google/gemini-2.5-flash',
    'google/gemini-2.0-flash-001',
    'google/gemma-2-9b-it:free'
  ].filter(Boolean);

  let lastError = null;

  for (const model of [...new Set(models)]) {
    try {
      console.log(`📡 OpenRouter Attempt: ${model}...`);
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          max_tokens: 8192
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
            'X-Title': 'ResumeMitra'
          }
        }
      );

      const rawText = response.data?.choices?.[0]?.message?.content;
      if (rawText) {
        const parsed = extractJSON(rawText);
        console.log(`✅ OpenRouter success with model: ${model}`);
        return normalizeResult(parsed);
      }
    } catch (error) {
      lastError = error.response?.data?.error?.message || error.message;
      console.warn(`⚠️ OpenRouter model ${model} failed: ${lastError}`);
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  throw new Error(`OpenRouter API Failed. Last Error: ${lastError}`);
};

// ─── Direct Gemini Path ─────────────────────────────────────────────────────

const analyzeViaGemini = async (apiKey, prompt) => {
  const models = [
    (process.env.GEMINI_MODEL || '').trim(),
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
    'gemini-pro'
  ].filter(Boolean);

  let lastError = null;

  for (const model of [...new Set(models)]) {
    try {
      console.log(`📡 Direct Gemini Attempt: ${model} (v1)...`);
      const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192
        }
      });

      const result = response.data;
      if (result.candidates && result.candidates[0].content) {
        const rawText = result.candidates[0].content.parts[0].text;
        const parsed = extractJSON(rawText);
        console.log(`✅ Gemini success with model: ${model}`);
        return normalizeResult(parsed);
      }
    } catch (error) {
      lastError = error.response?.data?.error?.message || error.message;
      console.warn(`⚠️ Gemini model ${model} failed: ${lastError}`);
      if (lastError.includes('API_KEY_INVALID')) break;
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // DEBUG: list available models
  try {
    console.log('🔍 DEBUG: Listing all available models for this key...');
    const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const listRes = await axios.get(listUrl);
    console.log('📋 Available Models:', JSON.stringify(listRes.data.models?.map(m => m.name), null, 2));
  } catch (e) {
    console.error('❌ Could not list models:', e.response?.data?.error?.message || e.message);
  }

  const maskedKey = apiKey
    ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`
    : 'not configured';
  throw new Error(`Gemini API Failed. Last Error: ${lastError} (using key: ${maskedKey})`);
};

// ─── Main Export ────────────────────────────────────────────────────────────

const analyzeResumeWithGemini = async (resumeText, jobDescription, targetRole = '') => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured.');
  }

  const prompt = buildPrompt(resumeText, jobDescription);

  if (apiKey.startsWith('sk-or-v1-')) {
    console.log('🔀 Routing through OpenRouter...');
    return analyzeViaOpenRouter(apiKey, prompt);
  } else {
    console.log('🔀 Routing through direct Google Gemini API...');
    return analyzeViaGemini(apiKey, prompt);
  }
};

const generateLatexResume = async () => {
  throw new Error('LaTeX generation is temporarily disabled during API debugging.');
};

module.exports = { analyzeResumeWithGemini, generateLatexResume };
