import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
  Zap, ArrowRight, Brain, Target, BarChart3, 
  Sparkles, Eye, Code, FileText, CheckCircle2, ChevronRight, Terminal, Network,
  Upload, ClipboardList, TrendingUp, Mail, MapPin, MessageSquare, Send,
  Briefcase, Shield, Lock
} from 'lucide-react';

// ==========================================
// 1 IN A MILLION DEVELOPER UI: 3D SAAS HERO
// ==========================================

// --- Utility: Mouse Position Hook ---
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mousePosition;
};

// --- Advanced 3D Tilt Card ---
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
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative perspective-1000 ${className || ''}`}
      id={id}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100 rounded-3xl" style={{ transform: 'translateZ(-10px)' }} />
      {children}
    </motion.div>
  );
};

// --- Animated Particles Background ---
const ParticleField = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const generated = [...Array(40)].map((_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
      opacity: Math.random() * 0.5 + 0.1,
      scale: Math.random() * 2 + 0.5,
      duration: Math.random() * 10 + 10,
      width: Math.random() * 3 + 1 + 'px',
      height: Math.random() * 3 + 1 + 'px',
      drift: Math.random() * -500
    }));
    setParticles(generated);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary-400"
          initial={{
            x: p.x,
            y: p.y,
            opacity: p.opacity,
            scale: p.scale,
          }}
          animate={{
            y: [null, p.drift],
            opacity: [null, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: p.width,
            height: p.height,
            boxShadow: '0 0 10px 2px rgba(99, 102, 241, 0.4)'
          }}
        />
      ))}
    </div>
  );
};

// Only render particles on larger screens to avoid perf issues on mobile
const ParticleFieldResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  if (isMobile) return null;
  return <ParticleField />;
};

const IsometricMockup = ({ mousePosition }) => {
  const { x, y } = mousePosition;
  
  // Create subtle parallax based on mouse
  const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const winHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  
  const mouseX = x / winWidth - 0.5; // -0.5 to 0.5
  const mouseY = y / winHeight - 0.5;

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[600px] flex items-center justify-center perspective-[2000px] mt-10 sm:mt-20 overflow-hidden">
      
      {/* 3D Container */}
      <motion.div 
        animate={{ 
          rotateX: 60 + mouseY * 10, 
          rotateZ: -35 + mouseX * 15,
          y: [0, -10, 0] // Pure floating animation
        }}
        transition={{ 
          rotateX: { type: "spring", stiffness: 50, damping: 20 },
          rotateZ: { type: "spring", stiffness: 50, damping: 20 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-[320px] h-[420px] sm:w-[450px] sm:h-[600px] lg:w-[600px] lg:h-[800px]"
      >
        {/* Layer 1: Base Dashboard */}
        <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-2xl border border-surface-border rounded-3xl shadow-[0_50px_100px_-20px_rgba(99,102,241,0.3)] overflow-hidden" style={{ transform: 'translateZ(0px)' }}>
          <div className="h-12 border-b border-surface-border/5 flex items-center px-6 gap-2 bg-dark-900/50">
            <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-500/80"/><div className="w-3 h-3 rounded-full bg-amber-500/80"/><div className="w-3 h-3 rounded-full bg-emerald-500/80"/></div>
          </div>
          <div className="p-8 grid grid-cols-2 gap-6 h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
             <div className="space-y-4">
               <div className="w-full h-32 bg-surface-card rounded-2xl border border-surface-border" />
               <div className="w-full h-48 bg-surface-card rounded-2xl border border-surface-border" />
             </div>
             <div className="space-y-4">
               <div className="w-full h-64 bg-surface-card rounded-2xl border border-surface-border" />
             </div>
          </div>
        </div>

        {/* Layer 2: Floating ATS Score Ring */}
        <motion.div 
          animate={{ z: 80, y: mouseY * -20, x: mouseX * -20 }}
          className="absolute top-20 left-2 sm:left-10 w-28 sm:w-40 lg:w-48 h-28 sm:h-40 lg:h-48 bg-dark-900/90 backdrop-blur-xl border border-primary-500/30 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-3 sm:p-6 flex flex-col items-center justify-center group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <svg className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-dark-700" />
            <motion.circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * 0.92) }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
              className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl sm:text-2xl lg:text-3xl font-black text-white">92</span>
            <span className="text-[6px] sm:text-[8px] uppercase tracking-widest text-emerald-400 font-bold mt-1">ATS Score</span>
          </div>
        </motion.div>

        {/* Layer 3: Floating AI Rewrite Card */}
        <motion.div 
          animate={{ z: 120, y: mouseY * -40, x: mouseX * -40 }}
          className="absolute top-28 sm:top-40 right-[-10px] sm:right-[-40px] w-48 sm:w-60 lg:w-72 bg-dark-800/95 backdrop-blur-2xl border border-violet-500/30 rounded-2xl shadow-[0_40px_80px_-20px_rgba(139,92,246,0.3)] overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={14} className="text-violet-400" />
              <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">AI Rewrite Suggestion</span>
            </div>
            <p className="text-xs text-rose-300/70 line-through mb-2">"Responsible for UI components."</p>
            <p className="text-sm text-emerald-300 font-mono leading-relaxed bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
              ▸ Engineered 15+ reusable React components, reducing rendering time by 40%.
            </p>
          </div>
        </motion.div>

        {/* Layer 4: Floating LaTeX Export Code */}
        <motion.div 
          animate={{ z: 160, y: mouseY * -60 + 200, x: mouseX * -60 - 50 }}
          className="absolute top-56 sm:top-80 left-[-20px] sm:left-[-60px] w-52 sm:w-64 lg:w-80 bg-[#0d1117]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_50px_100px_-20px_rgba(6,182,212,0.2)] p-3 sm:p-4 font-mono text-[8px] sm:text-[10px] hidden sm:block"
        >
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <span className="text-cyan-400 font-bold flex items-center gap-2"><Terminal size={12}/> main.tex</span>
            <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-[8px] uppercase">Overleaf Ready</span>
          </div>
          <div className="text-slate-300 space-y-1 opacity-80">
            <p><span className="text-pink-400">\documentclass</span>[a4paper]&#123;article&#125;</p>
            <p><span className="text-pink-400">\usepackage</span>&#123;geometry&#125;</p>
            <br/>
            <p><span className="text-pink-400">\begin</span>&#123;document&#125;</p>
            <p className="pl-4"><span className="text-pink-400">\section*</span>&#123;Experience&#125;</p>
            <p className="pl-4"><span className="text-pink-400">\textbf</span>&#123;Senior Developer&#125;</p>
            <p><span className="text-pink-400">\end</span>&#123;document&#125;</p>
          </div>
        </motion.div>
        
        {/* Layer 5: Glowing Data Lines / Network */}
        <motion.div className="absolute inset-0 z-[-1] opacity-50" style={{ transform: 'translateZ(-50px)' }}>
          <svg className="w-full h-full">
            <motion.path 
              d="M 100 800 Q 300 400 500 0" 
              stroke="url(#grad)" 
              strokeWidth="2" 
              fill="none" 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

      </motion.div>
    </div>
  );
};


// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const mousePosition = useMousePosition();

  return (
    <div className="relative min-h-screen bg-transparent text-text-primary overflow-hidden font-sans">
      
      {/* ─── INSANE 3D BACKGROUND + MOUSE SPOTLIGHT ─── */}
      <motion.div style={{ y: yBg }} className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-transparent" />
        {/* Dynamic Spotlight that follows mouse */}
        <div className="absolute inset-0 opacity-40 dark:opacity-40 opacity-10 transition-opacity duration-300 pointer-events-none" style={{ background: `radial-gradient(1000px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 80%)` }} />
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0)_0%,rgba(3,0,20,1)_100%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuODUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZUZpbHRlcikiIG9wYWNpdHk9IjAuMTIiLz48L3N2Zz4=')] opacity-30 mix-blend-overlay" />
        
        {/* Massive Animated Glows */}
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }} transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)] blur-[100px]" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, -90, 0] }} transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)] blur-[100px]" />
        
        <ParticleFieldResponsive />
      </motion.div>

      {/* ─── HERO SECTION ─── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-24 sm:pt-32 pb-10 sm:pb-20 px-4 overflow-hidden">
        
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
          className="group relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-surface-card border border-surface-border backdrop-blur-xl mb-8 sm:mb-12 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse shadow-[0_0_10px_rgba(0,200,150,0.8)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-text-primary">
            TRANSPARENT ATS ANALYSIS
          </span>
        </motion.div>

        {/* Headline */}
        <div className="text-center max-w-6xl mx-auto z-20">
          <motion.h1 initial={{ opacity: 0, filter: 'blur(10px)', y: 30 }} animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }} transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl lg:text-6xl xl:text-[5.5rem] font-display font-black leading-[1.1] tracking-tighter">
            <span className="text-text-primary drop-shadow-2xl">Precision Resume Intelligence —</span><br/>
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500 animate-gradient-x filter drop-shadow-[0_0_20px_rgba(108,99,255,0.3)]">
              Built for Real Job Matching
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }} animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }} transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 sm:mt-8 text-base sm:text-lg lg:text-xl text-[#AAB2D5] max-w-4xl mx-auto font-light leading-relaxed px-2">
            Go beyond basic resume checks with deep ATS analysis, job-level matching, and AI-driven improvements that actually align your profile with what recruiters look for.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            
            {/* 3D Button */}
            <TiltCard>
              <Link to="/upload" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-white text-base sm:text-lg overflow-hidden bg-dark-900 border border-white/10 transition-all duration-300">
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-violet-600 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuODUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZUZpbHRlcikiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-20 mix-blend-overlay" />
                <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
                  <Network size={22} className="text-cyan-300" /> Start Free Analysis
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </Link>
            </TiltCard>

            <TiltCard>
              <Link to="/analysis/demo" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-slate-300 text-base sm:text-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300 backdrop-blur-xl">
                View Interactive Demo <Eye size={20} className="group-hover:text-primary-400 transition-colors" />
              </Link>
            </TiltCard>
          </motion.div>
        </div>

        {/* ─── ISOMETRIC 3D MOCKUP ─── */}
        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }} className="w-full relative z-10">
          <IsometricMockup mousePosition={mousePosition} />
        </motion.div>
      </section>
      {/* ─── TRUST SECTION ─── */}
      <section className="py-12 sm:py-24 relative z-10 border-y border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)]">
         <div className="text-center max-w-4xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-text-primary mb-4">
               Built for Accuracy, Privacy, and Ethical Resume Improvement
            </h2>
            <p className="text-lg text-[#AAB2D5] mb-12">No fake scores. Only explainable resume analysis.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
               <div className="flex items-center gap-3 text-[#AAB2D5] font-semibold text-sm"><Shield size={18} className="text-[#00C896]"/> Your Data is Private</div>
               <div className="flex items-center gap-3 text-[#AAB2D5] font-semibold text-sm"><CheckCircle2 size={18} className="text-[#00C896]"/> Zero Hallucinated Scores</div>
               <div className="flex items-center gap-3 text-[#AAB2D5] font-semibold text-sm"><Lock size={18} className="text-[#00C896]"/> Deterministic Grading</div>
               <div className="flex items-center gap-3 text-[#AAB2D5] font-semibold text-sm"><Eye size={18} className="text-[#00C896]"/> Delete Anytime</div>
            </div>
         </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-16 sm:py-32 relative z-10">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            {/* CTA Card */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-8 sm:p-16 border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-center flex flex-col items-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/10 to-[#00D4FF]/5" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(108,99,255,0.4)]">
                  <Zap size={40} className="text-white fill-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-text-primary mb-6 leading-tight max-w-2xl">
                  Ready to Build a Resume That Actually Matches the Job?
                </h2>
                <p className="text-[#AAB2D5] text-xl mb-10 leading-relaxed max-w-xl">100% Free. No credit card. No fake scores. Just transparent AI analysis.</p>
                <Link to="/register" className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl font-bold text-white text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(108,99,255,0.4)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF] to-[#9B5CFF]" />
                  <span className="relative z-10 flex items-center gap-2">
                    Analyze Resume Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
