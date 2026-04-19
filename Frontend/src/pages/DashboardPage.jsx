import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BarChart3, Upload, History, TrendingUp, Zap, ArrowRight,
  FileText, Sparkles, Target, Brain, Award, Rocket
} from 'lucide-react'
import { dashboardService } from '../services/resumeService'
import { CardSkeleton } from '../components/ui/Skeleton'
import ReportCard from '../components/ui/ReportCard'
import { getScoreColor, getScoreLabel, getScoreEmoji } from '../utils/helpers'

const StatCard = ({ label, value, sub, icon: Icon, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="stat-card group hover:shadow-card-hover"
  >
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-glow-sm`}>
        <Icon size={18} className="text-white" />
      </div>
      <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">{sub}</span>
    </div>
    <div className="text-3xl font-display font-bold text-white mt-3">{value}</div>
    <div className="text-sm text-slate-400 mt-0.5">{label}</div>
  </motion.div>
)

const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats().then((r) => r.data.data),
  })

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><CardSkeleton /><CardSkeleton /></div>
      </div>
    )
  }

  const s = data || {}
  const hasReports = (s.recentReports?.length || 0) > 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">Your resume optimization command center.</p>
        </div>
        <Link to="/upload" className="btn-primary text-sm py-2.5 px-5">
          <Sparkles size={15} /> New Analysis
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Analyses" value={s.totalAnalyses ?? 0} sub="all time" icon={FileText} gradient="from-primary-500 to-violet-500" delay={0.05} />
        <StatCard label="Average Score" value={`${s.averageScore ?? 0}`} sub="/100" icon={BarChart3} gradient="from-accent-500 to-teal-500" delay={0.1} />
        <StatCard label="Best Score" value={`${s.bestScore ?? 0}`} sub={getScoreLabel(s.bestScore ?? 0)} icon={Award} gradient="from-emerald-500 to-green-500" delay={0.15} />
        <StatCard label="Improvement" value={`${(s.improvement ?? 0) >= 0 ? '+' : ''}${s.improvement ?? 0}`} sub="pts gained" icon={TrendingUp} gradient="from-amber-500 to-orange-500" delay={0.2} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent reports (2/3) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Recent Analyses</h2>
            {hasReports && (
              <Link to="/history" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">View all <ArrowRight size={12} /></Link>
            )}
          </div>
          {hasReports ? (
            <div className="space-y-3">
              {s.recentReports.map((r, i) => <ReportCard key={r._id} report={r} index={i} />)}
            </div>
          ) : (
            <div className="glass-card gradient-border p-16 text-center">
              <Brain size={48} className="text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-white mb-2">No analyses yet</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">Upload your resume and get a comprehensive AI-powered ATS analysis in seconds.</p>
              <Link to="/upload" className="btn-primary text-sm py-3 px-6 shadow-glow">
                <Sparkles size={15} /> Analyze My Resume
              </Link>
            </div>
          )}
        </motion.div>

        {/* Sidebar (1/3) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
          <h2 className="text-base font-semibold text-white">Quick Actions</h2>

          <Link to="/upload" className="glass-card block p-5 hover:border-primary-500/30 group transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 border border-primary-500/20 flex items-center justify-center group-hover:scale-105 transition-all">
                <Upload size={18} className="text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 group-hover:text-white">Analyze Resume</p>
                <p className="text-xs text-slate-500">15+ AI dimensions</p>
              </div>
              <ArrowRight size={16} className="text-slate-600 group-hover:text-primary-400 transition-colors" />
            </div>
          </Link>

          <Link to="/history" className="glass-card block p-5 hover:border-primary-500/30 group transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500/20 to-teal-500/20 border border-accent-500/20 flex items-center justify-center group-hover:scale-105 transition-all">
                <History size={18} className="text-accent-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 group-hover:text-white">View History</p>
                <p className="text-xs text-slate-500">Compare analyses</p>
              </div>
              <ArrowRight size={16} className="text-slate-600 group-hover:text-accent-400 transition-colors" />
            </div>
          </Link>

          {/* What you get */}
          <div className="glass-card p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">What AI Analyzes</p>
            {[
              ['Keyword Match', 'text-primary-400'],
              ['Content Strength', 'text-accent-400'],
              ['Skills Alignment', 'text-violet-400'],
              ['Experience Impact', 'text-emerald-400'],
              ['Project Relevance', 'text-amber-400'],
              ['ATS Formatting', 'text-rose-400'],
              ['Readability', 'text-teal-400'],
              ['Interview Readiness', 'text-blue-400'],
            ].map(([label, color]) => (
              <div key={label} className="flex items-center justify-between py-0.5">
                <span className="text-xs text-slate-400">{label}</span>
                <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`} />
              </div>
            ))}
          </div>

          {/* Score guide */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Score Guide</p>
            {[['90-100', 'Outstanding', 'text-emerald-400'], ['70-89', 'Strong', 'text-amber-400'], ['50-69', 'Needs Work', 'text-orange-400'], ['0-49', 'Major Rewrite', 'text-rose-400']].map(([range, label, color]) => (
              <div key={range} className="flex justify-between items-center py-1.5 border-b border-surface-border last:border-0">
                <span className={`text-xs font-bold ${color}`}>{range}</span>
                <span className="text-xs text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage
