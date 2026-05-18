import { apiClient, unwrapData } from '../api/client'

export const jobService = {
  // ── Public ────────────────────────────────────────────────
  async getPublicJobs(params = {}) {
    const response = await apiClient.get('/jobs', { params })
    return unwrapData(response)
  },
  async getPublicJob(id) {
    const response = await apiClient.get(`/jobs/${id}`)
    return unwrapData(response)
  },
  async getPublicStats() {
    const response = await apiClient.get('/jobs/stats')
    return unwrapData(response)
  },
  async getDepartments() {
    const response = await apiClient.get('/jobs/departments')
    return unwrapData(response)
  },
  async getCategories() {
    const response = await apiClient.get('/jobs/categories')
    return unwrapData(response)
  },
  async searchJobs(params = {}) {
    const response = await apiClient.get('/jobs/search', { params })
    return unwrapData(response)
  },

  // ── Admin (kept for backward compat — delegates to adminService) ──
  async getAdminJobs(params = {}) {
    const response = await apiClient.get('/admin/jobs', { params })
    return unwrapData(response)
  },
  async getAdminJobStats() {
    const response = await apiClient.get('/admin/jobs/stats')
    return unwrapData(response)
  },
}
