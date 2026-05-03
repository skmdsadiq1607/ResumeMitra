import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BarChart3, Upload, History, TrendingUp, Zap, ArrowRight,
  FileText, Sparkles, Target, Brain, Award, Cpu,
  ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react'
import { dashboardService } from '../services/resumeService'
import { CardSkeleton } from '../components/ui/Skeleton'
import ReportCard from '../components/ui/ReportCard'
import { getScoreLabel } from '../utils/helpers'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }) }

const TiltCard = ({ children, className }) => {
  const ref = React.useRef(null);
  const [rotate, setRotate] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * -10, y: x * 10 });
  };

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StatCard = ({ label, value, sub, icon: Icon, gradient, delay }) => (
  <TiltCard className="relative group h-full">
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10"
      style={{ background: `linear-gradient(135deg, var(--tw-gradient-from) 20%, transparent)` }} />
    <div className={`glass-card p-6 h-full border border-surface-border hover:border-primary-500/30 transition-all duration-500 relative overflow-hidden bg-gradient-to-br ${gradient} bg-opacity-5`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={20} className="text-white" />
        </div>
        <span className="px-2.5 py-1 rounded-full bg-surface-card border border-surface-border text-[10px] text-text-muted uppercase tracking-wider font-bold">{sub}</span>
      </div>
      <div className="text-4xl font-display font-black text-text-primary mb-1 tracking-tight">{value}</div>
      <div className="text-sm font-medium text-text-muted">{label}</div>
    </div>
  </TiltCard>
)

const ActionCard = ({ to, icon: Icon, title, desc, gradient, delay }) => (
  <TiltCard>
    <Link to={to} className="glass-card p-5 block group border border-surface-border hover:border-primary-500/30 transition-all duration-300 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} p-0.5 group-hover:scale-105 transition-transform duration-300`}>
          <div className="w-full h-full bg-surface-card rounded-[10px] flex items-center justify-center">
            <Icon size={20} className="text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-text-primary group-hover:text-primary-500 transition-colors">{title}</p>
          <p className="text-xs text-text-muted">{desc}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
          <ChevronRight size={16} className="text-text-muted group-hover:text-primary-500 transition-colors" />
        </div>
      </div>
    </Link>
  </TiltCard>
)

const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats().then((r) => r.data.data),
  })

  if (isLoading) {
    return (
      <div className="flex justify-between px-4"><div className="w-48 h-8 bg-surface-card rounded animate-pulse border border-surface-border" /><div className="w-32 h-10 bg-surface-card rounded animate-pulse border border-surface-border" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4"><CardSkeleton /><CardSkeleton /></div>
          <div className="space-y-4"><CardSkeleton /></div>
        </div>
      </div>
    )
  }

  const s = data || {}
  const hasReports = (s.recentReports?.length || 0) > 0

  return (
    <div className="space-y-8 relative">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight flex items-center gap-3">
            Dashboard
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Free Plan
            </span>
          </h1>
          <p className="text-text-muted mt-2 text-sm font-medium">Your AI-powered resume command center.</p>
        </div>
        <Link to="/upload" className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-violet-500 to-primary-500 bg-[length:200%_auto] animate-gradient-x" />
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles size={16} /> New Analysis
          </span>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        <StatCard label="Total Analyses" value={s.totalAnalyses ?? 0} sub="Lifetime" icon={FileText} gradient="from-blue-500 to-indigo-500" delay={1} />
        <StatCard label="Average Score" value={`${s.averageScore ?? 0}`} sub="/100" icon={BarChart3} gradient="from-primary-500 to-violet-500" delay={2} />
        <StatCard label="Best Score" value={`${s.bestScore ?? 0}`} sub={getScoreLabel(s.bestScore ?? 0)} icon={Award} gradient="from-emerald-500 to-teal-500" delay={3} />
        <StatCard label="Score Growth" value={`${(s.improvement ?? 0) >= 0 ? '+' : ''}${s.improvement ?? 0}`} sub="Points" icon={TrendingUp} gradient="from-amber-500 to-orange-500" delay={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Recent Reports */}
        <div className="lg:col-span-2 space-y-6 px-4">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-text-primary flex items-center gap-2">
              <History size={20} className="text-primary-400" /> Recent Analyses
            </h2>
            {hasReports && (
              <Link to="/history" className="text-sm font-medium text-text-muted hover:text-primary-400 transition-colors flex items-center gap-1 group">
                View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </motion.div>

          <AnimatePresence mode="popLayout">
            {hasReports ? (
              <div className="space-y-4">
                {s.recentReports.map((r, i) => (
                  <motion.div key={r._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (i * 0.1) }}>
                    <ReportCard report={r} index={i} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
                className="relative glass-card border-dashed border-2 border-surface-border p-12 sm:p-16 text-center group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface-card flex items-center justify-center mb-6 border border-surface-border shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Cpu size={28} className="text-primary-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-text-primary mb-3">No analyses yet</h3>
                  <p className="text-sm sm:text-base text-text-muted mb-8 max-w-sm mx-auto leading-relaxed">
                    Upload your resume and a job description to get a comprehensive AI-powered ATS analysis instantly.
                  </p>
                  <Link to="/upload" className="btn-primary px-8 py-4 text-base shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                    <Zap size={18} /> Start Your First Analysis
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 px-4">
          <motion.h2 variants={fadeUp} initial="hidden" animate="visible" custom={6} className="text-xl font-display font-bold text-text-primary flex items-center gap-2">
            <Zap size={20} className="text-accent-400" /> Quick Actions
          </motion.h2>

          <div className="space-y-3">
            <ActionCard to="/upload" icon={Upload} title="Analyze Resume" desc="Get instant ATS score & feedback" gradient="from-primary-500 to-violet-500" delay={7} />
            <ActionCard to="/history" icon={FileText} title="View History" desc="Compare your past analyses" gradient="from-accent-500 to-teal-500" delay={8} />
          </div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={9} className="glass-card p-6 relative overflow-hidden group border border-surface-border bg-surface-card">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl -mr-10 -mt-10" />
            <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider flex items-center gap-2">
              <Brain size={16} className="text-primary-400" /> Scoring Engine
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Keyword Match', pts: 25, color: 'text-primary-400', bg: 'bg-primary-500/20' },
                { label: 'Skills Match', pts: 20, color: 'text-violet-400', bg: 'bg-violet-500/20' },
                { label: 'Experience', pts: 15, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
                { label: 'Formatting', pts: 10, color: 'text-amber-400', bg: 'bg-amber-500/20' },
              ].map(({ label, pts, color, bg }) => (
                <div key={label} className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className={color} />
                    <span className="text-sm font-medium text-text-muted group-hover/item:text-text-primary transition-colors">{label}</span>
                  </div>
                  <span className={`text-xs font-bold ${color} ${bg} px-2 py-0.5 rounded-md`}>{pts} pts</span>
                </div>
              ))}
            </div>
            <Link to="/how-ats-works" className="mt-5 text-xs text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors">
              <AlertCircle size={12} /> View full scoring criteria
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
