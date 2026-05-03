import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

import {
  ArrowLeft, CheckCircle2, XCircle, Lightbulb, Pencil, Trash2,
  Code, Briefcase, GraduationCap, FolderGit2, Star, Layout,
  Search, Eye, FileText, AlertTriangle, Target, TrendingUp,
  Zap, BookOpen, Shield, ArrowRight, ChevronDown, Wrench,
  Flame, Award, Brain, MessageSquare, Rocket, Download
} from 'lucide-react'
import { resumeService } from '../services/resumeService'
import { ResultSkeleton } from '../components/ui/Skeleton'
import ScoreCircle from '../components/ui/ScoreCircle'
import SectionScoreBar from '../components/ui/SectionScoreBar'
import { formatDate, getScoreEmoji, getConfidenceColor, getImpactColor, SCORE_LABELS } from '../utils/helpers'
import toast from 'react-hot-toast'
import { demoReport } from '../data/demoReport'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 }
})

const scoreIcons = {
  keywordMatch: Search,
  contentStrength: FileText,
  skillsAlignment: Code,
  experienceImpact: Briefcase,
  projectRelevance: FolderGit2,
  educationFit: GraduationCap,
  formattingATS: Layout,
  readability: Eye,
}

// ─── Tilt Card component ───
const TiltCard = ({ children, className = '', delay = 0, gradient = false }) => {
  const ref = React.useRef(null);
  const [rotate, setRotate] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * -5, y: x * 5 });
  };

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...fadeUp(delay)}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`glass-card p-6 ${gradient ? 'gradient-border' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

const Card = ({ children, className = '', delay = 0, gradient = false }) => (
  <motion.div {...fadeUp(delay)} className={`glass-card p-6 ${gradient ? 'gradient-border' : ''} ${className}`}>
    {children}
  </motion.div>
)

const CardHeader = ({ icon: Icon, title, badge, iconColor = 'text-primary-400', badgeClass = 'section-badge' }) => (
  <div className="flex items-center gap-2.5 mb-5">
    {Icon && <Icon size={17} className={iconColor} />}
    <h2 className="text-base font-semibold text-text-primary flex-1">{title}</h2>
    {badge && <span className={badgeClass}>{badge}</span>}
  </div>
)

const AnalysisResultPage = () => {
  const params = useParams()
  const id = params.id || (window.location.pathname.endsWith('/demo') ? 'demo' : undefined)
  const navigate = useNavigate()

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: async () => {
      if (id === 'demo') {
        // Return demo data immediately
        return demoReport;
      }
      if (!id) return null;
      const res = await resumeService.getReport(id);
      return res.data.data.report;
    },
    enabled: !!id,
  })

  const handleDelete = async () => {
    if (!window.confirm('Delete this analysis? This cannot be undone.')) return
    try {
      await resumeService.deleteReport(id)
      toast.success('Report deleted.')
      navigate('/history')
    } catch { toast.error('Failed to delete report.') }
  }

  if (isLoading) return <div className="py-8"><ResultSkeleton /></div>
  if (error || !report) {
    return (
      <div className="glass-card p-12 text-center">
        <XCircle size={40} className="text-rose-400 mx-auto mb-3" />
        <p className="text-text-muted font-medium">Report not found</p>
        <Link to="/history" className="btn-primary mt-4 text-sm py-2 px-5 inline-flex">← Back to History</Link>
      </div>
    )
  }

  const scores = report.scores || {}
  const explanation = report.scoreExplanation || {}
  const cats = report.categorizedSuggestions || {}

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between flex-wrap gap-4 no-print">
        <div>
          <button 
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate('/dashboard');
              }
            }} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-text-muted hover:text-text-primary hover:bg-white/5 transition-all mb-4 -ml-2"
          >
            <ArrowLeft size={16} /> 
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-xl font-display font-bold text-text-primary truncate">{report.originalFileName}</h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-text-muted opacity-60">{formatDate(report.createdAt)}</span>
            {report.targetRole && <span className="section-badge text-[10px]">{report.targetRole}</span>}
            {id === 'demo' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border text-amber-400 border-amber-400 bg-amber-500/10">
                <Star size={9} /> Demo Preview
              </span>
            )}
            {report.confidenceLevel && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getConfidenceColor(report.confidenceLevel)}`}>
                <Shield size={9} /> {report.confidenceLevel} confidence
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/overleaf-builder/${id}`} className="btn-primary text-xs py-2 px-4 shadow-glow flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 border-violet-500/50">
            <Code size={13} /> Generate Overleaf Resume
          </Link>
          <button onClick={() => window.print()} className="btn-secondary text-xs py-2 px-4 hidden sm:flex items-center gap-1.5 border-primary-500/30 hover:border-primary-500/60 hover:bg-primary-500/5">
            <Download size={13} className="text-primary-400" /> Download Report (PDF)
          </button>
          <Link to="/upload" className="btn-secondary text-xs py-2 px-4 hidden sm:flex items-center gap-1.5">
            <Zap size={13} /> Re-analyze
          </Link>
          <button onClick={handleDelete} className="btn-ghost text-xs text-rose-400 hover:bg-rose-500/5 p-2" title="Delete Report">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* ═══ Hero Score Card ═══ */}
      <TiltCard delay={0.05} gradient>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <ScoreCircle score={report.overallScore} size={190} strokeWidth={12} />
          </div>
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div>
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
                <span className="text-2xl">{getScoreEmoji(report.overallScore)}</span>
                <h2 className="text-xl font-display font-bold text-text-primary">Analysis Summary</h2>
              </div>
              <p className="text-text-muted text-sm leading-relaxed">{report.summary || 'Analysis complete.'}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { v: report.matchedKeywords?.length || 0, l: 'Matched', c: 'text-emerald-400' },
                { v: report.missingKeywords?.length || 0, l: 'Missing', c: 'text-rose-400' },
                { v: report.strengths?.length || 0, l: 'Strengths', c: 'text-primary-400' },
                { v: report.quickFixes?.length || 0, l: 'Quick Fixes', c: 'text-amber-400' },
              ].map(({ v, l, c }) => (
                <div key={l} className="bg-surface-card border border-surface-border rounded-xl p-3 text-center transition-colors hover:border-primary-500/30">
                  <div className={`text-xl font-bold font-display ${c}`}>{v}</div>
                  <div className="text-[10px] text-text-muted mt-0.5 font-medium uppercase tracking-wider">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>

      {/* ═══ Recruiter Verdict ═══ */}
      {report.recruiterVerdict && (
        <Card delay={0.1}>
          <CardHeader icon={MessageSquare} title="Recruiter Verdict" iconColor="text-violet-400" />
          <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/15">
            <p className="text-sm text-text-secondary leading-relaxed italic">"{report.recruiterVerdict}"</p>
          </div>
        </Card>
      )}

      {/* ═══ 8-Dimension Score Grid ═══ */}
      <Card delay={0.15}>
        <CardHeader icon={TrendingUp} title="Score Breakdown" badge={`${Object.keys(scores).length} dimensions`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(scores).map(([key, score], i) => {
            const Icon = scoreIcons[key] || Star
            return (
              <SectionScoreBar
                key={key}
                label={SCORE_LABELS[key] || key}
                score={score}
                icon={Icon}
                delay={i * 0.06}
              />
            )
          })}
        </div>
      </Card>

      {/* ═══ Score Explanation ═══ */}
      {(explanation.positiveFactors?.length > 0 || explanation.negativeFactors?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Positive */}
          <Card delay={0.2}>
            <CardHeader icon={TrendingUp} title="What Boosted Your Score" iconColor="text-emerald-400" />
            <div className="space-y-2">
              {(explanation.positiveFactors || []).map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-text-secondary leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
          </Card>
          {/* Negative */}
          <Card delay={0.22}>
            <CardHeader icon={AlertTriangle} title="What Reduced Your Score" iconColor="text-rose-400" />
            <div className="space-y-2">
              {(explanation.negativeFactors || []).map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                  <XCircle size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-text-secondary leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ═══ Strengths & Weaknesses ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {report.strengths?.length > 0 && (
          <Card delay={0.25}>
            <CardHeader icon={Award} title="Resume Strengths" iconColor="text-emerald-400" badge={`${report.strengths.length}`} />
            <div className="space-y-2">
              {report.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <Flame size={13} className="text-emerald-400 flex-shrink-0 mt-1" />
                  <span className="leading-relaxed">{s}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
        {report.weaknesses?.length > 0 && (
          <Card delay={0.27}>
            <CardHeader icon={AlertTriangle} title="Areas Hurting Your Chances" iconColor="text-rose-400" badge={`${report.weaknesses.length}`} />
            <div className="space-y-2">
              {report.weaknesses.map((w, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <XCircle size={13} className="text-rose-400 flex-shrink-0 mt-1" />
                  <span className="leading-relaxed">{w}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* ═══ Keywords ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card delay={0.3}>
          <CardHeader icon={CheckCircle2} title="Matched Keywords" iconColor="text-emerald-400" badge={`${report.matchedKeywords?.length || 0}`} />
          <div className="flex flex-wrap gap-2">
            {(report.matchedKeywords || []).length === 0 ? <p className="text-sm text-text-muted">None found.</p> : report.matchedKeywords.map((kw, i) => (
              <span key={i} className="keyword-chip-matched">{kw}</span>
            ))}
          </div>
        </Card>
        <Card delay={0.32}>
          <CardHeader icon={XCircle} title="Missing Keywords" iconColor="text-rose-400" badge={`${report.missingKeywords?.length || 0}`} />
          <div className="flex flex-wrap gap-2">
            {(report.missingKeywords || []).length === 0 ? <p className="text-sm text-emerald-400">All matched! 🎉</p> : report.missingKeywords.map((kw, i) => (
              <span key={i} className="keyword-chip-missing">{kw}</span>
            ))}
          </div>
        </Card>
      </div>

      {/* ═══ Quick Fixes ═══ */}
      {report.quickFixes?.length > 0 && (
        <Card delay={0.35}>
          <CardHeader icon={Zap} title="Quick Fixes" iconColor="text-amber-400" badge="High Priority" badgeClass="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20" />
          <div className="space-y-3">
            {report.quickFixes.map((fix, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-400">{i + 1}</div>
                  <p className="text-sm font-semibold text-text-primary">{fix.issue}</p>
                  {fix.impact && <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getImpactColor(fix.impact)}`}>{fix.impact}</span>}
                </div>
                <p className="text-xs text-text-muted leading-relaxed">{fix.description}</p>
                <p className="text-xs text-emerald-500 leading-relaxed font-bold">→ {fix.fix}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* ═══ Advanced Improvements ═══ */}
      {report.advancedImprovements?.length > 0 && (
        <Card delay={0.4}>
          <CardHeader icon={Rocket} title="Advanced Improvements" iconColor="text-violet-400" badge={`${report.advancedImprovements.length} tips`} />
          <div className="space-y-4">
            {report.advancedImprovements.map((imp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="section-badge text-[10px]">{imp.area}</span>
                  <p className="text-sm font-semibold text-text-primary">{imp.issue}</p>
                </div>
                {imp.why && <p className="text-xs text-text-muted"><strong className="text-text-secondary">Why it matters:</strong> {imp.why}</p>}
                {imp.howToFix && <p className="text-xs text-primary-500 font-medium"><strong className="text-primary-500">How to fix:</strong> {imp.howToFix}</p>}
                {imp.example && <p className="text-xs text-emerald-500 font-mono bg-surface-hover p-2 rounded-lg">{imp.example}</p>}
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* ═══ Weak Phrases ═══ */}
      {report.weakPhrases?.length > 0 && (
        <Card delay={0.45}>
          <CardHeader icon={Wrench} title="Weak Phrases Detected" iconColor="text-orange-400" badge={`${report.weakPhrases.length} found`} />
          <div className="space-y-3">
            {report.weakPhrases.map((wp, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm text-rose-400 line-through flex-1 font-mono">"{wp.original}"</span>
                  <ArrowRight size={14} className="text-text-muted hidden sm:block" />
                  <span className="text-sm text-emerald-500 flex-1 font-mono">"{wp.replacement}"</span>
                </div>
                <p className="text-xs text-text-muted">{wp.problem}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ═══ Rewritten Bullet Points ═══ */}
      {report.rewrittenBulletPoints?.length > 0 && (
        <Card delay={0.5}>
          <CardHeader icon={Pencil} title="Stronger Resume Version" iconColor="text-primary-400" badge="Use these!" />
          <div className="space-y-4">
            {report.rewrittenBulletPoints.map((bp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.04 }}
                className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-2"
              >
                {bp.original && bp.original !== 'NEW' && (
                  <p className="text-xs text-rose-400/70 line-through">{bp.original}</p>
                )}
                <p className="text-sm text-emerald-500 font-mono leading-relaxed">▸ {bp.improved}</p>
                {bp.reason && <p className="text-[11px] text-text-muted mt-1">{bp.reason}</p>}
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* ═══ Categorized Suggestions ═══ */}
      {Object.values(cats).some(arr => arr?.length > 0) && (
        <Card delay={0.55}>
          <CardHeader icon={Lightbulb} title="AI Suggestions by Priority" iconColor="text-amber-400" />
          <div className="space-y-5">
            {[
              { key: 'critical', label: 'Critical Fixes', color: 'rose', icon: AlertTriangle },
              { key: 'highImpact', label: 'High Impact', color: 'amber', icon: Zap },
              { key: 'atsOptimization', label: 'ATS Optimization', color: 'primary', icon: Target },
              { key: 'roleSpecific', label: 'Role-Specific', color: 'violet', icon: Briefcase },
              { key: 'polish', label: 'Polish & Refinement', color: 'slate', icon: Pencil },
            ].map(({ key, label, color, icon: Icon }) => {
              const items = cats[key] || []
              if (items.length === 0) return null
              return (
                <div key={key}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={13} className={`text-${color}-500`} />
                    <span className={`text-xs font-semibold text-${color}-500 uppercase tracking-wider`}>{label}</span>
                    <span className="text-[10px] text-text-muted">{items.length}</span>
                  </div>
                  <div className="space-y-2 ml-5">
                    {items.map((s, i) => (
                      <div key={i} className={`flex items-start gap-2 text-sm text-text-secondary p-2.5 rounded-lg bg-${color}-500/5 border border-${color}-500/10`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500 flex-shrink-0 mt-1.5`} />
                        <span className="leading-relaxed">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* ═══ Missing Tools + Learning Roadmap ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {report.missingTools?.length > 0 && (
          <Card delay={0.6}>
            <CardHeader icon={Wrench} title="Missing Tools & Technologies" iconColor="text-orange-400" />
            <div className="flex flex-wrap gap-2">
              {report.missingTools.map((t, i) => (
                <span key={i} className="keyword-chip-missing">{t}</span>
              ))}
            </div>
          </Card>
        )}
        {report.learningRoadmap?.length > 0 && (
          <Card delay={0.62}>
            <CardHeader icon={BookOpen} title="Learning Roadmap" iconColor="text-accent-400" badge="Priority order" />
            <div className="space-y-2">
              {report.learningRoadmap.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-accent-500/5 border border-accent-500/10">
                  <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center text-[10px] font-bold text-accent-500">{i + 1}</div>
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* ═══ Interview Readiness ═══ */}
      {report.interviewReadiness?.score > 0 && (
        <Card delay={0.65}>
          <CardHeader icon={Brain} title="Interview Readiness" iconColor="text-violet-400" badge={`${report.interviewReadiness.score}/100`} />
          <div className="mb-4">
            <div className="h-2.5 bg-dark-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-primary-500"
                initial={{ width: 0 }}
                animate={{ width: `${report.interviewReadiness.score}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
          <div className="space-y-2">
            {(report.interviewReadiness.clues || []).map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <Eye size={13} className="text-violet-500 flex-shrink-0 mt-1" />
                <span className="leading-relaxed">{c}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ═══ Next Steps ═══ */}
      {report.nextSteps?.length > 0 && (
        <Card delay={0.7}>
          <CardHeader icon={Rocket} title="Recommended Next Steps" iconColor="text-emerald-400" />
          <div className="space-y-2">
            {report.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-500">{i + 1}</div>
                <p className="text-sm text-text-secondary leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ═══ Section Recommendations ═══ */}
      {report.sectionRecommendations && Object.values(report.sectionRecommendations).some(v => v) && (
        <Card delay={0.75}>
          <CardHeader icon={FileText} title="Section-by-Section Advice" iconColor="text-primary-400" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(report.sectionRecommendations).map(([key, val]) => {
              if (!val) return null
              const labels = { skills: 'Skills', experience: 'Experience', projects: 'Projects', education: 'Education', summary: 'Summary/Objective' }
              return (
                <div key={key} className="p-3 rounded-xl bg-surface-card border border-surface-border">
                  <p className="text-xs font-semibold text-primary-500 mb-1 uppercase tracking-wider">{labels[key] || key}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{val}</p>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* ═══ JD Preview ═══ */}
      <Card delay={0.8}>
        <CardHeader icon={FileText} title="Job Description Used" />
        <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap line-clamp-[8]">{report.jobDescription}</p>
      </Card>
    </div>
  )
}

export default AnalysisResultPage
