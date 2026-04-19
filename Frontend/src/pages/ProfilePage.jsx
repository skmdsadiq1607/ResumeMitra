import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Save, Loader2, Shield } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services/resumeService'
import { extractError, formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore()
  const [name, setName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) return toast.error('Name cannot be empty.')
    setLoading(true)
    try {
      const res = await authService.updateProfile({ name: name.trim() })
      updateUser(res.data.data.user)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Profile</h1>
        <p className="text-slate-400 mt-1 text-sm">Manage your account details.</p>
      </div>

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 flex items-center gap-5"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold shadow-glow flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <p className="text-lg font-semibold text-white">{user?.name}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Shield size={12} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 capitalize">{user?.role || 'user'}</span>
          </div>
        </div>
      </motion.div>

      {/* Edit form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h2 className="text-base font-semibold text-white mb-5">Account Details</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-10"
                placeholder="Your full name"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field pl-10 opacity-50 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-slate-600 mt-1">Email cannot be changed.</p>
          </div>
          {user?.createdAt && (
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <Calendar size={12} />
              Member since {formatDate(user.createdAt)}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 w-full justify-center mt-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default ProfilePage
