import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  Upload, FileText, X, Loader2, Sparkles,
  CheckCircle2, Briefcase, Target, Brain,
  Zap, Shield, Eye, BarChart3, Download, ArrowRight, CornerDownRight
} from 'lucide-react'
import { resumeService } from '../services/resumeService'
import { extractError, formatFileSize, TARGET_ROLES } from '../utils/helpers'
import { extractTextFromFile } from '../utils/textExtractor'
import { calculateATSScore, generateSuggestions, generateRecruiterVerdict } from '../utils/atsEngine'
import { generateATSReport } from '../utils/reportGenerator'
import toast from 'react-hot-toast'
import ScoreCircle from '../components/ui/ScoreCircle'
import SectionScoreBar from '../components/ui/SectionScoreBar'

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

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) }

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
}

const UploadPage = () => {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [analysisMode, setAnalysisMode] = useState('local')
  const [localResult, setLocalResult] = useState(null)
  const [experienceLevel, setExperienceLevel] = useState('auto')
  const navigate = useNavigate()

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error(rejectedFiles[0].errors[0].code === 'file-too-large' ? 'File too large (Max 5MB).' : 'Only PDF, DOCX, and TXT allowed.')
      return
    }
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0])
      setStep(2)
      setLocalResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: ACCEPTED_TYPES, maxSize: 5 * 1024 * 1024, multiple: false
  })

  const handleLocalAnalysis = async () => {
    if (!file || jobDescription.trim().length < 50) return toast.error('Valid file and 50+ chars JD required.')
    setLoading(true)
    try {
      toast.loading('Analyzing locally...', { id: 'analysis' })
      const text = await extractTextFromFile(file)
      if (!text || text.trim().length < 30) throw new Error('Could not extract text. Check file format.')
      const res = calculateATSScore(text, jobDescription)
      res.suggestions = generateSuggestions(res)
      res.recruiterVerdict = generateRecruiterVerdict(res)
      setLocalResult(res)
      toast.success('Local analysis complete! 🎯', { id: 'analysis' })
    } catch (err) {
      toast.error(err.message || 'Analysis failed', { id: 'analysis' })
    } finally {
      setLoading(false)
    }
  }

  const handleAIAnalysis = async (e) => {
    e.preventDefault()
    if (!file || jobDescription.trim().length < 50) return toast.error('Valid file and 50+ chars JD required.')
    setLoading(true)
    const fd = new FormData()
    fd.append('resume', file)
    fd.append('jobDescription', jobDescription.trim())
    fd.append('targetRole', targetRole)
    try {
      const { data } = await resumeService.analyze(fd)
      toast.success('AI Deep Analysis complete!')
      navigate(`/analysis/${data.data._id}`)
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  const fileExt = file?.name.split('.').pop().toUpperCase()

  return (
    <div className="max-w-4xl mx-auto pb-20 relative">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="text-center mb-10 px-4">
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-text-primary tracking-tight mb-3">
          Analyze Your Resume
        </h1>
        <p className="text-text-muted font-medium mb-4">Get an instant, actionable ATS score to beat the bots.</p>
        <Link to="/analysis/demo" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-card border border-surface-border hover:border-primary-500/50 hover:bg-primary-500/10 text-xs font-bold text-text-muted hover:text-primary-500 transition-all duration-300">
          <Eye size={14} /> View Demo Preview
        </Link>
      </motion.div>

      {/* Stepper */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="flex items-center justify-center mb-10">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 1 ? 'bg-primary-500 text-white shadow-glow' : 'bg-surface-card text-text-muted border border-surface-border'}`}>1</div>
          <div className={`w-12 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary-500' : 'bg-surface-card border border-surface-border'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 2 ? 'bg-primary-500 text-white shadow-glow' : 'bg-surface-card text-text-muted border border-surface-border'}`}>2</div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="px-4">
            <TiltCard className="glass-card p-2 group hover:border-primary-500/30 transition-all duration-500">
              <div {...getRootProps()} className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-12 sm:p-20 text-center cursor-pointer transition-all duration-500 ${isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-surface-border hover:border-primary-500/40 hover:bg-surface-hover'}`}>
                <input {...getInputProps()} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-card/50 pointer-events-none" />
                
                <div className="relative z-10">
                  <motion.div animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-6 flex items-center justify-center bg-surface-card border border-surface-border shadow-2xl group-hover:bg-surface-hover transition-colors">
                    <Upload size={32} className={isDragActive ? 'text-primary-400' : 'text-text-muted group-hover:text-primary-400 transition-colors'} />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-text-primary mb-2">
                    {isDragActive ? 'Drop it like it\'s hot' : 'Select or drop your resume'}
                  </h3>
                  <p className="text-sm text-text-muted mb-8">PDF, DOCX, or TXT up to 5MB</p>
                  <button className="btn-primary px-8 py-3.5 text-sm shadow-glow pointer-events-none">
                    Browse Files
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4">
                {[{i: Target, t: 'Paste full job description'}, {i: Brain, t: '15+ ATS dimensions checked'}, {i: Shield, t: '100% private & secure'}].map(({i: Icon, t}, j) => (
                  <div key={j} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-card/50 border border-surface-border/50">
                    <Icon size={16} className="text-primary-400" />
                    <span className="text-xs font-medium text-text-primary">{t}</span>
                  </div>
                ))}
              </div>
            </TiltCard>
          </motion.div>
        )}
        )}

        {step === 2 && !localResult && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <form onSubmit={analysisMode === 'ai' ? handleAIAnalysis : (e) => { e.preventDefault(); handleLocalAnalysis(); }} className="space-y-6">
              
              <div className="glass-card p-5 flex items-center justify-between border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner">
                    <FileText size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-100">{file?.name}</p>
                    <p className="text-xs text-emerald-500/70 font-medium">{formatFileSize(file?.size || 0)} · {fileExt}</p>
                  </div>
                </div>
                <button type="button" onClick={() => { setFile(null); setStep(1) }} className="p-2 text-emerald-500/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="glass-card p-6 space-y-6">
                <div>
                  <label className="text-sm font-bold text-text-primary mb-3 block flex items-center gap-2">
                    <Zap size={16} className="text-primary-400" /> Choose Analysis Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TiltCard className="w-full">
                      <button type="button" onClick={() => setAnalysisMode('local')} className={`w-full p-4 rounded-xl border text-left transition-all h-full ${analysisMode === 'local' ? 'bg-primary-500/10 border-primary-500 shadow-glow' : 'bg-surface-card border-surface-border hover:border-primary-500/30'}`}>
                        <div className="flex items-center gap-2 mb-1"><Zap size={16} className={analysisMode === 'local' ? 'text-primary-400' : 'text-text-muted'} /><span className={`font-bold ${analysisMode === 'local' ? 'text-text-primary' : 'text-text-muted'}`}>Instant (Local)</span></div>
                        <p className="text-xs text-text-muted font-medium">Fast. Private. 7 dimensions.</p>
                      </button>
                    </TiltCard>
                    <TiltCard className="w-full">
                      <button type="button" onClick={() => setAnalysisMode('ai')} className={`w-full p-4 rounded-xl border text-left transition-all h-full ${analysisMode === 'ai' ? 'bg-violet-500/10 border-violet-500 shadow-glow' : 'bg-surface-card border-surface-border hover:border-violet-500/30'}`}>
                        <div className="flex items-center gap-2 mb-1"><Brain size={16} className={analysisMode === 'ai' ? 'text-violet-400' : 'text-text-muted'} /><span className={`font-bold ${analysisMode === 'ai' ? 'text-text-primary' : 'text-text-muted'}`}>AI Deep Analysis</span></div>
                        <p className="text-xs text-text-muted font-medium">Gemini AI. 15+ dimensions.</p>
                      </button>
                    </TiltCard>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Experience Level</label>
                    <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="input-field text-sm font-medium">
                      <option value="auto">Auto-detect</option>
                      <option value="fresher">Student / Fresher</option>
                      <option value="experienced">Experienced Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Target Role (Optional)</label>
                    <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="input-field text-sm font-medium">
                      {TARGET_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <Briefcase size={16} className="text-accent-400" /> Job Description
                    </label>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${jobDescription.length < 50 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {jobDescription.length} chars
                    </span>
                  </div>
                  <textarea required rows={8} placeholder="Paste the complete job description here to get an accurate keyword and skill match score..."
                    value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
                    className="input-field resize-none font-medium text-sm leading-relaxed" />
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base shadow-glow group">
                  {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Analyzing...</span> : 
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles size={18} /> {analysisMode === 'local' ? 'Run Local Analysis' : 'Run AI Deep Analysis'} 
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  }
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 2 && localResult && (
          <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-text-primary flex items-center gap-2">
                <CheckCircle2 size={24} className="text-emerald-400" /> Analysis Complete
              </h2>
              <button onClick={() => { setStep(1); setLocalResult(null); setFile(null); setJobDescription(''); }} className="btn-secondary text-xs px-4 py-2">
                New Analysis
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="glass-card p-8 text-center sticky top-24">
                  <ScoreCircle score={localResult.score} size={160} strokeWidth={12} className="mx-auto" />
                  <div className="mt-6 flex justify-center gap-2">
                    <button onClick={() => generateATSReport(localResult, file?.name || 'Resume')} className="btn-primary text-xs py-2 px-4 shadow-glow flex-1 justify-center">
                      <Download size={14} /> Save PDF
                    </button>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-text-primary mb-5 uppercase tracking-wider flex items-center gap-2"><BarChart3 size={16} className="text-primary-400" /> Dimension Breakdown</h3>
                  <div className="space-y-5">
                    {Object.entries(localResult.dimensions).map(([key, dim]) => (
                      <SectionScoreBar key={key} label={dim.label} score={dim.score} max={dim.max} color={dim.color} />
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider flex items-center gap-2"><Eye size={16} className="text-accent-400" /> Recruiter Verdict</h3>
                  <div className={`p-4 rounded-xl border ${localResult.score >= 75 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' : localResult.score >= 50 ? 'bg-amber-500/10 border-amber-500/20 text-amber-100' : 'bg-rose-500/10 border-rose-500/20 text-rose-100'}`}>
                    <p className="text-sm font-medium leading-relaxed">"{localResult.recruiterVerdict}"</p>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider flex items-center gap-2"><Target size={16} className="text-violet-400" /> Priority Actions</h3>
                  <div className="space-y-3">
                    {localResult.suggestions.slice(0, 5).map((sugg, i) => (
                      <div key={i} className={`flex gap-3 items-start p-3 rounded-xl border ${sugg.priority === 'critical' ? 'bg-rose-500/5 border-rose-500/20' : sugg.priority === 'high' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-surface-card border-surface-border'}`}>
                        <div className="w-6 h-6 rounded-lg bg-surface-hover flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CornerDownRight size={12} className={sugg.priority === 'critical' ? 'text-rose-400' : 'text-text-muted'} />
                        </div>
                        <p className="text-sm text-text-muted font-medium">{sugg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UploadPage
