import React from 'react';
import { motion } from 'framer-motion';
import { Upload, ClipboardList, BarChart3, Brain, Code, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TiltCard = ({ children, className }) => {
  const ref = React.useRef(null);
  const [rotate, setRotate] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * -20, y: x * 20 });
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

export default function HowItWorksPage() {
  const steps = [
    { step: '01', icon: Upload, title: 'Upload Your Resume', desc: 'Drop your existing PDF, DOCX, or TXT file. We extract the text instantly and securely on your device without storing it on our servers.' },
    { step: '02', icon: ClipboardList, title: 'Provide the Target Job', desc: 'Paste the full Job Description. Our engine needs the requirements, skills, and qualifications to benchmark your resume accurately against the role.' },
    { step: '03', icon: BarChart3, title: 'Get Your ATS Score', desc: 'Our algorithm performs a multi-layered analysis and returns a transparent 7-dimension score breakdown, highlighting exact keyword matches and gaps.' },
    { step: '04', icon: Brain, title: 'Apply AI Suggestions', desc: 'Review AI-powered recommendations. We provide bullet rewrites using industry-standard action verbs and suggest critical missing skills.' },
    { step: '05', icon: Code, title: 'Export to Overleaf', desc: 'Generate a perfectly formatted, 100% ATS-readable LaTeX code string. Copy it to Overleaf, compile to PDF, and apply with confidence.' }
  ];

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden pt-32 pb-24">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(0,200,150,0.05)_0%,transparent_70%)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(108,99,255,0.05)_0%,transparent_70%)] blur-[100px] pointer-events-none" />

      <div className="page-container relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-6">The Process</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-text-primary mb-6 leading-tight">
              From Upload to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-primary-500">Interview-Ready</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-muted leading-relaxed">
              No guesswork. No hidden fees. Just a clean, transparent, five-step pipeline to optimize your resume for applicant tracking systems.
            </p>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto px-4 relative">
          {/* Vertical Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#6C63FF]/30 to-transparent -translate-x-1/2" />

          <div className="space-y-12 sm:space-y-24">
            {steps.map(({ step, icon: Icon, title, desc }, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div key={step} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${isEven ? '' : 'md:flex-row-reverse'}`}
                >
                  {/* Content Side */}
                  <TiltCard className={`w-full md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} text-center group`}>
                    <div className="relative p-6 sm:p-8 rounded-3xl bg-surface-card/50 border border-surface-border hover:border-primary-500/30 transition-all duration-500">
                      <div className="text-4xl sm:text-7xl font-display font-black text-text-primary opacity-5 mb-2 md:mb-0 absolute md:relative left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 -z-10 select-none group-hover:opacity-10 transition-colors">
                        {step}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-display font-black text-text-primary mb-4 relative z-10" style={{ transform: 'translateZ(20px)' }}>{title}</h3>
                      <p className="text-text-muted text-base sm:text-lg leading-relaxed relative z-10" style={{ transform: 'translateZ(10px)' }}>{desc}</p>
                    </div>
                  </TiltCard>

                  {/* Center Node */}
                  <div className="hidden md:flex relative items-center justify-center w-24 h-24 shrink-0 z-10">
                    <div className="absolute inset-0 bg-transparent rounded-full" />
                    <motion.div 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border border-dashed border-primary-500/20 rounded-full" 
                    />
                    <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center shadow-glow-sm relative z-10">
                      <Icon size={24} className="text-primary-500" />
                    </div>
                  </div>

                  {/* Mobile Only Icon */}
                  <div className="md:hidden w-16 h-16 rounded-xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center mb-2 mx-auto">
                    <Icon size={28} className="text-primary-500" />
                  </div>

                  {/* Empty Spacer Side */}
                  <div className="hidden md:block w-full md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 text-center px-4">
           <Link to="/upload" className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-6 rounded-full font-black text-white text-lg sm:text-xl overflow-hidden transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_50px_rgba(0,200,150,0.4)] bg-[#00C896] text-dark-950">
             <span className="relative z-10 flex items-center gap-3 text-white">
               Start Analysis Now <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
             </span>
           </Link>
        </div>

      </div>
    </div>
  );
}
