export const demoReport = {
  _id: 'demo',
  originalFileName: 'Alex_Johnson_Resume.pdf',
  targetRole: 'Frontend Developer',
  createdAt: new Date().toISOString(),
  overallScore: 78,
  confidenceLevel: 'high',
  summary: 'Alex shows strong frontend foundation but lacks quantified achievements and critical modern framework keywords (Next.js, TypeScript).',
  recruiterVerdict: 'Solid candidate for a mid-level React role, but the resume feels a bit generic. I’d want to see more metrics on how their UI improvements impacted user retention or load times.',
  
  scores: {
    keywordMatch: 65,
    skillsAlignment: 80,
    experienceImpact: 70,
    contentStrength: 60,
    projectRelevance: 85,
    educationFit: 90,
    formattingATS: 95,
    readability: 85
  },

  scoreExplanation: {
    positiveFactors: [
      'Excellent ATS-friendly formatting with clear headings.',
      'Strong match for core frontend skills (React, JavaScript, CSS).',
      'Relevant CS degree from a recognized university.'
    ],
    negativeFactors: [
      'Missing critical keywords mentioned in the JD (TypeScript, Next.js).',
      'Experience bullets lack measurable impact (e.g., "Improved performance" vs "Reduced load time by 40%").',
      'Projects section is missing links to live demos or GitHub repos.'
    ]
  },

  matchedKeywords: ['React', 'JavaScript', 'CSS', 'Redux', 'REST APIs', 'Git', 'Agile', 'HTML5', 'Tailwind'],
  missingKeywords: ['TypeScript', 'Next.js', 'GraphQL', 'Jest', 'CI/CD', 'Webpack'],
  
  strengths: [
    'Clean, professional layout that parses perfectly in standard ATS.',
    'Clear progression of responsibilities in the latest role.',
    'Good foundational knowledge of core web technologies.'
  ],
  weaknesses: [
    'Overuse of passive verbs ("Responsible for", "Helped with").',
    'Zero quantified metrics to prove the scale of your work.',
    'Missing modern React ecosystem skills that the employer specifically requested.'
  ],

  quickFixes: [
    {
      issue: 'Vague Bullet Points',
      description: 'You say you "optimized the website" but don\'t mention the result.',
      fix: 'Add metrics: "Optimized website performance, increasing Lighthouse score by 35% and reducing bounce rate by 15%."',
      impact: 'high'
    },
    {
      issue: 'Missing Links',
      description: 'Recruiters want to see your code, but there are no URLs.',
      fix: 'Add clickable GitHub and Portfolio links right under your contact info.',
      impact: 'high'
    }
  ],

  weakPhrases: [
    {
      original: 'Responsible for building new features for the admin dashboard',
      problem: 'Passive language, no impact shown.',
      replacement: 'Engineered and shipped 5+ core features for the admin dashboard, reducing internal reporting time by 20 hours/week.'
    },
    {
      original: 'Worked on bug fixes and UI updates',
      problem: 'Too generic, sounds like basic maintenance.',
      replacement: 'Resolved 50+ critical UI bugs and modernized legacy components using React hooks, improving overall app stability.'
    }
  ],

  rewrittenBulletPoints: [
    {
      original: 'Created a new checkout page using React',
      improved: 'Developed a high-converting checkout flow using React and Stripe API, resulting in a 12% increase in successful transactions.',
      reason: 'Adds the specific tool (Stripe) and a believable, strong business metric (12% increase).'
    }
  ],

  categorizedSuggestions: {
    critical: [
      'Add TypeScript to your skills and at least one project description.',
      'Rewrite your top 3 experience bullets to start with strong action verbs (e.g., "Architected", "Spearheaded").'
    ],
    atsOptimization: [
      'Ensure your job titles exactly match standard industry terms (e.g., use "Frontend Developer" instead of "UI Coder").'
    ]
  },

  interviewReadiness: {
    score: 65,
    clues: [
      'Strong technical foundation implies you can pass basic coding screens.',
      'Lack of impact metrics might make behavioral rounds (like the STAR method) difficult.'
    ]
  },

  missingTools: ['Next.js', 'Jest', 'Docker'],
  learningRoadmap: ['TypeScript Fundamentals', 'Next.js App Router', 'Writing unit tests with Jest'],
  
  nextSteps: [
    'Spend 30 minutes rewriting your 5 most recent bullet points using the XYZ formula.',
    'Take a weekend crash course on Next.js and build a small side project to add to your resume.',
    'Run your updated resume through the Instant Analysis tool to check your new score.'
  ],

  jobDescription: "We are looking for a Mid-Level Frontend Developer to join our core product team. You will be responsible for building fast, scalable web applications. Requirements: 3+ years of experience with React and modern JavaScript. Strong proficiency in TypeScript and Next.js is required. Experience with state management (Redux/Zustand), testing (Jest/Testing Library), and CI/CD pipelines. You should have a track record of improving web performance and working closely with design teams to implement pixel-perfect UIs."
};
