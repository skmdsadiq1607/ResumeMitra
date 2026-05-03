import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Save, Loader2, Shield, Settings, Zap, ArrowRight } from 'lucide-react'

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
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services/resumeService'
import { extractError, formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) }

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
    <div className="max-w-2xl mx-auto space-y-8 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex items-center gap-3 px-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 flex items-center justify-center border border-primary-500/20">
          <Settings size={20} className="text-primary-400" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-extrabold text-text-primary tracking-tight">Account Settings</h1>
          <p className="text-text-muted text-sm font-medium">Manage your personal information and preferences.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6 px-4">
          <TiltCard className="glass-card p-6 text-center relative overflow-hidden group border border-surface-border bg-surface-card">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent pointer-events-none" />
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 p-0.5 shadow-glow-lg group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full bg-surface-card rounded-[14px] flex items-center justify-center">
                <span className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-violet-400">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-text-primary mt-4">{user?.name}</h2>
            <div className="flex items-center justify-center gap-1.5 mt-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-max mx-auto">
              <Shield size={12} className="text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 capitalize tracking-wide">{user?.role || 'User'}</span>
            </div>
            {user?.createdAt && (
              <p className="text-xs text-text-muted mt-4 flex items-center justify-center gap-1">
                <Calendar size={12} /> Member since {formatDate(user.createdAt)}
              </p>
            )}
          </TiltCard>

          <TiltCard className="glass-card p-5 bg-gradient-to-br from-primary-500/5 to-transparent border border-primary-500/20">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-2"><Zap size={16} className="text-primary-400" /> Free Plan</h3>
            <p className="text-xs text-text-muted leading-relaxed mb-4">You are currently on the free plan which includes unlimited local ATS analyses.</p>
            <div className="w-full bg-surface-border rounded-full h-1.5 mb-2"><div className="bg-primary-500 h-1.5 rounded-full w-full shadow-glow-sm" /></div>
            <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider text-right">Lifetime Access</p>
          </TiltCard>
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="md:col-span-2 glass-card p-6 sm:p-8 border border-surface-border bg-surface-card">
          <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2 border-b border-surface-border pb-4">
            <User size={18} className="text-text-muted" /> Profile Information
          </h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Full Name</label>
              <div className="relative group">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-400 transition-colors" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-11 py-3 text-sm font-medium bg-transparent border-surface-border hover:border-primary-500/30 transition-all" placeholder="Your full name" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted mb-2 block uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="email" value={user?.email || ''} disabled className="input-field pl-11 py-3 text-sm font-medium bg-transparent border-surface-border text-text-muted opacity-50 cursor-not-allowed" />
              </div>
              <p className="text-xs text-text-muted opacity-60 mt-2 flex items-center gap-1"><Shield size={12} /> Email is tied to your account security and cannot be changed.</p>
            </div>
            <div className="pt-4 border-t border-surface-border mt-6">
              <button type="submit" disabled={loading} className="btn-primary py-3.5 px-8 shadow-glow group">
                {loading ? <Loader2 size={16} className="animate-spin" /> : 
                  <span className="flex items-center gap-2 font-bold"><Save size={16} /> Save Changes <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
                }
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
