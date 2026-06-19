// ─── Helper Utilities ──────────────────────────────────────────────────────

/**
 * Score color class
 */
export const getScoreColor = (score) => {
  if (score >= 80) return 'text-emerald-600 font-semibold'
  if (score >= 60) return 'text-amber-600 font-semibold'
  if (score >= 40) return 'text-orange-600 font-semibold'
  return 'text-rose-600 font-semibold'
}

export const getScoreBg = (score) => {
  if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20'
  if (score >= 60) return 'bg-amber-500/10 border-amber-500/20'
  if (score >= 40) return 'bg-orange-500/10 border-orange-500/20'
  return 'bg-rose-500/10 border-rose-500/20'
}

export const getScoreGradient = (score) => {
  if (score >= 80) return 'from-emerald-500 to-teal-500'
  if (score >= 60) return 'from-amber-500 to-yellow-500'
  if (score >= 40) return 'from-orange-500 to-amber-600'
  return 'from-rose-500 to-red-600'
}

export const getScoreLabel = (score) => {
  if (score >= 90) return 'Outstanding'
  if (score >= 80) return 'Excellent'
  if (score >= 70) return 'Strong'
  if (score >= 60) return 'Good'
  if (score >= 50) return 'Fair'
  if (score >= 40) return 'Needs Work'
  return 'Major Rewrite'
}

export const getScoreEmoji = (score) => {
  if (score >= 80) return '🔥'
  if (score >= 60) return '✨'
  if (score >= 40) return '⚠️'
  return '❗'
}

/**
 * Confidence badge color
 */
export const getConfidenceColor = (level) => {
  if (level === 'high') return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20 font-semibold'
  if (level === 'medium') return 'text-amber-600 bg-amber-500/10 border-amber-500/20 font-semibold'
  return 'text-slate-600 bg-slate-500/10 border-slate-500/20 font-semibold'
}

/**
 * Format file size in human-readable units
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Format date
 */
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format date short
 */
export const formatDateShort = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Extract error message from Axios error
 */
export const extractError = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  )
}

/**
 * Target role options for the dropdown
 */
export const TARGET_ROLES = [
  { value: '', label: 'Auto-detect from JD' },
  { value: 'Frontend Developer', label: 'Frontend Developer' },
  { value: 'Backend Developer', label: 'Backend Developer' },
  { value: 'Full-Stack Developer', label: 'Full-Stack Developer' },
  { value: 'Software Engineer', label: 'Software Engineer' },
  { value: 'Software Engineer Intern', label: 'Software Engineer Intern' },
  { value: 'Data Analyst', label: 'Data Analyst' },
  { value: 'Data Scientist', label: 'Data Scientist' },
  { value: 'AI/ML Engineer', label: 'AI/ML Engineer' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer' },
  { value: 'Mobile Developer', label: 'Mobile Developer' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'UI/UX Designer', label: 'UI/UX Designer' },
  { value: 'QA Engineer', label: 'QA Engineer' },
  { value: 'Cloud Engineer', label: 'Cloud Engineer' },
  { value: 'Cybersecurity', label: 'Cybersecurity' },
  { value: 'Other', label: 'Other' },
]

/**
 * Score dimension labels for the radar/bar charts
 */
export const SCORE_LABELS = {
  keywordMatch: 'Keyword Match',
  contentStrength: 'Content Strength',
  skillsAlignment: 'Skills Alignment',
  experienceImpact: 'Experience Impact',
  projectRelevance: 'Project Relevance',
  educationFit: 'Education Fit',
  formattingATS: 'ATS Formatting',
  readability: 'Readability',
}

export const SCORE_ICONS_MAP = {
  keywordMatch: 'Search',
  contentStrength: 'FileText',
  skillsAlignment: 'Code',
  experienceImpact: 'Briefcase',
  projectRelevance: 'FolderGit2',
  educationFit: 'GraduationCap',
  formattingATS: 'Layout',
  readability: 'Eye',
}

/**
 * Impact badge color
 */
export const getImpactColor = (impact) => {
  if (impact === 'high') return 'text-rose-300 bg-rose-500/10 border-rose-500/20'
  if (impact === 'medium') return 'text-amber-300 bg-amber-500/10 border-amber-500/20'
  return 'text-slate-300 bg-slate-500/10 border-slate-500/20'
}
