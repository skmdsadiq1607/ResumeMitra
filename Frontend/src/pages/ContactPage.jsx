import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden pt-32 pb-24">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,transparent_70%)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.05)_0%,transparent_70%)] blur-[100px] pointer-events-none" />

      <div className="page-container relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#9B5CFF]/10 text-[#9B5CFF] border border-[#9B5CFF]/20 mb-6">Contact Us</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white mb-6 leading-tight">
              Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9B5CFF] to-[#00D4FF]">Great Together</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#AAB2D5] leading-relaxed">
              Have questions about our ATS scoring engine? Want to report a bug or request a feature? We'd love to hear from you.
            </p>
          </motion.div>
        </div>

        {/* Contact Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto px-4">

          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white mb-6">Get in Touch</h2>
            <p className="text-[#AAB2D5] text-lg mb-10 leading-relaxed">
              We try to respond to all inquiries within 24-48 hours. For technical support, please include as much detail as possible.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                  <Mail className="text-[#9B5CFF]" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">Email Support</h4>
                  <a href="mailto:skmdsadiq1607@gmail.com" className="text-[#AAB2D5] hover:text-white transition-colors">skmdsadiq1607@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                  <MessageSquare className="text-[#00D4FF]" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">Feedback</h4>
                  <a href="mailto:skmdsadiq1607@gmail.com" className="text-[#AAB2D5] hover:text-white transition-colors">skmdsadiq1607@gmail.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                  <MapPin className="text-[#00C896]" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">Location & Social</h4>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#AAB2D5]">Built by Sxdiq</span>
                    <a href="https://sxdiq.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[#00C896] hover:text-white transition-colors text-sm">Portfolio</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-xs font-bold text-[#AAB2D5] uppercase tracking-wider mb-2 block">Your Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-3.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder-[#AAB2D5]/50 outline-none focus:border-[#9B5CFF]/50 focus:bg-[rgba(255,255,255,0.06)] transition-all text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#AAB2D5] uppercase tracking-wider mb-2 block">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder-[#AAB2D5]/50 outline-none focus:border-[#9B5CFF]/50 focus:bg-[rgba(255,255,255,0.06)] transition-all text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#AAB2D5] uppercase tracking-wider mb-2 block">Message</label>
                <textarea rows="5" placeholder="How can we help?" className="w-full px-4 py-3.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder-[#AAB2D5]/50 outline-none focus:border-[#9B5CFF]/50 focus:bg-[rgba(255,255,255,0.06)] transition-all resize-none text-sm" />
              </div>
              <button type="submit" className="group relative w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white text-base overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(155,92,255,0.4)] mt-4">
                <div className="absolute inset-0 bg-gradient-to-r from-[#9B5CFF] to-[#00D4FF]" />
                <span className="relative z-10 flex items-center gap-2"><Send size={18}/> Send Message</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
