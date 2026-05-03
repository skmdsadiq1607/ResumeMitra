import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, MessageSquare } from 'lucide-react';

const TiltCard = ({ children, className }) => {
  const ref = React.useRef(null);
  const [rotate, setRotate] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * -10, y: x * 10 });
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

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden pt-32 pb-24">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_70%)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.05)_0%,transparent_70%)] blur-[100px] pointer-events-none" />

      <div className="page-container relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#9B5CFF]/10 text-[#9B5CFF] border border-[#9B5CFF]/20 mb-6">Contact Us</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-text-primary mb-6 leading-tight">
              Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">Great Together</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-muted leading-relaxed">
              Have questions about our ATS scoring engine? Want to report a bug or request a feature? We'd love to hear from you.
            </p>
          </motion.div>
        </div>

        {/* Contact Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto px-4">

          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-text-primary mb-6">Get in Touch</h2>
            <p className="text-text-muted text-lg mb-10 leading-relaxed">
              We try to respond to all inquiries within 24-48 hours. For technical support, please include as much detail as possible.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center">
                  <Mail className="text-primary-500" size={20} />
                </div>
                <div>
                  <h4 className="text-text-primary font-bold text-sm uppercase tracking-wider mb-1">Email Support</h4>
                  <a href="mailto:skmdsadiq1607@gmail.com" className="text-text-muted hover:text-text-primary transition-colors">skmdsadiq1607@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center">
                  <MessageSquare className="text-accent-500" size={20} />
                </div>
                <div>
                  <h4 className="text-text-primary font-bold text-sm uppercase tracking-wider mb-1">Feedback</h4>
                  <a href="mailto:skmdsadiq1607@gmail.com" className="text-text-muted hover:text-text-primary transition-colors">skmdsadiq1607@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center">
                  <MapPin className="text-emerald-500" size={20} />
                </div>
                <div>
                  <h4 className="text-text-primary font-bold text-sm uppercase tracking-wider mb-1">Location & Social</h4>
                  <div className="flex flex-col gap-1">
                    <span className="text-text-muted">Built by Sxdiq</span>
                    <a href="https://sxdiq.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-text-primary transition-colors text-sm">Portfolio</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <TiltCard className="relative z-10">
            <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-surface-border bg-surface-card/80 backdrop-blur-xl shadow-2xl">
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Your Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-3.5 rounded-xl bg-surface-card border border-surface-border text-text-primary placeholder-text-muted outline-none focus:border-primary-500/50 focus:bg-surface-hover transition-all text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3.5 rounded-xl bg-surface-card border border-surface-border text-text-primary placeholder-text-muted outline-none focus:border-primary-500/50 focus:bg-surface-hover transition-all text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Message</label>
                <textarea rows="5" placeholder="How can we help?" className="w-full px-4 py-3.5 rounded-xl bg-surface-card border border-surface-border text-text-primary placeholder-text-muted outline-none focus:border-primary-500/50 focus:bg-surface-hover transition-all resize-none text-sm" />
              </div>
              <button type="submit" className="group relative w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white text-base overflow-hidden transition-all duration-300 hover:shadow-glow-sm mt-4">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500" />
                <span className="relative z-10 flex items-center gap-2"><Send size={18}/> Send Message</span>
              </button>
            </form>
          </div>
        </TiltCard>

        </div>
      </div>
    </div>
  );
}
