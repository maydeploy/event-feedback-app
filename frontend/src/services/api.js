import axios from 'axios'
import { getSessionId } from '../utils/session'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add session ID to all requests
api.interceptors.request.use((config) => {
  config.headers['X-Session-ID'] = getSessionId()
  return config
})

// Submissions API
export const submissionsApi = {
  create: (data) => api.post('/submissions', data),
  getAll: (params) => api.get('/submissions', { params }),
  getById: (id) => api.get(`/submissions/${id}`),
  vote: (id, voteType) => api.post(`/submissions/${id}/vote`, { voteType }),
}

// Collaborations API
export const collaborationsApi = {
  create: (data) => api.post('/collaborations', data),
}

// Events API
export const eventsApi = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
}

// Admin API
export const adminApi = {
  login: (password) => api.post('/admin/login', { password }),
  logout: () => api.post('/admin/logout'),

  // Pending submissions
  getPending: () => api.get('/admin/pending'),
  approve: (id, tags) => api.put(`/admin/submissions/${id}/approve`, { tags }),
  reject: (id) => api.delete(`/admin/submissions/${id}/reject`),

  // Published submissions
  getPublished: () => api.get('/admin/published'),
  updateStatus: (id, status) => api.put(`/admin/submissions/${id}/status`, { status }),
  addResponse: (id, responseText) => api.post(`/admin/submissions/${id}/response`, { responseText }),
  deleteSubmission: (id) => api.delete(`/admin/submissions/${id}`),

  // Collaborations
  getCollaborations: () => api.get('/admin/collaborations'),
  updateCollaborationStatus: (id, status, notes) =>
    api.put(`/admin/collaborations/${id}`, { status, notes }),

  // Events
  createEvent: (data) => api.post('/admin/events', data),
  updateEvent: (id, data) => api.put(`/admin/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default api
