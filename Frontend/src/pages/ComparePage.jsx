import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle2, XCircle, FileText, Search, TrendingUp, Zap, ArrowRight, Shield, Target } from 'lucide-react'
import { resumeService } from '../services/resumeService'
import { ResultSkeleton } from '../components/ui/Skeleton'
import { getScoreColor, getScoreEmoji, SCORE_LABELS } from '../utils/helpers'

const DeltaValue = ({ val }) => (
  <span className={`text-xs font-bold ${val > 0 ? 'text-emerald-400' : val < 0 ? 'text-rose-400' : 'text-text-muted'}`}>
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
      <p className="text-text-muted">Could not compare reports</p>
      <button onClick={() => navigate('/history')} className="btn-primary mt-4">Back to History</button>
    </div>
  )

  const { older, newer, delta, newlyMatched, newlyMissing } = data



  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between no-print">
        <div>
          <button onClick={() => navigate(-1)} className="btn-ghost text-sm mb-2 -ml-2"><ArrowLeft size={14} /> Back</button>
          <h1 className="text-2xl font-display font-bold text-text-primary">Analysis Comparison</h1>
        </div>
        <button onClick={() => window.print()} className="btn-secondary text-xs py-2 px-5">Export Comparison PDF</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Older Report Summary */}
        <div className="glass-card p-6 border-l-4 border-l-surface-border bg-surface-card">
          <span className="section-badge mb-3">Version A (Older)</span>
          <h2 className="text-lg font-bold text-text-primary truncate mb-1">{older.originalFileName}</h2>
          <p className="text-xs text-text-muted mb-4">{new Date(older.createdAt).toLocaleDateString()}</p>
          <div className="flex items-center gap-4 bg-surface-card/50 border border-surface-border p-4 rounded-xl">
            <div className={`text-4xl font-bold font-display ${getScoreColor(older.overallScore)}`}>{older.overallScore}</div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Overall Score</p>
              <p className="text-sm text-text-primary">{getScoreEmoji(older.overallScore)} {older.targetRole || 'General'}</p>
            </div>
          </div>
        </div>

        {/* Newer Report Summary */}
        <div className="glass-card border border-primary-500/30 p-6 border-l-4 border-l-primary-500 bg-primary-500/5">
          <span className="section-badge mb-3 bg-primary-500/20 text-primary-500 border-primary-500/30">Version B (Newer)</span>
          <h2 className="text-lg font-bold text-text-primary truncate mb-1">{newer.originalFileName}</h2>
          <p className="text-xs text-text-muted mb-4">{new Date(newer.createdAt).toLocaleDateString()}</p>
          <div className="flex items-center gap-4 bg-surface-card border border-primary-500/10 p-4 rounded-xl">
            <div className={`text-4xl font-bold font-display ${getScoreColor(newer.overallScore)}`}>{newer.overallScore}</div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Overall Score</p>
              <p className="text-sm text-text-primary">{getScoreEmoji(newer.overallScore)} {newer.targetRole || 'General'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Delta</p>
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
        <h3 className="text-sm font-bold text-text-primary mb-6 uppercase tracking-widest flex items-center gap-2">
          <TrendingUp size={16} className="text-primary-400" /> Dimension Comparison
        </h3>
        <div className="space-y-6">
          {Object.entries(SCORE_LABELS).map(([key, label]) => {
            const scoreA = older.scores?.[key] || 0
            const scoreB = newer.scores?.[key] || 0
            const d = scoreB - scoreA
            return (
              <div key={key} className="space-y-2 group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted group-hover:text-text-primary transition-colors uppercase tracking-wider">{label}</span>
                  <DeltaValue val={d} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-text-muted opacity-60">
                      <span>Version A</span>
                      <span>{scoreA}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-card border border-surface-border rounded-full overflow-hidden">
                        <div className="h-full bg-surface-hover rounded-full" style={{ width: `${scoreA}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-primary-500 opacity-60 font-bold">
                      <span>Version B</span>
                      <span>{scoreB}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-card border border-primary-500/10 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-primary-500 rounded-full shadow-glow-sm" style={{ width: `${scoreB}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Keywords Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 border border-emerald-500/10">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Gained Keywords</h3>
          </div>
          {newlyMatched.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {newlyMatched.map(kw => <span key={kw} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">+{kw}</span>)}
            </div>
          ) : <p className="text-xs text-text-muted">No new keywords matched in this version.</p>}
        </div>
        <div className="glass-card p-6 border border-rose-500/10">
          <div className="flex items-center gap-2 mb-4">
            <XCircle size={16} className="text-rose-400" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Newly Missing</h3>
          </div>
           {newlyMissing.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {newlyMissing.map(kw => <span key={kw} className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider">-{kw}</span>)}
            </div>
          ) : <p className="text-xs text-text-muted">No keywords were lost in this version.</p>}
        </div>
      </div>

      {/* Recap Verdicts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-4 rounded-xl bg-surface-card border border-surface-border">
            <p className="text-[10px] text-text-muted font-bold mb-2 uppercase tracking-widest">Version A Verdict</p>
            <p className="text-xs text-text-muted italic">"{older.recruiterVerdict || 'No verdict recorded.'}"</p>
         </div>
         <div className="p-4 rounded-xl bg-primary-500/5 border border-primary-500/10">
            <p className="text-[10px] text-primary-500/70 font-bold mb-2 uppercase tracking-widest">Version B Verdict</p>
            <p className="text-xs text-text-primary italic">"{newer.recruiterVerdict || 'No verdict recorded.'}"</p>
         </div>
      </div>
    </div>
  )
}

export default ComparePage
