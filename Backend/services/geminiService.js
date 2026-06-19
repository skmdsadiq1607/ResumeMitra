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

  // Priority list of models (using the names discovered in your logs!)
  const models = [
    (process.env.GEMINI_MODEL || '').trim(),
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
    'gemini-pro'
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
      console.log(`📡 Direct API Attempt: ${model} (v1)...`);
      const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
      
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Even lower for better JSON
          maxOutputTokens: 8192 // Increased to prevent truncated responses
        }
      });

      const result = response.data;
      if (result.candidates && result.candidates[0].content) {
        let rawText = result.candidates[0].content.parts[0].text;
        
        // Aggressive JSON Cleaning
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const cleaned = jsonMatch ? jsonMatch[0] : rawText.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
        
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
      // Wait 2 seconds before trying the next model to avoid rate limits
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // DEBUG: If everything failed, list what IS available
  try {
    console.log('🔍 DEBUG: Listing all available models for this key...');
    const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const listRes = await axios.get(listUrl);
    console.log('📋 Available Models:', JSON.stringify(listRes.data.models?.map(m => m.name), null, 2));
  } catch (e) {
    console.error('❌ Could not even list models:', e.response?.data?.error?.message || e.message);
  }

  throw new Error(`Gemini API Failed. Last Error: ${lastError}`);
};

const generateLatexResume = async () => {
  throw new Error('LaTeX generation is temporarily disabled during API debugging.');
};

module.exports = { analyzeResumeWithGemini, generateLatexResume };
