import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Upload, FileText, Search, TrendingUp, Brain } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { resumeService } from '../services/resumeService'
import { ReportCardSkeleton } from '../components/ui/Skeleton'
import ReportCard from '../components/ui/ReportCard'

const HistoryPage = () => {
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['resume-history', page],
    queryFn: () => resumeService.getHistory({ page, limit: 10 }).then((r) => r.data.data),
    keepPreviousData: true,
  })

  const reports = data?.reports || []
  const pagination = data?.pagination || {}

  const toggleSelect = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleCompare = () => {
    if (selected.length !== 2) return
    navigate(`/compare?idA=${selected[0]}&idB=${selected[1]}`)
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Analysis History</h1>
          <p className="text-text-muted mt-1 text-sm">
            {pagination.total ? `${pagination.total} total analyses` : 'All your past resume analyses'}
            {selected.length > 0 && <span className="text-primary-400 font-bold ml-2">· {selected.length} selected</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
           {selected.length === 2 && (
             <motion.button 
               initial={{ scale: 0.9, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }}
               onClick={handleCompare} 
               className="btn-primary-glow px-5 py-2.5 text-xs bg-primary-500 text-white rounded-xl shadow-glow"
             >
               Compare Selected
             </motion.button>
           )}
           <Link to="/upload" className="btn-primary text-sm py-2.5 px-5">
             <Upload size={14} /> New Analysis
           </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <ReportCardSkeleton key={i} />)}
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-card border border-surface-border p-16 text-center">
          <Brain size={48} className="text-text-muted/30 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-text-primary mb-2">No analyses yet</h3>
          <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
            Upload your resume and paste a job description to get a comprehensive AI-powered ATS analysis.
          </p>
          <Link to="/upload" className="btn-primary text-sm py-3 px-6">
            <Upload size={14} /> Analyze My Resume
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {reports.map((r, i) => (
              <div key={r._id} className="relative group/row">
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/row:opacity-100 transition-opacity">
                   <input 
                    type="checkbox" 
                    checked={selected.includes(r._id)}
                    onChange={() => toggleSelect(r._id)}
                    disabled={selected.length >= 2 && !selected.includes(r._id)}
                    className="w-5 h-5 accent-primary-500 cursor-pointer"
                   />
                </div>
                <ReportCard 
                  report={r} 
                  index={i} 
                  isSelected={selected.includes(r._id)} 
                  onToggleSelect={() => toggleSelect(r._id)}
                />
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary text-sm py-2 px-5 disabled:opacity-30"
              >
                ← Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                      page === i + 1
                        ? 'bg-primary-500 text-white shadow-glow-sm'
                        : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="btn-secondary text-sm py-2 px-5 disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HistoryPage
