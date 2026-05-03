import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';

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
            ? 'bg-[#080A1A]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border border-transparent'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] shadow-[0_0_15px_rgba(108,99,255,0.4)] group-hover:scale-110 transition-transform duration-500">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg text-white tracking-tight leading-tight">ResumeMithra</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#00D4FF]">Free ATS Analyzer</span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (location.pathname + location.hash) === item.path;
              return (
                <button 
                  key={item.label} 
                  onClick={() => handleNavClick(item)} 
                  className={`relative px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-300 group ${isActive ? 'text-white bg-white/[0.06]' : 'text-[#AAB2D5] hover:text-white hover:bg-white/[0.04]'}`}
                >
                  {item.label}
                  <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] transition-all duration-300 rounded-full ${isActive ? 'w-4' : 'w-0 group-hover:w-4'}`} />
                </button>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <Link to="/dashboard" className="relative group px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm font-bold overflow-hidden transition-all hover:border-[#6C63FF]/40 hover:bg-white/[0.08]">
                <span className="relative z-10 flex items-center gap-2"><Sparkles size={14} className="text-[#6C63FF]"/> Dashboard</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-[#AAB2D5] hover:text-white transition-colors px-3 py-2">Sign In</Link>
                <Link to="/register" className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(108,99,255,0.5)] hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF] to-[#9B5CFF]" />
                  <span className="relative z-10 flex items-center gap-1.5">Get Started Free</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="xl:hidden p-2 text-[#AAB2D5] hover:text-white transition-colors rounded-lg hover:bg-white/5" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

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
            className="absolute top-[76px] left-4 right-4 bg-[#080A1A]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.5)] xl:hidden pointer-events-auto"
          >
            <div className="p-3 flex flex-col gap-0.5">
              {navItems.map((item) => (
                <button key={item.label} onClick={() => handleNavClick(item)} className="text-left px-4 py-3 rounded-xl text-sm font-semibold text-[#AAB2D5] hover:text-white hover:bg-white/[0.04] transition-all">
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-white/[0.06] my-2" />
              {isAuthenticated ? (
                <Link to="/dashboard" className="px-4 py-3 rounded-xl text-sm font-bold text-[#6C63FF] bg-[#6C63FF]/10 text-center">Go to Dashboard</Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" className="px-4 py-3 rounded-xl text-sm font-bold text-white bg-white/[0.06] text-center">Sign In</Link>
                  <Link to="/register" className="px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6C63FF] to-[#9B5CFF] text-center">Get Started</Link>
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
