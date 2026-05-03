import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BarChart3, Code, Target, Brain, Shield, Lock, FileText, Zap } from 'lucide-react';

const TiltCard = ({ children, className, id }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className={`relative perspective-1000 ${className || ''}`} id={id}>
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100 rounded-3xl" style={{ transform: 'translateZ(-10px)' }} />
      {children}
    </motion.div>
  );
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden pt-32 pb-24">
      <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)] blur-[100px] pointer-events-none" />
      
      <div className="page-container relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-24 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-accent-500/10 text-accent-500 border border-accent-500/20 mb-6">Enterprise Features</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-text-primary mb-6 leading-tight">
              Everything You Need to Build a <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-primary-500">Job-Ready Resume</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-muted leading-relaxed">
              A multi-layered AI architecture designed to dissect, analyze, and rebuild your resume for absolute ATS dominance. No fluff, just technical precision.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-auto md:auto-rows-[320px] gap-6 sm:gap-8 max-w-7xl mx-auto px-4">
          
          <TiltCard className="md:col-span-2">
            <div className="w-full h-full min-h-[280px] md:min-h-0 rounded-3xl bg-surface-card border border-surface-border p-8 sm:p-10 flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-primary-500/30 transition-colors duration-700" />
              <div className="relative z-10">
                 <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6">
                   <BarChart3 size={32} className="text-primary-400" />
                 </div>
                 <h3 className="text-2xl sm:text-3xl font-black text-text-primary mb-4">7-Dimension Deterministic Scoring</h3>
                 <p className="text-base sm:text-lg text-text-muted max-w-md">No random numbers. We calculate exact percentages across Keywords, Skills, Impact, Format, Grammar, Education, and Experience.</p>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="md:col-span-1">
            <div className="w-full h-full min-h-[240px] md:min-h-0 rounded-3xl bg-surface-card border border-surface-border p-8 sm:p-10 flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                 <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                   <Code size={32} className="text-emerald-400" />
                 </div>
                 <h3 className="text-xl sm:text-2xl font-black text-text-primary mb-4">Overleaf LaTeX Export</h3>
                 <p className="text-sm sm:text-base text-text-muted">Instant compilation to perfectly formatted, ATS-safe LaTeX code.</p>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="md:col-span-1">
            <div className="w-full h-full min-h-[240px] md:min-h-0 rounded-3xl bg-surface-card border border-surface-border p-8 sm:p-10 flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                 <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
                   <Target size={32} className="text-rose-400" />
                 </div>
                 <h3 className="text-xl sm:text-2xl font-black text-text-primary mb-4">Keyword Gap Engine</h3>
                 <p className="text-sm sm:text-base text-text-muted">Cross-references the JD to highlight missing mandatory skills.</p>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="md:col-span-2">
            <div className="w-full h-full min-h-[280px] md:min-h-0 rounded-3xl bg-surface-card border border-surface-border p-8 sm:p-10 flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 group-hover:bg-fuchsia-500/30 transition-colors duration-700" />
              <div className="relative z-10">
                 <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mb-6">
                   <Brain size={32} className="text-fuchsia-400" />
                 </div>
                 <h3 className="text-2xl sm:text-3xl font-black text-text-primary mb-4">Gemini AI Bullet Rewriter</h3>
                 <p className="text-base sm:text-lg text-text-muted max-w-lg">Our specialized Gemini prompt acts as a Senior Tech Recruiter, hunting down passive verbs and rewriting them into high-impact, metric-driven achievements.</p>
              </div>
            </div>
          </TiltCard>

        </div>
        
        {/* Additional Features Grid */}
        <div className="mt-24 max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TiltCard>
              <div className="p-8 rounded-2xl border border-surface-border bg-surface-card h-full">
                 <Shield className="text-emerald-500 mb-4" size={28}/>
                 <h4 className="text-text-primary font-bold text-xl mb-2">Privacy First</h4>
                 <p className="text-text-muted text-sm leading-relaxed">We don't store your resume data to train models. Analysis is done on-the-fly and deleted.</p>
              </div>
            </TiltCard>
            <TiltCard>
              <div className="p-8 rounded-2xl border border-surface-border bg-surface-card h-full">
                 <Zap className="text-accent-500 mb-4" size={28}/>
                 <h4 className="text-text-primary font-bold text-xl mb-2">Lightning Fast</h4>
                 <p className="text-text-muted text-sm leading-relaxed">Full ATS scan, keyword matching, and AI suggestions generated in under 3 seconds.</p>
              </div>
            </TiltCard>
            <TiltCard>
              <div className="p-8 rounded-2xl border border-surface-border bg-surface-card h-full">
                 <FileText className="text-primary-500 mb-4" size={28}/>
                 <h4 className="text-text-primary font-bold text-xl mb-2">Multiple Formats</h4>
                 <p className="text-text-muted text-sm leading-relaxed">Upload PDF, DOCX, or paste raw text. Our parsers handle all standard resume formats.</p>
              </div>
            </TiltCard>
        </div>

      </div>
    </div>
  );
}
