import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services/resumeService'
import { extractError } from '../utils/helpers'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters.')
    }
    setLoading(true)
    try {
      const res = await authService.register(form)
      const { user, token } = res.data.data
      setAuth(user, token)
      toast.success('Account created! Welcome to Resume Mitra 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">ResumeMitra</span>
          </div>

          <h1 className="text-2xl font-display font-bold text-text-primary text-center mb-1">Create your account</h1>
          <p className="text-sm text-text-muted text-center mb-8">Start optimizing your resume for free</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                required
                className="input-field pl-10"
              />
            </div>
            {/* Email */}
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                className="input-field pl-10"
              />
            </div>
            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (min. 6 characters)"
                value={form.password}
                onChange={handleChange}
                required
                className="input-field pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 justify-center mt-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><ArrowRight size={16} />Create Account</>}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage
