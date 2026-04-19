import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism bar */}
      <div className="border-b border-surface-border/50 bg-dark-900/80 backdrop-blur-md">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-300">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg gradient-text">ResumeAI</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</Link>
              <Link to="/#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How it works</Link>
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-sm py-2 px-5">
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">Sign in</Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started Free</Link>
                </div>
              )}
            </nav>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-dark-800/95 backdrop-blur-md border-b border-surface-border"
        >
          <div className="page-container py-4 flex flex-col gap-4">
            <Link to="/#features" className="text-slate-300" onClick={() => setIsOpen(false)}>Features</Link>
            <Link to="/#how-it-works" className="text-slate-300" onClick={() => setIsOpen(false)}>How it works</Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 text-center" onClick={() => setIsOpen(false)}>Sign in</Link>
                <Link to="/register" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Get Started Free</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  )
}

export default Navbar
