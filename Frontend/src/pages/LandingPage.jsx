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

// --- Advanced 3D Tilt Card (Disabled on mobile for better UX) ---
const TiltCard = ({ children, className, id }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current || isMobile) return;
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
      style={!isMobile ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
      className={`relative perspective-1000 ${className || ''}`}
      id={id}
    >
      {!isMobile && <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100 rounded-3xl" style={{ transform: 'translateZ(-10px)' }} />}
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

const AnalysisPreview = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto mt-20 px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Main Resume View */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:col-span-7 lg:col-span-8 glass-card p-5 sm:p-8 min-h-[300px] md:min-h-[400px] relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                <FileText size={18} className="text-primary-400" />
              </div>
              <div>
                <h3 className="text-[13px] md:text-sm font-bold text-text-primary truncate max-w-[150px] sm:max-w-none">Resume_Senior_Dev.pdf</h3>
                <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold">Uploaded 2m ago</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">ATS PASSED</span>
            </div>
          </div>

          <div className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <div className="h-3 md:h-4 w-1/3 bg-surface-hover rounded-md shimmer" />
              <div className="h-2 md:h-3 w-full bg-surface-hover/50 rounded-md" />
              <div className="h-2 md:h-3 w-5/6 bg-surface-hover/50 rounded-md" />
            </div>
            
            <div className="p-3 md:p-4 rounded-xl bg-primary-500/5 border border-primary-500/10 relative group">
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent z-10 opacity-50"
              />
              <div className="flex items-start gap-3">
                <Brain size={16} className="text-primary-400 shrink-0 mt-1" />
                <div className="space-y-1 md:space-y-2">
                  <p className="text-[10px] font-bold text-primary-300 uppercase tracking-wider">AI Enhancement</p>
                  <p className="text-[12px] md:text-sm text-text-secondary leading-relaxed">
                    Quantified impact: Changed "Led a team of developers" to 
                    <span className="text-emerald-400 font-medium ml-1">"Directed 12+ engineers to deliver 3 core products, increasing revenue by 22%."</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-3 md:h-4 w-1/4 bg-surface-hover rounded-md" />
              <div className="h-2 md:h-3 w-full bg-surface-hover/50 rounded-md" />
              <div className="h-2 md:h-3 w-4/6 bg-surface-hover/50 rounded-md" />
            </div>
          </div>

          {/* Decorative bits */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] pointer-events-none" />
        </motion.div>

        {/* Stats Column */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
          
          {/* Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 md:p-8 flex flex-col items-center justify-center text-center relative group"
          >
            <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-surface-border md:hidden" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-border hidden md:block" />
                
                <motion.circle 
                  cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" 
                  strokeDasharray="263.8"
                  initial={{ strokeDashoffset: 263.8 }}
                  whileInView={{ strokeDashoffset: 263.8 - (263.8 * 0.88) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-primary-500 md:hidden" 
                />
                <motion.circle 
                  cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray="364.4"
                  initial={{ strokeDashoffset: 364.4 }}
                  whileInView={{ strokeDashoffset: 364.4 - (364.4 * 0.88) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-primary-500 hidden md:block" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl md:text-4xl font-black text-text-primary">88</span>
                <span className="text-[8px] md:text-[10px] font-bold text-text-muted">SCORE</span>
              </div>
            </div>
            <h4 className="text-base md:text-lg font-bold text-text-primary mb-1">Excellent Alignment</h4>
            <p className="text-[11px] md:text-xs text-text-muted">Top 5% of candidates for this role</p>
          </motion.div>

          {/* Keywords Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-accent-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Critical Keywords</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'System Design', 'CI/CD', 'AWS'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  {tag}
                </span>
              ))}
              {['Kubernetes', 'Python'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Quick Check Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 bg-gradient-to-br from-primary-500/10 to-transparent"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={16} className="text-primary-400" />
              <span className="text-xs font-bold uppercase tracking-wider">ATS Compliance</span>
            </div>
            <ul className="space-y-3">
              {[
                'Standard Headings Found',
                'No Image Overlays',
                'Font Compatibility OK',
                'Contact Info Extracted'
              ].map(check => (
                <li key={check} className="flex items-center gap-2 text-[11px] font-medium text-text-secondary">
                  <div className="w-1 h-1 rounded-full bg-primary-500" /> {check}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

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
        <div className="absolute inset-0 opacity-40 dark:opacity-30 transition-opacity duration-300 pointer-events-none" style={{ background: `radial-gradient(1000px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.1), transparent 80%)` }} />
        
        {/* Dark Mode ONLY Depth Gradient */}
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0)_0%,rgba(3,0,20,0.5)_100%)] pointer-events-none" />
        
        <div className="absolute inset-0 bg-transparent" />
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
            className="mt-5 sm:mt-8 text-base sm:text-lg lg:text-xl text-text-muted max-w-4xl mx-auto font-light leading-relaxed px-2">
            Go beyond basic resume checks with deep ATS analysis, job-level matching, and AI-driven improvements that actually align your profile with what recruiters look for.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            
            {/* 3D Button */}
            <TiltCard>
              <Link to="/upload" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-white text-base sm:text-lg overflow-hidden bg-primary-600 border border-surface-border transition-all duration-300 shadow-glow">
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
              <Link to="/analysis/demo" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-text-muted text-base sm:text-lg bg-surface-card border border-surface-border hover:bg-surface-hover hover:text-text-primary transition-all duration-300 backdrop-blur-xl">
                View Interactive Demo <Eye size={20} className="group-hover:text-primary-400 transition-colors" />
              </Link>
            </TiltCard>
          </motion.div>
        </div>

        {/* ─── ANALYSIS PREVIEW ─── */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="w-full relative z-10">
          <AnalysisPreview />
        </motion.div>
      </section>
      {/* ─── TRUST SECTION ─── */}
      <section className="py-12 sm:py-24 relative z-10 border-y border-surface-border bg-surface-hover/30">
         <div className="text-center max-w-4xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-text-primary mb-4">
               Built for Accuracy, Privacy, and Ethical Resume Improvement
            </h2>
            <p className="text-lg text-text-muted mb-12">No fake scores. Only explainable resume analysis.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
               <div className="flex items-center gap-3 text-text-muted font-semibold text-sm"><Shield size={18} className="text-[#00C896]"/> Your Data is Private</div>
               <div className="flex items-center gap-3 text-text-muted font-semibold text-sm"><CheckCircle2 size={18} className="text-[#00C896]"/> Zero Hallucinated Scores</div>
               <div className="flex items-center gap-3 text-text-muted font-semibold text-sm"><Lock size={18} className="text-[#00C896]"/> Deterministic Grading</div>
               <div className="flex items-center gap-3 text-text-muted font-semibold text-sm"><Eye size={18} className="text-[#00C896]"/> Delete Anytime</div>
            </div>
         </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-16 sm:py-32 relative z-10">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
            {/* CTA Card */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-8 sm:p-16 border border-surface-border bg-surface-card text-center flex flex-col items-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/10 to-[#00D4FF]/5" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(108,99,255,0.4)]">
                  <Zap size={40} className="text-white fill-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-text-primary mb-6 leading-tight max-w-2xl">
                  Ready to Build a Resume That Actually Matches the Job?
                </h2>
                <p className="text-text-muted text-xl mb-10 leading-relaxed max-w-xl">100% Free. No credit card. No fake scores. Just transparent AI analysis.</p>
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
