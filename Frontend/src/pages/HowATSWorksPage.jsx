import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Search, Code, Briefcase, FileText, Layout, TrendingUp, BookOpen,
  CheckCircle2, AlertTriangle, Zap, ArrowRight, Shield, Brain,
  Target, Award, Eye, Sparkles
} from 'lucide-react'

const TiltCard = ({ children, className }) => {
  const ref = React.useRef(null);
  const [rotate, setRotate] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * -15, y: x * 15 });
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } })
}

const dimensions = [
  { icon: Search, title: 'Keyword Match', points: '25 pts', desc: 'Exact, semantic, and acronym matching of JD keywords against your resume. Penalizes keyword stuffing.', color: 'from-primary-500 to-violet-500' },
  { icon: Code, title: 'Skills Match', points: '20 pts', desc: 'Programming languages, frameworks, databases, cloud tools, soft skills, and certifications compared with JD requirements.', color: 'from-accent-500 to-teal-500' },
  { icon: Briefcase, title: 'Experience Relevance', points: '15 pts', desc: 'Role alignment, responsibility overlap, project relevance, tools used in context, and seniority match.', color: 'from-violet-500 to-purple-500' },
  { icon: FileText, title: 'Structure & Sections', points: '15 pts', desc: 'Checks for Contact, Summary, Education, Skills, Experience, Projects, Certifications, Achievements, and Links.', color: 'from-emerald-500 to-green-500' },
  { icon: Layout, title: 'ATS Formatting', points: '10 pts', desc: 'Single-column layout, standard headings, proper bullet points, date formatting, and file compatibility.', color: 'from-amber-500 to-orange-500' },
  { icon: TrendingUp, title: 'Impact & Achievements', points: '10 pts', desc: 'Action verbs, quantified metrics, STAR method, ownership language, and technical depth.', color: 'from-rose-500 to-red-500' },
  { icon: BookOpen, title: 'Grammar & Tone', points: '5 pts', desc: 'Grammar, spelling, professional tone, consistency, sentence clarity, and avoiding first-person pronouns.', color: 'from-blue-500 to-indigo-500' },
]

const grades = [
  { range: '90–100', label: 'Excellent ATS Match', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { range: '75–89', label: 'Strong Match', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
  { range: '60–74', label: 'Moderate Match', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { range: '40–59', label: 'Needs Improvement', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { range: 'Below 40', label: 'Poor Match', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
]

const faqs = [
  { q: 'What is an ATS?', a: 'An Applicant Tracking System (ATS) is software used by companies to filter, scan, and rank resumes before a human recruiter sees them. Over 90% of Fortune 500 companies use ATS systems.' },
  { q: 'Why do resumes get rejected by ATS?', a: 'Common reasons include: missing keywords from the job description, non-standard formatting (tables, images, text boxes), missing sections, and using file formats the ATS cannot parse.' },
  { q: 'Does a high ATS score guarantee a job?', a: 'No. ATS score measures how well your resume matches the job description and follows ATS-friendly formatting. A human recruiter still makes the final decision based on quality, relevance, and fit.' },
  { q: 'How is the score different from job match?', a: 'ATS Score = resume quality + parseability + keyword match. Job Match = how closely your experience aligns with the specific job requirements. Both matter.' },
  { q: 'Should I stuff keywords to get a higher score?', a: 'Absolutely not. Keyword stuffing is penalized by our engine and is also flagged by real ATS systems. Use keywords naturally within meaningful context.' },
  { q: 'How can I improve my ATS score ethically?', a: 'Use keywords from the JD naturally in your experience and skills sections. Add measurable achievements. Use standard section headings. Keep formatting simple. Tailor each resume to each job.' },
]

const HowATSWorksPage = () => {
  return (
    <div className="pt-20 pb-16">
      <div className="page-container">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span className="section-badge" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Transparency</motion.span>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="mt-4 text-4xl sm:text-5xl font-display font-extrabold text-text-primary leading-tight">
            How Our <span className="gradient-text">ATS Score</span> Works
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="mt-4 text-lg text-text-muted leading-relaxed">
            Every point in your ATS score is traceable and explainable. No random numbers, no black boxes.
            Here's exactly how we calculate your score out of 100.
          </motion.p>
        </div>

        {/* Total = 100 */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="glass-card gradient-border p-8 text-center mb-12">
          <div className="text-6xl font-display font-black gradient-text mb-2">100</div>
          <p className="text-text-primary font-medium">Total Points Across 7 Scoring Dimensions</p>
          <p className="text-sm text-slate-500 mt-2">Final Score = A + B + C + D + E + F + G</p>
        </motion.div>

        {/* Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {dimensions.map(({ icon: Icon, title, points, desc, color }, i) => (
            <TiltCard key={title}>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5}
                className="glass-card p-6 group h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full">{points}</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2" style={{ transform: 'translateZ(20px)' }}>{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed" style={{ transform: 'translateZ(10px)' }}>{desc}</p>
              </motion.div>
            </TiltCard>
          ))}
        </div>

        {/* Grade Scale */}
        <div className="mb-16">
          <h2 className="text-2xl font-display font-bold text-white text-center mb-8">Score Grades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {grades.map(({ range, label, color, bg }) => (
              <div key={range} className={`p-4 rounded-xl border text-center ${bg}`}>
                <div className={`text-xl font-bold font-display ${color}`}>{range}</div>
                <div className="text-xs text-slate-300 mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-display font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.3}
                className="glass-card p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-2">{q}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{a}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ethical Warning */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="glass-card p-6 border-l-4 border-l-amber-500">
            <h3 className="text-base font-bold text-amber-300 mb-3 flex items-center gap-2"><Shield size={16} /> Ethical Guidelines</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><AlertTriangle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" /> Do not keyword-stuff your resume.</li>
              <li className="flex items-start gap-2"><AlertTriangle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" /> Do not fake skills or experience.</li>
              <li className="flex items-start gap-2"><AlertTriangle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" /> Do not copy the job description blindly into your resume.</li>
              <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" /> Keep your resume truthful and authentic.</li>
              <li className="flex items-start gap-2"><CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" /> ATS optimization should improve clarity, not manipulate hiring.</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/register" className="btn-primary px-10 py-4 text-base shadow-glow">
            <Sparkles size={18} /> Try Free ATS Analysis <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HowATSWorksPage
