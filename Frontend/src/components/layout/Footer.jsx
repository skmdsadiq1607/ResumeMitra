import { Link } from 'react-router-dom'
import { Zap, ExternalLink, AtSign, Link as LinkIcon } from 'lucide-react'

const Footer = () => (
  <footer className="border-t border-surface-border/50 bg-dark-900/50 mt-auto">
    <div className="page-container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-display font-bold gradient-text">ResumeAI</span>
          </div>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
            AI-powered resume grader that helps you optimize your resume for ATS systems and land more interviews.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a href="#" className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"><ExternalLink size={16} /></a>
            <a href="#" className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"><AtSign size={16} /></a>
            <a href="#" className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"><LinkIcon size={16} /></a>
          </div>
        </div>
        {/* Product */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/#features" className="hover:text-slate-300 transition-colors">Features</Link></li>
            <li><Link to="/#how-it-works" className="hover:text-slate-300 transition-colors">How it works</Link></li>
            <li><Link to="/register" className="hover:text-slate-300 transition-colors">Get Started</Link></li>
          </ul>
        </div>
        {/* Account */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Account</h3>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/login" className="hover:text-slate-300 transition-colors">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-slate-300 transition-colors">Register</Link></li>
            <li><Link to="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-surface-border/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-600">© 2026 ResumeAI. Built with ❤️ for job seekers.</p>
        <p className="text-xs text-slate-600">Powered by Google Gemini AI</p>
      </div>
    </div>
  </footer>
)

export default Footer
