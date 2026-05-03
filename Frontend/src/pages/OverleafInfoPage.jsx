import React from 'react';
import { motion } from 'framer-motion';
import { FileCode2, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function OverleafInfoPage() {
  const exampleCode = `\\documentclass[a4paper,10pt]{article}
\\usepackage[margin=0.65in]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}

\\begin{document}

\\begin{center}
    {\\Huge \\textbf{YOUR NAME}}\\\\
    \\vspace{3pt}
    Email: user@example.com $|$ Phone: +1 555-000-0000
\\end{center}

\\section*{Professional Summary}
Detail-oriented professional with experience in building scalable solutions.

\\section*{Experience}
\\textbf{Software Engineer} \\hfill 2021 -- Present\\\\
Tech Corp \\hfill New York, NY
\\begin{itemize}
    \\item Developed high-impact features resulting in 20\\% increase in retention.
\\end{itemize}

\\end{document}`;

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden pt-32 pb-24">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)] blur-[100px] pointer-events-none" />

      <div className="page-container relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
              <FileCode2 size={14} /> LaTeX Resume Generation
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white mb-6 leading-tight">
              What is the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Overleaf Builder?</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#AAB2D5] leading-relaxed">
              When you analyze a resume, our AI doesn't just give you suggestions. It completely rewrites and formats your resume into ATS-perfect LaTeX code.
            </p>
          </motion.div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto px-4">
          
          {/* Explanation */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white">Why use LaTeX?</h2>
              <p className="text-[#AAB2D5] text-lg leading-relaxed">
                Most resume builders use messy HTML/CSS to generate PDFs. These PDFs often contain hidden layers and unreadable text that break Applicant Tracking Systems (ATS).
              </p>
              <p className="text-[#AAB2D5] text-lg leading-relaxed">
                LaTeX generates purely structural, clean PDFs that ATS parsers can read with 100% accuracy. Overleaf is the world's most popular online LaTeX editor, making it incredibly easy to compile this code into a beautiful PDF.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">How our builder works:</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-[#AAB2D5]">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                  <span>Upload your existing resume and target job.</span>
                </li>
                <li className="flex gap-3 text-[#AAB2D5]">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                  <span>AI rewrites your bullet points to match the job.</span>
                </li>
                <li className="flex gap-3 text-[#AAB2D5]">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                  <span>We generate the raw LaTeX code automatically.</span>
                </li>
                <li className="flex gap-3 text-[#AAB2D5]">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                  <span>You click one button to open it in Overleaf and download your PDF.</span>
                </li>
              </ul>
            </div>

            <a 
              href="https://www.overleaf.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] bg-emerald-500 text-dark-950 w-fit"
            >
              <span className="relative z-10 flex items-center gap-2 text-white">
                Visit Overleaf.com <ExternalLink size={20} />
              </span>
            </a>
          </div>

          {/* Code Example */}
          <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[rgba(255,255,255,0.1)] bg-[#080A1A]/80 backdrop-blur-xl h-fit">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileCode2 size={20} className="text-emerald-400" /> Basic Example Code
            </h3>
            <div className="bg-[#050510] rounded-xl p-4 sm:p-6 overflow-x-auto border border-white/5">
              <pre className="text-sm font-mono text-emerald-300 leading-relaxed">
                <code>{exampleCode}</code>
              </pre>
            </div>
            <p className="text-sm text-slate-400 mt-4 text-center">
              Our AI generates highly complex, multi-section templates based on your exact profile.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
