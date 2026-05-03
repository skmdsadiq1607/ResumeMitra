import { Link } from 'react-router-dom'
import { Zap, Shield, Lock, Trash2, Heart } from 'lucide-react'

const Footer = () => (
  <footer className="border-t border-surface-border/30 bg-transparent mt-auto relative overflow-hidden">
    {/* Ambient glow */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary-500/3 blur-[100px] rounded-full pointer-events-none" />

    <div className="page-container py-14 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 via-violet-500 to-accent-500 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg gradient-text leading-tight">ResumeMitra</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-text-muted opacity-80">By Sxdiq</span>
            </div>
          </div>
          <p className="text-sm text-text-muted max-w-sm leading-relaxed mb-5">
            AI-powered ATS resume analyzer that helps you optimize your resume for applicant tracking systems. 100% free, forever.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { icon: Lock, text: 'Encrypted' },
              { icon: Shield, text: 'Private' },
              { icon: Trash2, text: 'Delete anytime' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-[10px] text-text-muted bg-surface-card px-2.5 py-1.5 rounded-full border border-surface-border/50">
                <Icon size={10} className="text-emerald-500" /> {text}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-5">Platform</h3>
          <ul className="space-y-3 text-sm text-text-muted">
            <li><Link to="/register" className="hover:text-text-primary transition-colors duration-300">Get Started</Link></li>
            <li><Link to="/how-ats-works" className="hover:text-text-primary transition-colors duration-300">How ATS Works</Link></li>
            <li><Link to="/login" className="hover:text-text-primary transition-colors duration-300">Sign In</Link></li>
            <li><Link to="/dashboard" className="hover:text-text-primary transition-colors duration-300">Dashboard</Link></li>
          </ul>
        </div>

        {/* Trust */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-5">Privacy & Trust</h3>
          <ul className="space-y-3 text-sm text-text-muted">
            <li className="flex items-center gap-2"><Shield size={12} className="text-emerald-500 flex-shrink-0" /> Your resume is private</li>
            <li className="flex items-center gap-2"><Shield size={12} className="text-emerald-500 flex-shrink-0" /> Never shared with anyone</li>
            <li className="flex items-center gap-2"><Shield size={12} className="text-emerald-500 flex-shrink-0" /> Delete data anytime</li>
            <li className="flex items-center gap-2"><Shield size={12} className="text-emerald-500 flex-shrink-0" /> Open & transparent AI</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-surface-border/30 mt-10 pt-6 flex flex-col items-center justify-between gap-6">
        <p className="text-sm font-semibold text-text-muted flex items-center gap-1.5">
          Built with <Heart size={14} className="text-rose-500 fill-rose-500" /> By Sxdiq
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-text-muted">
          <a href="https://github.com/skmdsadiq1607" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GitHub</a>
          <span>&bull;</span>
          <a href="https://www.linkedin.com/in/shaik-sadiq-b1650a377/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">LinkedIn</a>
          <span>&bull;</span>
          <a href="https://sxdiq.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Portfolio</a>
          <span>&bull;</span>
          <a href="tel:+919441921812" className="hover:text-emerald-400 transition-colors">+91 9441921812</a>
          <span>&bull;</span>
          <a href="mailto:skmdsadiq1607@gmail.com" className="hover:text-emerald-400 transition-colors">skmdsadiq1607@gmail.com</a>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full text-xs text-text-muted opacity-60 mt-2">
          <p>© 2026 ResumeMitra. All rights reserved.</p>
          <p>Powered by Google Gemini AI · 100% Free</p>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
