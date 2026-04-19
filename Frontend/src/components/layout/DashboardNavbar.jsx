import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Menu, Bell, Search, Upload } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const DashboardNavbar = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <header className="h-16 border-b border-surface-border bg-dark-900/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-slate-300 hidden sm:block">
          Welcome back, <span className="text-white">{user?.name?.split(' ')[0]}</span> 👋
        </h2>
      </div>
      <div className="flex items-center gap-3">
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
      </div>
    </header>
  )
}

export default DashboardNavbar
