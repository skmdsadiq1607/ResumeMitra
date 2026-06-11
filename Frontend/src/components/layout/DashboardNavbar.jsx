
import { useNavigate, Link } from 'react-router-dom'
import { Menu, Bell, Search, Upload, Sun, Moon, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'

const DashboardNavbar = () => {
  const { user, isAuthenticated } = useAuthStore()
  const { isDarkMode, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  return (
    <header className="h-16 border-b border-surface-border bg-surface-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <h2 className="text-sm font-semibold text-text-muted hidden sm:block">
            Welcome back, <span className="text-text-primary">{user?.name?.split(' ')[0]}</span> 👋
          </h2>
        ) : (
          <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-all group">
            <div className="p-1.5 rounded-lg bg-surface-card border border-surface-border group-hover:border-primary-500/50">
              <Menu size={16} />
            </div>
            <span className="text-sm font-bold">ResumeMitra</span>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <button
              onClick={() => navigate('/upload')}
              className="btn-primary text-xs py-2 px-4 hidden sm:flex"
            >
              <Upload size={14} />
              Analyze Resume
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </>
        ) : (
          <>
            <Link to="/register" className="btn-primary text-xs py-2 px-4 shadow-glow">
              Get Started Free
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default DashboardNavbar
