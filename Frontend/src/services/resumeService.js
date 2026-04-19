// Auth API calls
import api from './api'

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

// Resume API calls
export const resumeService = {
  upload: (formData) =>
    api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  analyze: (formData) =>
    api.post('/resume/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 min for rich AI analysis
    }),
  getHistory: (params) => api.get('/resume/history', { params }),
  getReport: (id) => api.get(`/resume/report/${id}`),
  deleteReport: (id) => api.delete(`/resume/report/${id}`),
  compareReports: (idA, idB) => api.get('/resume/compare', { params: { idA, idB } }),
}

// Dashboard API calls
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
}
