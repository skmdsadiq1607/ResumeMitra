/**
 * ATS Scoring Engine — Client-side transparent scoring
 * Total score = 100 points across 7 dimensions
 */

// ── Acronym/synonym map for semantic matching ──
const SYNONYMS = {
  'javascript': ['js', 'ecmascript', 'es6', 'es2015'],
  'typescript': ['ts'],
  'python': ['py'],
  'machine learning': ['ml', 'deep learning', 'dl'],
  'artificial intelligence': ['ai'],
  'search engine optimization': ['seo'],
  'user interface': ['ui'],
  'user experience': ['ux'],
  'application programming interface': ['api', 'apis', 'rest api', 'restful api'],
  'continuous integration': ['ci'],
  'continuous deployment': ['cd'],
  'ci/cd': ['cicd', 'ci cd', 'continuous integration', 'continuous deployment'],
  'amazon web services': ['aws'],
  'google cloud platform': ['gcp'],
  'microsoft azure': ['azure'],
  'structured query language': ['sql'],
  'nosql': ['no-sql', 'non-relational'],
  'react': ['reactjs', 'react.js'],
  'angular': ['angularjs', 'angular.js'],
  'vue': ['vuejs', 'vue.js'],
  'node': ['nodejs', 'node.js'],
  'express': ['expressjs', 'express.js'],
  'mongodb': ['mongo'],
  'postgresql': ['postgres'],
  'docker': ['containerization', 'containers'],
  'kubernetes': ['k8s'],
  'project management': ['pm'],
  'product manager': ['pm'],
};

const ACTION_VERBS = [
  'achieved', 'architected', 'automated', 'built', 'created', 'decreased',
  'delivered', 'designed', 'developed', 'drove', 'engineered', 'established',
  'executed', 'generated', 'grew', 'implemented', 'improved', 'increased',
  'initiated', 'integrated', 'launched', 'led', 'managed', 'migrated',
  'optimized', 'orchestrated', 'pioneered', 'reduced', 'refactored',
  'resolved', 'revamped', 'scaled', 'shipped', 'spearheaded', 'streamlined',
  'transformed', 'upgraded',
];

const WEAK_VERBS = [
  'worked', 'helped', 'assisted', 'responsible', 'involved', 'participated',
  'handled', 'did', 'made', 'used', 'tried', 'got',
];

const SECTION_HEADINGS = [
  'contact', 'summary', 'objective', 'profile', 'education', 'experience',
  'work experience', 'employment', 'skills', 'technical skills', 'projects',
  'certifications', 'achievements', 'awards', 'publications', 'volunteer',
  'leadership', 'extracurricular', 'interests', 'references', 'internship',
];

// ── Helper: normalize text ──
const normalize = (text) => (text || '').toLowerCase().replace(/[^a-z0-9\s+#./]/g, ' ').replace(/\s+/g, ' ').trim();

// ── Helper: extract words ──


// ── Helper: check semantic match ──
function semanticMatch(word, target) {
  const w = normalize(word);
  const t = normalize(target);
  if (w === t) return true;
  if (w.includes(t) || t.includes(w)) return true;
  for (const [key, syns] of Object.entries(SYNONYMS)) {
    const allForms = [key, ...syns].map(normalize);
    if (allForms.includes(w) && allForms.includes(t)) return true;
  }
  return false;
}

// ── Extract keywords from job description ──
export function extractJDKeywords(jdText) {
  const text = normalize(jdText);
  const words = text.split(' ').filter(w => w.length > 2);
  const stopWords = new Set(['the','and','for','are','but','not','you','all','can','had','her','was','one','our','out','has','its','will','with','this','that','from','they','been','have','many','some','them','than','each','make','like','over','such','into','year','also','back','more','most','other','when','what','which','their','about','would','there','after','these','could','being','where','does','just','only','very','must','should','shall','need','want','work','well','good','great','best','high','strong','experience','ability','knowledge','understanding','looking','seeking','join','team','company','role','position','candidate','required','requirements','qualifications','responsibilities','preferred','plus','bonus','nice','ideal']);
  
  // Count frequency
  const freq = {};
  words.forEach(w => {
    if (!stopWords.has(w) && w.length > 2) {
      freq[w] = (freq[w] || 0) + 1;
    }
  });

  // Extract multi-word phrases (bigrams)
  const phrases = [];
  const wordArr = text.split(' ');
  for (let i = 0; i < wordArr.length - 1; i++) {
    const phrase = `${wordArr[i]} ${wordArr[i+1]}`;
    if (!stopWords.has(wordArr[i]) && !stopWords.has(wordArr[i+1]) && wordArr[i].length > 2 && wordArr[i+1].length > 2) {
      phrases.push(phrase);
    }
  }
  
  // Sort by frequency
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const keywords = sorted.slice(0, 60).map(([w]) => w);
  const importantPhrases = [...new Set(phrases)].slice(0, 20);
  
  return { keywords, importantPhrases, frequency: freq };
}

// ── A. Keyword Match Score (25 points) ──
export function calculateKeywordScore(resumeText, jdKeywords) {
  const resumeNorm = normalize(resumeText);
  const matched = [];
  const missing = [];
  const overused = [];

  jdKeywords.keywords.forEach(kw => {
    const resumeWords = resumeNorm.split(' ');
    const count = resumeWords.filter(w => semanticMatch(w, kw)).length;
    if (count > 0) {
      matched.push(kw);
      if (count > 8) overused.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const matchRatio = jdKeywords.keywords.length > 0 ? matched.length / jdKeywords.keywords.length : 0;
  const stuffingPenalty = overused.length * 0.5;
  let score = Math.min(25, Math.round(matchRatio * 25) - stuffingPenalty);
  score = Math.max(0, score);

  return { score, matched, missing, overused, maxScore: 25 };
}

// ── B. Skills Match Score (20 points) ──
export function calculateSkillScore(resumeText, jdText) {
  const skillCategories = {
    languages: ['javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'php', 'scala', 'r', 'dart', 'html', 'css'],
    frameworks: ['react', 'angular', 'vue', 'django', 'flask', 'spring', 'express', 'next', 'nuxt', 'svelte', 'laravel', 'rails', 'fastapi', 'nest', 'gatsby', 'tailwind', 'bootstrap'],
    databases: ['mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'dynamodb', 'firebase', 'sqlite', 'oracle', 'cassandra', 'sql server'],
    cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'github actions', 'gitlab', 'heroku', 'vercel', 'netlify'],
    tools: ['git', 'jira', 'figma', 'postman', 'swagger', 'webpack', 'vite', 'npm', 'yarn', 'linux', 'nginx', 'apache'],
    soft: ['leadership', 'communication', 'teamwork', 'problem solving', 'analytical', 'agile', 'scrum', 'collaboration', 'mentoring'],
  };

  const resumeNorm = normalize(resumeText);
  const jdNorm = normalize(jdText);
  const required = [];
  const found = [];
  const gap = [];

  Object.values(skillCategories).flat().forEach(skill => {
    if (jdNorm.includes(normalize(skill))) {
      required.push(skill);
      if (resumeNorm.includes(normalize(skill)) || 
          Object.entries(SYNONYMS).some(([k, v]) => [k,...v].map(normalize).includes(normalize(skill)) && [k,...v].some(s => resumeNorm.includes(normalize(s))))) {
        found.push(skill);
      } else {
        gap.push(skill);
      }
    }
  });

  const ratio = required.length > 0 ? found.length / required.length : 0.5;
  const score = Math.round(ratio * 20);

  return { score, required, found, gap, maxScore: 20 };
}

// ── C. Experience Relevance Score (15 points) ──
export function calculateExperienceScore(resumeText, jdText) {
  const resumeNorm = normalize(resumeText);
  const jdNorm = normalize(jdText);
  const factors = [];
  let score = 0;

  // Check for experience/work sections
  if (/experience|employment|work history|internship/i.test(resumeText)) {
    score += 3; factors.push('Has experience section');
  }
  if (/project/i.test(resumeText)) {
    score += 2; factors.push('Has projects section');
  }
  // Check for date patterns (employment dates)
  const datePatterns = resumeText.match(/\b(20\d{2}|19\d{2})\b/g) || [];
  if (datePatterns.length >= 2) {
    score += 2; factors.push('Contains employment dates');
  }
  // Check responsibility overlap
  const jdWords = new Set(jdNorm.split(' ').filter(w => w.length > 4));
  const resumeWords = new Set(resumeNorm.split(' ').filter(w => w.length > 4));
  const overlap = [...jdWords].filter(w => resumeWords.has(w)).length;
  const overlapRatio = jdWords.size > 0 ? overlap / jdWords.size : 0;
  score += Math.round(overlapRatio * 8);

  return { score: Math.min(15, score), factors, maxScore: 15 };
}

// ── D. Structure & Section Completeness (15 points) ──
export function calculateStructureScore(resumeText) {
  const sections = [];
  const missing = [];
  let score = 0;

  const checks = [
    { name: 'Contact Info', test: /email|@|phone|\d{10}|linkedin/i, weight: 2 },
    { name: 'Summary/Objective', test: /summary|objective|profile|about/i, weight: 2 },
    { name: 'Education', test: /education|university|college|degree|bachelor|master/i, weight: 2 },
    { name: 'Skills', test: /skills|technical skills|technologies|competencies/i, weight: 2 },
    { name: 'Experience', test: /experience|employment|work history/i, weight: 3 },
    { name: 'Projects', test: /project/i, weight: 2 },
    { name: 'Certifications', test: /certification|certified|certificate/i, weight: 1 },
    { name: 'Achievements', test: /achievement|award|honor|recognition/i, weight: 1 },
  ];

  checks.forEach(({ name, test, weight }) => {
    if (test.test(resumeText)) {
      sections.push({ name, status: 'good' });
      score += weight;
    } else {
      missing.push(name);
      sections.push({ name, status: 'missing' });
    }
  });

  // Check for links
  if (/github|linkedin|portfolio|http/i.test(resumeText)) {
    sections.push({ name: 'Links', status: 'good' });
  } else {
    sections.push({ name: 'Links', status: 'warning' });
    missing.push('Links (GitHub/LinkedIn/Portfolio)');
  }

  return { score: Math.min(15, score), sections, missing, maxScore: 15 };
}

// ── E. ATS Formatting Score (10 points) ──
export function calculateFormattingScore(resumeText) {
  let score = 10;
  const issues = [];

  // Check for standard headings
  const hasStandardHeadings = SECTION_HEADINGS.some(h => resumeText.toLowerCase().includes(h));
  if (!hasStandardHeadings) { score -= 2; issues.push({ problem: 'No standard section headings found', fix: 'Use clear headings like Education, Experience, Skills' }); }
  
  // Check length
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 150) { score -= 2; issues.push({ problem: 'Resume seems too short', fix: 'Add more detail — aim for 400-800 words' }); }
  if (wordCount > 1500) { score -= 1; issues.push({ problem: 'Resume may be too long', fix: 'Keep to 1-2 pages. Remove irrelevant content' }); }

  // Check for special characters that confuse ATS
  if (/[│┃┄┅┆┇┈┉┊┋╌╍╎╏═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬]/.test(resumeText)) {
    score -= 2; issues.push({ problem: 'Special box-drawing characters detected', fix: 'Use simple dashes and pipes instead' });
  }

  // Check for bullet points
  if (/[•▸▹►‣⁃–—]/.test(resumeText) || /^[\s]*[-*]\s/m.test(resumeText)) {
    // Good — has bullet points
  } else {
    score -= 1; issues.push({ problem: 'No bullet points detected', fix: 'Use bullet points for experience and project descriptions' });
  }

  // Check for proper date formatting
  if (/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4}/i.test(resumeText) || /\d{2}\/\d{4}/.test(resumeText)) {
    // Good date format
  } else if (/\b20\d{2}\b/.test(resumeText)) {
    // Acceptable
  } else {
    score -= 1; issues.push({ problem: 'No clear date formatting found', fix: 'Use format like "Jan 2023 - Present" or "2022-2024"' });
  }

  return { score: Math.max(0, score), issues, maxScore: 10 };
}

// ── F. Impact & Achievement Quality (10 points) ──
export function calculateImpactScore(resumeText) {
  const lines = resumeText.split('\n').filter(l => l.trim().length > 10);
  let score = 0;
  const weakBullets = [];

  let actionVerbCount = 0;
  let metricCount = 0;

  lines.forEach(line => {
    const l = line.trim().toLowerCase();
    const firstWord = l.split(' ')[0]?.replace(/[^a-z]/g, '');
    
    if (ACTION_VERBS.includes(firstWord)) actionVerbCount++;
    if (WEAK_VERBS.includes(firstWord)) {
      weakBullets.push({ original: line.trim(), issue: `Starts with weak verb "${firstWord}"` });
    }
    if (/\d+%|\d+x|\$\d+|\d+\+|\d+ users|\d+ clients|\d+ projects/i.test(line)) {
      metricCount++;
    }
  });

  // Score based on action verbs
  if (actionVerbCount >= 5) score += 4;
  else if (actionVerbCount >= 3) score += 3;
  else if (actionVerbCount >= 1) score += 1;

  // Score based on metrics
  if (metricCount >= 3) score += 4;
  else if (metricCount >= 1) score += 2;

  // Bonus for strong bullets
  if (weakBullets.length === 0 && actionVerbCount >= 3) score += 2;

  return { score: Math.min(10, score), weakBullets, actionVerbCount, metricCount, maxScore: 10 };
}

// ── G. Grammar & Professional Tone (5 points) ──
export function calculateGrammarScore(resumeText) {
  let score = 5;
  const issues = [];

  // Check for first person
  if (/\bI\b(?!\.)|'\bmy\b|\bme\b|\bmyself\b/i.test(resumeText)) {
    score -= 1; issues.push('First-person pronouns detected (I, my, me). Use third-person or imperative.');
  }
  // Check for inconsistent tense
  const pastTense = (resumeText.match(/\b\w+ed\b/g) || []).length;
  const presentTense = (resumeText.match(/\b\w+ing\b/g) || []).length;
  if (pastTense > 5 && presentTense > 5) {
    score -= 1; issues.push('Inconsistent verb tenses. Stick to past tense for past roles, present for current.');
  }
  // Check for very long bullets
  const longLines = resumeText.split('\n').filter(l => l.trim().length > 200);
  if (longLines.length > 2) {
    score -= 1; issues.push('Some bullet points are too long. Keep them under 2 lines.');
  }
  // Repeated words check
  const words = normalize(resumeText).split(' ');
  const freq = {};
  words.forEach(w => { if (w.length > 4) freq[w] = (freq[w] || 0) + 1; });
  const repeated = Object.entries(freq).filter(([, c]) => c > 8).map(([w]) => w);
  if (repeated.length > 3) {
    score -= 1; issues.push(`Overused words: ${repeated.slice(0, 5).join(', ')}. Vary your vocabulary.`);
  }

  return { score: Math.max(0, score), issues, maxScore: 5 };
}

// ── Main: Calculate Final ATS Score ──
export function calculateATSScore(resumeText, jdText) {
  const jdKeywords = extractJDKeywords(jdText);
  const keyword = calculateKeywordScore(resumeText, jdKeywords);
  const skill = calculateSkillScore(resumeText, jdText);
  const experience = calculateExperienceScore(resumeText, jdText);
  const structure = calculateStructureScore(resumeText);
  const formatting = calculateFormattingScore(resumeText);
  const impact = calculateImpactScore(resumeText);
  const grammar = calculateGrammarScore(resumeText);

  const totalScore = keyword.score + skill.score + experience.score + structure.score + formatting.score + impact.score + grammar.score;

  // Grade
  let grade, gradeLabel;
  if (totalScore >= 90) { grade = 'A+'; gradeLabel = 'Excellent ATS Match'; }
  else if (totalScore >= 75) { grade = 'A'; gradeLabel = 'Strong Match'; }
  else if (totalScore >= 60) { grade = 'B'; gradeLabel = 'Moderate Match'; }
  else if (totalScore >= 40) { grade = 'C'; gradeLabel = 'Needs Improvement'; }
  else { grade = 'D'; gradeLabel = 'Poor Match'; }

  return {
    score: totalScore,
    grade,
    gradeLabel,
    dimensions: {
      keyword: { label: 'Keyword Match', score: keyword.score, max: 25, color: 'primary' },
      skill: { label: 'Skills Alignment', score: skill.score, max: 20, color: 'violet' },
      experience: { label: 'Experience Depth', score: experience.score, max: 15, color: 'emerald' },
      structure: { label: 'Section Health', score: structure.score, max: 15, color: 'blue' },
      formatting: { label: 'ATS Formatting', score: formatting.score, max: 10, color: 'amber' },
      impact: { label: 'Impact & Metrics', score: impact.score, max: 10, color: 'rose' },
      grammar: { label: 'Professional Tone', score: grammar.score, max: 5, color: 'indigo' },
    },
    breakdown: {
      keyword,
      skill,
      experience,
      structure,
      formatting,
      impact,
      grammar,
    },
    matchedKeywords: keyword.matched,
    missingKeywords: keyword.missing,
    overusedKeywords: keyword.overused,
    skillGap: skill.gap,
    requiredSkills: skill.required,
    foundSkills: skill.found,
    sectionHealth: structure.sections,
    missingSections: structure.missing,
    formattingIssues: formatting.issues,
    weakBullets: impact.weakBullets,
    grammarIssues: grammar.issues,
  };
}

// ── Generate Suggestions ──
export function generateSuggestions(atsResult) {
  const suggestions = [];
  const { breakdown } = atsResult;

  if (breakdown.keyword.score < 15) {
    suggestions.push({ priority: 'critical', text: `Add these missing keywords: ${atsResult.missingKeywords.slice(0, 8).join(', ')}` });
  }
  if (breakdown.skill.gap.length > 0) {
    suggestions.push({ priority: 'critical', text: `Missing required skills: ${breakdown.skill.gap.slice(0, 5).join(', ')}` });
  }
  if (breakdown.structure.missing.length > 0) {
    suggestions.push({ priority: 'high', text: `Add missing sections: ${breakdown.structure.missing.join(', ')}` });
  }
  if (breakdown.impact.metricCount < 2) {
    suggestions.push({ priority: 'high', text: 'Add measurable metrics (numbers, percentages, $ amounts) to your bullet points' });
  }
  if (breakdown.impact.weakBullets.length > 0) {
    suggestions.push({ priority: 'high', text: `Replace weak verbs: ${breakdown.impact.weakBullets.map(b => b.issue).slice(0, 3).join('; ')}` });
  }
  breakdown.formatting.issues.forEach(issue => {
    suggestions.push({ priority: 'medium', text: `${issue.problem}. Fix: ${issue.fix}` });
  });
  breakdown.grammar.issues.forEach(issue => {
    suggestions.push({ priority: 'low', text: issue });
  });

  return suggestions;
}

// ── Generate Recruiter Verdict ──
export function generateRecruiterVerdict(atsResult) {
  const { totalScore, matchedKeywords, missingKeywords, breakdown } = atsResult;
  
  if (totalScore >= 85) {
    return `This resume is a strong match for the position. It demonstrates relevant skills (${matchedKeywords.slice(0, 4).join(', ')}), uses action-oriented language, and has a clear structure. With minor polish on ${missingKeywords.length > 0 ? 'a few missing keywords' : 'formatting'}, this candidate would likely advance to the interview stage.`;
  } else if (totalScore >= 65) {
    return `This resume shows potential but needs targeted improvements. While it matches on ${matchedKeywords.length} keywords, it's missing ${missingKeywords.length} important terms from the job description. ${breakdown.impact.metricCount < 2 ? 'Adding quantified achievements would significantly strengthen it.' : ''} With focused revisions, this could become a competitive application.`;
  } else if (totalScore >= 40) {
    return `This resume needs significant work before it would pass most ATS filters. Key gaps include: missing ${missingKeywords.slice(0, 5).join(', ')} keywords, ${breakdown.structure.missing.length > 0 ? 'incomplete sections' : 'weak bullet points'}, and ${breakdown.skill.gap.length > 0 ? `${breakdown.skill.gap.length} missing required skills` : 'lack of measurable impact'}. A thorough rewrite targeting the job description is recommended.`;
  } else {
    return `This resume is not aligned with the target position. It matches very few of the required keywords and skills. A complete restructuring is needed — focus on adding relevant skills, using job-description keywords naturally, quantifying achievements, and ensuring all standard resume sections are present.`;
  }
}
