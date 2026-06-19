import { motion } from 'framer-motion'
import { getScoreColor, getScoreGradient } from '../../utils/helpers'

/**
 * Section score progress bar with animated fill
 */
const SectionScoreBar = ({ label, score = 0, icon: Icon, delay = 0 }) => {
  const colorClass = getScoreColor(score)
  const gradientClass = getScoreGradient(score)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className="text-text-muted" />}
          <span className="text-sm font-medium text-text-secondary">{label}</span>
        </div>
        <span className={`text-sm font-bold ${colorClass}`}>{score}%</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradientClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
          style={{
            boxShadow: score > 40 ? `0 0 8px rgba(99,102,241,0.3)` : 'none',
          }}
        />
      </div>
    </div>
  )
}

export default SectionScoreBar
