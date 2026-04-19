import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, Upload, BarChart3, Search, Sparkles, ChevronRight,
  CheckCircle2, ArrowRight, Brain, Target, TrendingUp, Shield,
  Star, FileText, Eye, Code, Briefcase, Lightbulb, BookOpen,
  Rocket, Award, MessageSquare
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } })
}

const features = [
  { icon: Brain, title: '15+ AI Dimensions', desc: 'Evaluates keyword match, content strength, skills alignment, project relevance, readability, and 10 more dimensions.', color: 'from-primary-500 to-violet-500' },
  { icon: Target, title: 'Explainable ATS Score', desc: 'Transparent scoring that tells you exactly WHY you got your score — no black boxes.', color: 'from-accent-500 to-teal-500' },
  { icon: Search, title: 'Deep Keyword Analysis', desc: 'Matched vs missing keywords from the JD, plus missing tools and technologies highlighted.', color: 'from-violet-500 to-purple-500' },
  { icon: MessageSquare, title: 'Recruiter Verdict', desc: 'Get a recruiter-style assessment — would a hiring manager shortlist your resume?', color: 'from-amber-500 to-orange-500' },
  { icon: Lightbulb, title: 'Priority Suggestions', desc: 'Categorized improvements: Critical fixes → High impact → ATS optimization → Polish.', color: 'from-emerald-500 to-teal-500' },
  { icon: BookOpen, title: 'Learning Roadmap', desc: 'Personalized skill gap analysis with prioritized learning recommendations.', color: 'from-rose-500 to-pink-500' },
]

const steps = [
  { n: '01', title: 'Upload Resume', desc: 'Drag & drop your PDF resume securely.', icon: Upload },
  { n: '02', title: 'Paste Job Description', desc: 'Add the full JD and select target role.', icon: FileText },
  { n: '03', title: 'AI Deep Analysis', desc: '15+ dimensions evaluated in 30 seconds.', icon: Brain },
  { n: '04', title: 'Get Actionable Results', desc: 'Score, fixes, rewrites, and roadmap.', icon: Rocket },
]

const analysisPreview = [
  { label: 'Keyword Match', score: 74, color: 'bg-amber-500' },
  { label: 'Skills Alignment', score: 85, color: 'bg-emerald-500' },
  { label: 'Content Strength', score: 62, color: 'bg-orange-500' },
  { label: 'ATS Formatting', score: 91, color: 'bg-primary-500' },
  { label: 'Experience Impact', score: 68, color: 'bg-violet-500' },
  { label: 'Readability', score: 88, color: 'bg-teal-500' },
]

const stats = [
  { value: '15+', label: 'Analysis Dimensions' },
  { value: '< 30s', label: 'Analysis Time' },
  { value: '50+', label: 'Keywords Checked' },
  { value: '100%', label: 'AI Powered' },
]

const testimonials = [
  { name: 'Priya S.', role: 'CS Student, IIT Delhi', text: 'My ATS score went from 42 to 81 after following the AI suggestions. Got 3 interview calls in a week!', score: '+39 pts' },
  { name: 'Rahul M.', role: 'Full-Stack Dev', text: 'The recruiter verdict feature is gold. It showed me exactly why my resume was getting rejected.', score: 'Hired!' },
  { name: 'Sara K.', role: 'Data Analyst', text: 'The weak phrase detection caught things I never noticed. The rewritten bullets sound so much more professional.', score: '+28 pts' },
]

const LandingPage = () => {
  return (
    <div className="pt-16">
      {/* ═══ Hero ═══ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="glow-orb w-[700px] h-[700px] bg-primary-500 top-[-200px] left-[50%] -translate-x-1/2" />
        <div className="glow-orb w-[400px] h-[400px] bg-accent-500 bottom-[-100px] right-[-100px]" style={{ opacity: 0.08 }} />
        <div className="glow-orb w-[300px] h-[300px] bg-violet-500 top-[40%] left-[-100px]" style={{ opacity: 0.06 }} />

        <div className="page-container relative z-10 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300 text-xs font-semibold mb-6">
              <Sparkles size={12} />
              Powered by Google Gemini AI — 15+ Analysis Dimensions
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>

            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.1] text-balance">
              Your Resume,{' '}
              <span className="gradient-text">Decoded by AI</span>
              {' '}for ATS Success
            </motion.h1>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Upload your resume. Paste the job description. Get an instant deep analysis with ATS score,
              keyword gaps, recruiter verdict, and AI-rewritten bullet points — in under 30 seconds.
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary px-8 py-4 text-base shadow-glow">
                <Zap size={18} />
                Analyze My Resume Free
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-4 text-base">Sign In</Link>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              {['No credit card required', 'Free to start', '30-second results', 'Recruiter-grade AI'].map((t) => (
                <div key={t} className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-500" />{t}</div>
              ))}
            </motion.div>
          </div>

          {/* Hero mock dashboard */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }} className="mt-16 max-w-3xl mx-auto">
            <div className="glass-card p-6 gradient-border">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-primary-400" />
                  <span className="text-sm font-medium text-slate-300">john_doe_resume.pdf</span>
                  <span className="section-badge text-[10px]">Full-Stack Developer</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 size={11} /> Analysis Complete
                </span>
              </div>

              <div className="grid grid-cols-5 gap-3 mb-5">
                <div className="col-span-2 bg-dark-700/80 rounded-xl p-5 flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg width="64" height="64" className="rotate-[-90deg]">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#1d1d35" strokeWidth="5" />
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 28}`} strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.76)}`} style={{ filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.4))' }} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white font-display">76</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">ATS Score</div>
                    <div className="text-xs text-amber-400 font-medium">Good — Room to improve</div>
                  </div>
                </div>
                {[
                  { v: 28, l: 'Keywords Matched', c: 'text-emerald-400' },
                  { v: 7, l: 'Missing Keywords', c: 'text-rose-400' },
                  { v: 5, l: 'Quick Fixes', c: 'text-amber-400' },
                ].map(({ v, l, c }) => (
                  <div key={l} className="bg-dark-700/80 rounded-xl p-4 text-center flex flex-col justify-center">
                    <div className={`text-xl font-bold font-display ${c}`}>{v}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{l}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {analysisPreview.map(({ label, score, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-slate-400 mb-1"><span>{label}</span><span>{score}%</span></div>
                    <div className="h-1.5 bg-dark-600 rounded-full"><div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Stats ═══ */}
      <section className="border-y border-surface-border bg-dark-900/50">
        <div className="page-container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }, i) => (
              <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-display font-extrabold gradient-text">{value}</div>
                <div className="text-sm text-slate-400 mt-1 font-medium">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Features ═══ */}
      <section id="features" className="py-24 relative">
        <div className="glow-orb w-[500px] h-[500px] bg-accent-500 top-1/2 right-[-200px]" style={{ opacity: 0.04 }} />
        <div className="page-container relative z-10">
          <div className="text-center mb-16">
            <motion.span className="section-badge" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>Features</motion.span>
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-4 text-4xl font-display font-bold text-white">
              Not just keywords — full recruiter-grade analysis
            </motion.h2>
            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="mt-3 text-slate-400 max-w-xl mx-auto">
              Our AI goes far beyond simple keyword counting. It evaluates your resume like a senior recruiter would.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5} className="glass-card p-6 group">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-base">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section id="how-it-works" className="py-24 border-t border-surface-border">
        <div className="page-container">
          <div className="text-center mb-16">
            <span className="section-badge">How It Works</span>
            <h2 className="mt-4 text-4xl font-display font-bold text-white">4 steps to a better resume</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
            {steps.map(({ n, title, desc, icon: Icon }, i) => (
              <motion.div key={n} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.8} className="flex flex-col items-center text-center relative group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center mb-4 relative z-10 group-hover:scale-105 transition-transform duration-300">
                  <Icon size={22} className="text-primary-400" />
                </div>
                <span className="text-xs font-bold text-primary-400 mb-1">{n}</span>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Testimonials ═══ */}
      <section className="py-24 border-t border-surface-border relative">
        <div className="glow-orb w-[400px] h-[400px] bg-violet-500 top-0 left-[20%]" style={{ opacity: 0.04 }} />
        <div className="page-container relative z-10">
          <div className="text-center mb-16">
            <span className="section-badge">Success Stories</span>
            <h2 className="mt-4 text-4xl font-display font-bold text-white">Students who leveled up their resumes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, score }, i) => (
              <motion.div key={name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{name}</p>
                      <p className="text-[10px] text-slate-500">{role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">{score}</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed italic">"{text}"</p>
                <div className="flex gap-1 mt-3">
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} className="text-amber-400 fill-amber-400" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24">
        <div className="page-container">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card gradient-border p-12 sm:p-16 text-center relative overflow-hidden">
            <div className="glow-orb w-[400px] h-[300px] bg-primary-500 top-[-100px] left-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <Sparkles className="mx-auto text-primary-400 mb-4" size={36} />
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 text-balance">
                Stop guessing. Start optimizing.
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto text-lg">
                Join thousands of job seekers who transformed their resumes with AI and landed more interviews.
              </p>
              <Link to="/register" className="btn-primary px-10 py-4 text-base mx-auto shadow-glow">
                <Zap size={18} /> Start Free Analysis <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
