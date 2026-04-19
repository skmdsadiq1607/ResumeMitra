import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  Upload, FileText, X, Loader2, Sparkles, AlertCircle,
  CheckCircle2, ChevronRight, Briefcase, Target, Brain,
  Zap, Shield, Eye
} from 'lucide-react'
import { resumeService } from '../services/resumeService'
import { extractError, formatFileSize, TARGET_ROLES } from '../utils/helpers'
import toast from 'react-hot-toast'

const tips = [
  { icon: Target, text: 'Paste the FULL job description for best results — including requirements and qualifications.' },
  { icon: Brain, text: 'The AI evaluates 15+ dimensions including keyword match, content strength, and ATS formatting.' },
  { icon: Shield, text: 'Your resume data is private and never shared with third parties.' },
]

const UploadPage = () => {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: upload, 2: details
  const navigate = useNavigate()

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      toast.error(error.code === 'file-too-large' ? 'File is too large. Max 5MB.' : 'Only PDF files are accepted.')
      return
    }
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0])
      setStep(2)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  })

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!file) return toast.error('Please upload a PDF resume.')
    if (jobDescription.trim().length < 50) return toast.error('Please enter a more detailed job description (at least 50 characters).')

    setLoading(true)
    const formData = new FormData()
    formData.append('resume', file)
    formData.append('jobDescription', jobDescription.trim())
    formData.append('jobTitle', jobTitle.trim())
    formData.append('targetRole', targetRole)

    try {
      toast.loading('AI is performing deep analysis... This may take 30-60 seconds.', { id: 'analyzing' })
      const res = await resumeService.analyze(formData)
      toast.dismiss('analyzing')
      toast.success('Deep analysis complete! 🎉')
      navigate(`/analysis/${res.data.data.report._id}`)
    } catch (err) {
      toast.dismiss('analyzing')
      toast.error(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Analyze Resume</h1>
        <p className="text-slate-400 mt-1 text-sm">Upload your PDF, paste the job description, and let AI do a deep recruiter-grade analysis.</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-3">
        {[{ n: 1, label: 'Upload Resume' }, { n: 2, label: 'Job Details' }].map(({ n, label }, idx) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step > n ? 'bg-emerald-500 text-white' : step === n ? 'bg-primary-500 text-white shadow-glow-sm' : 'bg-dark-600 text-slate-500'
            }`}>
              {step > n ? <CheckCircle2 size={14} /> : n}
            </div>
            <span className={`text-sm font-medium ${step >= n ? 'text-slate-200' : 'text-slate-600'}`}>{label}</span>
            {idx < 1 && <ChevronRight size={14} className="text-slate-600" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: File Upload */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <div
              {...getRootProps()}
              className={`glass-card p-16 text-center cursor-pointer transition-all duration-300 border-2 border-dashed group ${
                isDragActive
                  ? 'border-primary-500 bg-primary-500/5 shadow-glow'
                  : 'border-surface-border hover:border-primary-500/40 hover:bg-primary-500/[0.02]'
              }`}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={isDragActive ? { scale: 1.1, rotate: 3 } : { scale: 1, rotate: 0 }}
                className={`w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-colors ${
                  isDragActive ? 'bg-primary-500/20' : 'bg-dark-600 group-hover:bg-dark-500'
                }`}
              >
                <Upload size={32} className={isDragActive ? 'text-primary-400' : 'text-slate-400 group-hover:text-primary-400 transition-colors'} />
              </motion.div>
              <h3 className="text-xl font-display font-semibold text-white mb-2">
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
              </h3>
              <p className="text-sm text-slate-400 mb-6">or click anywhere to browse files</p>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-xs font-medium text-primary-300">
                <FileText size={13} /> PDF only · Max 5MB
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 space-y-3">
              {tips.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/50 border border-surface-border/50"
                >
                  <Icon size={15} className="text-primary-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Job Details */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <form onSubmit={handleAnalyze} className="space-y-5">
              {/* File preview */}
              <div className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <FileText size={17} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{file?.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(file?.size || 0)} · PDF</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-medium">Ready ✓</span>
                  <button
                    type="button"
                    onClick={() => { setFile(null); setStep(1) }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Two-column: Job Title + Target Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Job Title <span className="text-slate-600 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. Frontend Developer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Target Role
                  </label>
                  <div className="relative">
                    <Target size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="input-field pl-10 appearance-none cursor-pointer"
                    >
                      {TARGET_ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                    <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 rotate-90 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 flex items-center justify-between">
                  Job Description
                  <span className={`text-xs font-mono ${jobDescription.length < 50 ? 'text-slate-600' : 'text-emerald-400'}`}>
                    {jobDescription.length} chars
                  </span>
                </label>
                <textarea
                  required
                  rows={12}
                  placeholder={"Paste the FULL job description here...\n\nInclude:\n• Required skills & qualifications\n• Responsibilities\n• Nice-to-haves\n\nThe more detail you provide, the better the AI analysis."}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="input-field resize-none"
                />
                {jobDescription.length > 0 && jobDescription.length < 50 && (
                  <p className="text-xs text-amber-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={11} /> Minimum 50 characters required for meaningful analysis.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-none">
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || jobDescription.trim().length < 50}
                  className="btn-primary flex-1 justify-center py-3.5 text-base disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles size={18} /> Run Deep AI Analysis</>
                  )}
                </button>
              </div>

              {/* Loading state */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card gradient-border p-5 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center animate-pulse">
                      <Brain size={16} className="text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">AI Analysis in Progress</p>
                      <p className="text-xs text-slate-500">Evaluating 15+ dimensions across your resume...</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {['Extracting keywords & skills', 'Comparing with job description', 'Scoring ATS compatibility', 'Generating recruiter-grade insights'].map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
                        {t}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UploadPage
