/**
 * Axios API Service
 * Configured instance with base URL and JWT interceptors
 */
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  // Use relative path for local proxying, or environment variable for production
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000, // 60s timeout (AI analysis can take time)
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor: Attach token ────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor: Handle 401 ─────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
