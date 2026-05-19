import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, Sparkles, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';

const navItems = [
  { label: 'Home', path: '/', type: 'route' },
  { label: 'About', path: '/about', type: 'route' },
  { label: 'Features', path: '/features', type: 'route' },
  { label: 'How It Works', path: '/how-it-works', type: 'route' },
  { label: 'ATS Scoring', path: '/how-ats-works', type: 'route' },
  { label: 'Analyzer', path: '/upload', type: 'route' },
  { label: 'Overleaf Builder', path: '/overleaf-info', type: 'route' },
  { label: 'Contact', path: '/contact', type: 'route' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const handleNavClick = (item) => {
    setIsOpen(false);

    if (item.type === 'scroll') {
      if (location.pathname === '/') {
        // Already on homepage, just scroll
        const el = document.getElementById(item.sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Navigate to homepage first, then scroll after render
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(item.sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-3 pointer-events-none">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`mx-auto max-w-7xl transition-all duration-500 rounded-2xl pointer-events-auto ${
          scrolled
            ? 'bg-surface-card/85 backdrop-blur-xl border border-surface-border shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border border-transparent'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img 
              src="/favicon.svg" 
              alt="ResumeMitra Logo" 
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-display font-extrabold text-xl text-text-primary tracking-tight leading-none group-hover:text-primary-400 transition-colors duration-300">ResumeMitra</span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (location.pathname + location.hash) === item.path;
              return (
                <button 
                  key={item.label} 
                  onClick={() => handleNavClick(item)} 
                  className={`relative px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-300 group ${isActive ? 'text-text-primary bg-surface-hover' : 'text-text-muted hover:text-text-primary hover:bg-surface-card/50'}`}
                >
                  {item.label}
                  <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 rounded-full ${isActive ? 'w-4' : 'w-0 group-hover:w-4'}`} />
                </button>
              );
            })}
          </nav>

          {/* Auth & Theme Buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-surface-card border border-surface-border text-text-muted hover:text-text-primary transition-all hover:border-primary-500/40 hover:bg-surface-hover"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isAuthenticated ? (
              <Link to="/dashboard" className="relative group px-5 py-2.5 rounded-xl bg-surface-card border border-surface-border text-text-primary text-sm font-bold overflow-hidden transition-all hover:border-primary-500/40 hover:bg-surface-hover">
                <span className="relative z-10 flex items-center gap-2"><Sparkles size={14} className="text-primary-500"/> Dashboard</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-text-muted hover:text-text-primary transition-colors px-3 py-2">Sign In</Link>
                <Link to="/register" className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(108,99,255,0.5)] hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF] to-[#9B5CFF]" />
                  <span className="relative z-10 flex items-center gap-1.5">Get Started Free</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-surface-hover"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-surface-hover" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[76px] left-4 right-4 bg-surface-card/95 backdrop-blur-2xl border border-surface-border rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.2)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)] xl:hidden pointer-events-auto"
          >
            <div className="p-3 flex flex-col gap-0.5">
              {navItems.map((item) => (
                <button key={item.label} onClick={() => handleNavClick(item)} className="text-left px-4 py-3 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all">
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-surface-border my-2" />
              {isAuthenticated ? (
                <Link to="/dashboard" className="px-4 py-3 rounded-xl text-sm font-bold text-primary-500 bg-primary-500/10 text-center">Go to Dashboard</Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" className="px-4 py-3 rounded-xl text-sm font-bold text-text-primary bg-surface-card text-center">Sign In</Link>
                  <Link to="/register" className="px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-accent-500 text-center shadow-glow-sm">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
