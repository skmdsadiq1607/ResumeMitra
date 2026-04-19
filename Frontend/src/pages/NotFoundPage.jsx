import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Zap } from 'lucide-react'

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="text-8xl font-display font-black gradient-text mb-6">404</div>
      <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/" className="btn-primary py-2.5 px-6">
          <Home size={16} /> Go Home
        </Link>
        <button onClick={() => window.history.back()} className="btn-secondary py-2.5 px-6">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    </motion.div>
  </div>
)

export default NotFoundPage
