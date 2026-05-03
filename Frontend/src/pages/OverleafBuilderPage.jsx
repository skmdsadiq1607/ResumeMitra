import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileCode2, Copy, Download, Loader2, ArrowLeft, Check, Terminal, ExternalLink, Lightbulb } from 'lucide-react'
import { resumeService } from '../services/resumeService'
import toast from 'react-hot-toast'

const demoLatex = `\\documentclass[a4paper,10pt]{article}
\\usepackage[margin=0.65in]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{xcolor}

\\pagenumbering{gobble}
\\setlength{\\parindent}{0pt}
\\setlist[itemize]{noitemsep, topsep=2pt}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]

\\begin{document}

\\begin{center}
    {\\Huge \\textbf{ALEX JOHNSON}}\\\\
    \\vspace{3pt}
    Email: \\href{mailto:alex@example.com}{alex@example.com} $|$
    Phone: +1 555-019-2039 $|$
    LinkedIn: \\href{https://linkedin.com/in/alex}{LinkedIn} $|$
    GitHub: \\href{https://github.com/alex}{GitHub}
\\end{center}

\\section*{Professional Summary}
Detail-oriented Frontend Developer with 3+ years of experience in React and modern JavaScript. Proven track record of engineering scalable web applications, optimizing performance, and increasing user retention through intuitive UI/UX design.

\\section*{Technical Skills}
\\textbf{Languages:} JavaScript (ES6+), HTML5, CSS3, TypeScript\\\\
\\textbf{Frameworks & Libraries:} React.js, Next.js, Redux, Tailwind CSS\\\\
\\textbf{Tools:} Git, GitHub, Webpack, Jest, CI/CD

\\section*{Experience}
\\textbf{Frontend Developer} \\hfill 2021 -- Present\\\\
Tech Solutions Inc. \\hfill San Francisco, CA
\\begin{itemize}
    \\item Developed a high-converting checkout flow using React and Stripe API, resulting in a 12\\% increase in successful transactions.
    \\item Resolved 50+ critical UI bugs and modernized legacy components using React hooks, improving overall app stability.
    \\item Optimized website performance, increasing Lighthouse score by 35\\% and reducing bounce rate by 15\\%.
\\end{itemize}

\\section*{Education}
\\textbf{B.S. in Computer Science} \\hfill 2021\\\\
University of Technology \\hfill GPA: 3.8/4.0

\\end{document}
`

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) }

const OverleafBuilderPage = () => {
  const params = useParams()
  const id = params.id || (window.location.pathname.endsWith('/demo') ? 'demo' : undefined)
  const [loading, setLoading] = useState(true)
  const [latexCode, setLatexCode] = useState('')
  const [insights, setInsights] = useState({ improvements: [], notes: [], missing: [] })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchLatex = async () => {
      setLoading(true)
      try {
        if (id === 'demo') {
          setTimeout(() => {
            setLatexCode(demoLatex)
            setInsights({
              improvements: ['Added Stripe API metric to checkout bullet', 'Rewrote bug fix bullet to show impact'],
              notes: ['Ensure you update the LinkedIn and GitHub URLs before submitting.'],
              missing: ['% TODO: Add missing TypeScript project experience']
            })
            setLoading(false)
          }, 1500)
          return
        }

        const res = await resumeService.generateLatex(id)
        const data = res.data.data
        setLatexCode(data.latexCode || '')
        setInsights({
          improvements: data.improvementsMade || [],
          notes: data.atsFriendlyNotes || [],
          missing: data.missingDataPlaceholders || []
        })
      } catch {
        toast.error('Failed to generate LaTeX resume. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchLatex()
  }, [id])

  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode)
    setCopied(true)
    toast.success('LaTeX code copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([latexCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.tex'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link to={`/analysis/${id}`} className="btn-ghost text-sm mb-2 -ml-2"><ArrowLeft size={14} /> Back to Analysis</Link>
          <h1 className="text-3xl font-display font-extrabold text-white flex items-center gap-3">
            <FileCode2 size={28} className="text-primary-400" /> Overleaf Resume Builder
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Auto-generated, ATS-optimized LaTeX resume based on your AI analysis.</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="glass-card p-24 text-center border-dashed border-2 border-primary-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/10 to-transparent w-[200%] animate-shimmer" />
          <Loader2 size={48} className="text-primary-400 animate-spin mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">Generating ATS-Friendly LaTeX</h3>
          <p className="text-slate-400">Our AI is rewriting your bullet points and formatting them perfectly for Overleaf...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="lg:col-span-2 space-y-6">
            <div className="glass-card overflow-hidden flex flex-col h-[700px]">
              <div className="bg-dark-800 border-b border-surface-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-slate-400" />
                  <span className="text-sm font-mono font-bold text-slate-300">main.tex</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />} 
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={handleDownload} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-glow">
                    <Download size={14} /> Download .tex
                  </button>
                </div>
              </div>
              <textarea 
                value={latexCode}
                onChange={(e) => setLatexCode(e.target.value)}
                className="flex-1 w-full bg-dark-900 text-emerald-300 font-mono text-sm p-6 resize-none focus:outline-none focus:ring-0 selection:bg-primary-500/30"
                spellCheck="false"
              />
            </div>
          </motion.div>

          {/* Sidebar Info */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="space-y-6">
            
            {/* Overleaf Instructions */}
            <div className="glass-card p-6 gradient-border relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <ExternalLink size={18} className="text-emerald-400" /> How to use in Overleaf
              </h3>
              <div className="space-y-3 relative z-10">
                {[
                  'Review the generated LaTeX code.',
                  'Click "Open in Overleaf" below.',
                  'A new project will automatically be created.',
                  'Review and tweak any TODO items in the code.',
                  'Click "Recompile" in Overleaf to generate your PDF.'
                ].map((step, i) => (
                  <div key={i} className="flex gap-3 text-sm text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</span>
                    <p className="leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              <form action="https://www.overleaf.com/docs" method="post" target="_blank" className="mt-5">
                <input type="hidden" name="snip" value={latexCode} />
                <button type="submit" className="btn-secondary w-full justify-center py-2 text-xs border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/10 flex items-center gap-2">
                  Open in Overleaf <ExternalLink size={12} />
                </button>
              </form>
            </div>

            {/* AI Insights */}
            <div className="glass-card p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb size={18} className="text-primary-400" /> AI Generator Insights
              </h3>
              
              {insights.improvements?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-primary-300 uppercase tracking-wider mb-2">Improvements Made</p>
                  <ul className="space-y-1.5 list-disc list-inside text-sm text-slate-400">
                    {insights.improvements.map((imp, i) => <li key={i} className="leading-relaxed">{imp}</li>)}
                  </ul>
                </div>
              )}

              {insights.missing?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-2">Missing Data</p>
                  <ul className="space-y-1.5 list-disc list-inside text-sm text-slate-400">
                    {insights.missing.map((imp, i) => <li key={i} className="leading-relaxed">{imp}</li>)}
                  </ul>
                  <p className="text-[10px] text-slate-500 mt-2 italic">Look for % TODO comments in the LaTeX code to fill these in.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default OverleafBuilderPage
