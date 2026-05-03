/**
 * Gemini AI Service — Direct API Implementation
 * This version bypasses the official SDK to resolve persistent 404 errors.
 */

const axios = require('axios');

const analyzeResumeWithGemini = async (resumeText, jobDescription, targetRole = '') => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured.');
  }

  // Priority list of models
  const models = [
    (process.env.GEMINI_MODEL || '').trim(),
    'gemini-1.5-flash',
    'gemini-pro',
    'gemini-1.0-pro'
  ].filter(Boolean);

  const prompt = `
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

  let lastError = null;

  for (const model of [...new Set(models)]) {
    try {
      console.log(`📡 Direct API Attempt: ${model}...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048
        }
      });

      const result = response.data;
      if (result.candidates && result.candidates[0].content) {
        const rawText = result.candidates[0].content.parts[0].text;
        const cleaned = rawText.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
        const parsed = JSON.parse(cleaned);
        
        // Map to expected structure for compatibility
        return {
          ...parsed,
          score: parsed.overallScore || 0,
          grade: parsed.overallScore > 80 ? 'A' : 'B',
          dimensions: {
            keyword: { label: 'Keywords', score: parsed.scores.keywordMatch, max: 100, color: 'primary' },
            skill: { label: 'Skills', score: parsed.scores.skillsAlignment, max: 100, color: 'violet' },
            experience: { label: 'Experience', score: parsed.scores.experienceImpact, max: 100, color: 'emerald' }
          },
          aiSuggestions: parsed.suggestions || []
        };
      }
    } catch (error) {
      lastError = error.response?.data?.error?.message || error.message;
      console.warn(`⚠️ Model ${model} failed: ${lastError}`);
      if (lastError.includes('API_KEY_INVALID')) break;
    }
  }

  throw new Error(`Gemini API Failed. Last Error: ${lastError}`);
};

const generateLatexResume = async () => {
  throw new Error('LaTeX generation is temporarily disabled during API debugging.');
};

module.exports = { analyzeResumeWithGemini, generateLatexResume };
