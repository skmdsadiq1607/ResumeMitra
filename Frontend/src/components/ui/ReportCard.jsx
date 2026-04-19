import { motion } from 'framer-motion'
import { FileText, TrendingUp, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getScoreColor, getScoreLabel, getScoreEmoji, formatDate } from '../../utils/helpers'

const ReportCard = ({ report, index = 0, isSelected = false, onToggleSelect }) => {
  const score = report.overallScore || 0
  const matched = report.matchedKeywords?.length || 0
  const missing = report.missingKeywords?.length || 0
  const total = matched + missing

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="relative"
    >
      <div 
        onClick={() => onToggleSelect?.()}
        className={`glass-card block p-5 transition-all duration-200 group relative cursor-pointer ${
          isSelected ? 'border-primary-500 bg-primary-500/10 ring-1 ring-primary-500 shadow-glow-sm' : 'hover:border-primary-500/30'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <Link
            to={`/analysis/${report._id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-start gap-3 min-w-0 flex-1 hover:no-underline"
          >
            <div className={`w-10 h-10 rounded-xl ${isSelected ? 'bg-primary-500/20' : 'bg-primary-500/10'} border border-primary-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/15 group-hover:scale-105 transition-all duration-200`}>
              <FileText size={17} className="text-primary-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                {report.originalFileName || 'Resume'}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {report.jobTitle && <span className="text-xs text-slate-500 truncate">{report.jobTitle}</span>}
                {report.targetRole && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold text-primary-300 bg-primary-500/10 border border-primary-500/15">
                    <Target size={8} /> {report.targetRole}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-600 mt-1">{formatDate(report.createdAt)}</p>
            </div>
          </Link>
          
          {/* Score badge */}
          <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
            <span className="text-lg">{getScoreEmoji(score)}</span>
            <div className={`text-xl font-bold font-display ${getScoreColor(score)}`}>{score}</div>
            <div className="text-[10px] text-slate-600">{getScoreLabel(score)}</div>
          </div>
        </div>

        {/* Score bar + stats */}
        <div className="mt-4">
          <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : score >= 40 ? 'bg-orange-500' : 'bg-rose-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-emerald-400">{matched} matched</span>
              <span className="text-rose-400">{missing} missing</span>
              {total > 0 && <span className="text-slate-600">{Math.round((matched / total) * 100)}% match</span>}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ReportCard
