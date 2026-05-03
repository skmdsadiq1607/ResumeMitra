import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Target, Lightbulb, Users, Globe } from 'lucide-react';

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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden pt-32 pb-24">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.08)_0%,transparent_70%)] blur-[100px] pointer-events-none" />

      <div className="page-container relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20 mb-6">Our Story</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white mb-6 leading-tight">
              Decoding the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]">ATS Matrix</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#AAB2D5] leading-relaxed">
              We started Resume Mitra because we were tired of seeing brilliant candidates get rejected by blind algorithms. Our mission is to democratize resume intelligence.
            </p>
          </motion.div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto mb-24 px-4">
          <TiltCard>
            <div className="p-8 sm:p-12 rounded-3xl bg-[#080A1A]/80 border border-[rgba(255,255,255,0.12)] h-full relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C63FF]/20 blur-[50px] group-hover:bg-[#6C63FF]/30 transition-colors duration-500" />
               <div className="w-16 h-16 rounded-2xl bg-[#6C63FF]/10 border border-[#6C63FF]/20 flex items-center justify-center mb-8">
                 <Target size={32} className="text-[#6C63FF]" />
               </div>
               <h3 className="text-2xl sm:text-3xl font-display font-black text-white mb-6">Our Mission</h3>
               <p className="text-[#AAB2D5] text-lg leading-relaxed">
                 To provide absolute transparency into how applicant tracking systems evaluate resumes. We believe job seekers deserve to know exactly why they pass or fail, without arbitrary numbers or paywalled advice.
               </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#6C63FF]/10 to-[#00D4FF]/10 border border-[rgba(255,255,255,0.12)] h-full relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D4FF]/20 blur-[50px] group-hover:bg-[#00D4FF]/30 transition-colors duration-500" />
               <div className="w-16 h-16 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center mb-8">
                 <Lightbulb size={32} className="text-[#00D4FF]" />
               </div>
               <h3 className="text-2xl sm:text-3xl font-display font-black text-white mb-6">Our Vision</h3>
               <p className="text-[#AAB2D5] text-lg leading-relaxed relative z-10">
                 Every student and professional should have access to top-tier, recruiter-grade resume insights. We envision a hiring landscape where merit and skill define success, not resume formatting luck.
               </p>
            </div>
          </TiltCard>
        </div>

        {/* Stats / Impact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
           <div className="p-8 rounded-3xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-center">
             <div className="flex justify-center mb-4"><Users size={32} className="text-[#00C896]"/></div>
             <div className="text-4xl font-black text-white mb-2">10k+</div>
             <div className="text-sm font-bold uppercase tracking-widest text-[#AAB2D5]">Resumes Analyzed</div>
           </div>
           <div className="p-8 rounded-3xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-center">
             <div className="flex justify-center mb-4"><Globe size={32} className="text-[#6C63FF]"/></div>
             <div className="text-4xl font-black text-white mb-2">Open Source</div>
             <div className="text-sm font-bold uppercase tracking-widest text-[#AAB2D5]">Free For Everyone</div>
           </div>
        </div>

      </div>
    </div>
  );
}
