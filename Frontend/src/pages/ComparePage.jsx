import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle2, XCircle, FileText, Search, TrendingUp, Zap, ArrowRight, Shield, Target } from 'lucide-react'
import { resumeService } from '../services/resumeService'
import { ResultSkeleton } from '../components/ui/Skeleton'
import { getScoreColor, getScoreEmoji, SCORE_LABELS } from '../utils/helpers'

const DeltaValue = ({ val }) => (
  <span className={`text-xs font-bold ${val > 0 ? 'text-emerald-400' : val < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
    {val > 0 ? `+${val}` : val}
  </span>
)

const ComparePage = () => {
  const [searchParams] = useSearchParams()
  const idA = searchParams.get('idA')
  const idB = searchParams.get('idB')
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['compare', idA, idB],
    queryFn: () => resumeService.compareReports(idA, idB).then(r => r.data.data),
    enabled: !!idA && !!idB
  })

  if (isLoading) return <div className="py-8"><ResultSkeleton /></div>
  if (error || !data) return (
    <div className="glass-card p-12 text-center">
      <XCircle size={40} className="text-rose-400 mx-auto mb-3" />
      <p className="text-slate-300">Could not compare reports</p>
      <button onClick={() => navigate('/history')} className="btn-primary mt-4">Back to History</button>
    </div>
  )

  const { older, newer, delta, newlyMatched, newlyMissing } = data



  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between no-print">
        <div>
          <button onClick={() => navigate(-1)} className="btn-ghost text-sm mb-2 -ml-2"><ArrowLeft size={14} /> Back</button>
          <h1 className="text-2xl font-display font-bold text-white">Analysis Comparison</h1>
        </div>
        <button onClick={() => window.print()} className="btn-secondary text-xs py-2 px-5">Export Comparison PDF</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Older Report Summary */}
        <div className="glass-card p-6 border-l-4 border-l-slate-600">
          <span className="section-badge mb-3">Version A (Older)</span>
          <h2 className="text-lg font-bold text-white truncate mb-1">{older.originalFileName}</h2>
          <p className="text-xs text-slate-500 mb-4">{new Date(older.createdAt).toLocaleDateString()}</p>
          <div className="flex items-center gap-4 bg-dark-700/50 p-4 rounded-xl">
            <div className={`text-4xl font-bold font-display ${getScoreColor(older.overallScore)}`}>{older.overallScore}</div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Score</p>
              <p className="text-sm text-slate-200">{getScoreEmoji(older.overallScore)} {older.targetRole || 'General'}</p>
            </div>
          </div>
        </div>

        {/* Newer Report Summary */}
        <div className="glass-card gradient-border p-6 border-l-4 border-l-primary-500">
          <span className="section-badge mb-3 bg-primary-500/20 text-primary-300 border-primary-500/30">Version B (Newer)</span>
          <h2 className="text-lg font-bold text-white truncate mb-1">{newer.originalFileName}</h2>
          <p className="text-xs text-slate-500 mb-4">{new Date(newer.createdAt).toLocaleDateString()}</p>
          <div className="flex items-center gap-4 bg-dark-700/50 p-4 rounded-xl">
            <div className={`text-4xl font-bold font-display ${getScoreColor(newer.overallScore)}`}>{newer.overallScore}</div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Score</p>
              <p className="text-sm text-slate-200">{getScoreEmoji(newer.overallScore)} {newer.targetRole || 'General'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Delta</p>
              <div className="text-xl inline-flex items-center gap-1">
                <DeltaValue val={delta.overallScore} />
                {delta.overallScore > 0 ? <TrendingUp size={16} className="text-emerald-400" /> : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Comparison Grid */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Dimension Comparison</h3>
        <div className="space-y-4">
          {Object.entries(SCORE_LABELS).map(([key, label]) => {
            const scoreA = older.scores?.[key] || 0
            const scoreB = newer.scores?.[key] || 0
            const d = scoreB - scoreA
            return (
              <div key={key} className="grid grid-cols-12 items-center gap-4 group">
                <div className="col-span-12 sm:col-span-3">
                  <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">{label}</span>
                </div>
                <div className="col-span-5 sm:col-span-4 h-2 bg-dark-700 rounded-full overflow-hidden relative">
                   <div className="absolute right-0 h-full bg-slate-600/30 rounded-full" style={{ width: `${scoreA}%` }} />
                </div>
                <div className="col-span-2 text-center text-xs font-bold text-slate-200">
                  {scoreA} → {scoreB}
                </div>
                <div className="col-span-5 sm:col-span-4 h-2 bg-dark-700 rounded-full overflow-hidden">
                   <div className={`h-full bg-primary-500 rounded-full`} style={{ width: `${scoreB}%` }} />
                </div>
                <div className="col-span-12 sm:col-span-1 text-right">
                   <DeltaValue val={d} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Keywords Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Gained Keywords</h3>
          </div>
          {newlyMatched.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {newlyMatched.map(kw => <span key={kw} className="keyword-chip-matched">+{kw}</span>)}
            </div>
          ) : <p className="text-xs text-slate-500">No new keywords matched in this version.</p>}
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle size={16} className="text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Newly Missing</h3>
          </div>
           {newlyMissing.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {newlyMissing.map(kw => <span key={kw} className="keyword-chip-missing">-{kw}</span>)}
            </div>
          ) : <p className="text-xs text-slate-500">No keywords were lost in this version.</p>}
        </div>
      </div>

      {/* Recap Verdicts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-500/10">
            <p className="text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-widest">Version A Verdict</p>
            <p className="text-xs text-slate-400 italic">"{older.recruiterVerdict || 'No verdict recorded.'}"</p>
         </div>
         <div className="p-4 rounded-xl bg-primary-500/5 border border-primary-500/10">
            <p className="text-[10px] text-primary-500/70 font-bold mb-2 uppercase tracking-widest">Version B Verdict</p>
            <p className="text-xs text-slate-300 italic">"{newer.recruiterVerdict || 'No verdict recorded.'}"</p>
         </div>
      </div>
    </div>
  )
}

export default ComparePage
