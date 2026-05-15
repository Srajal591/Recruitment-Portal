import { apiClient, unwrapData } from '../api/client'

export const applicationService = {
  async getMyApplications(params = {}) {
    const response = await apiClient.get('/candidate/applications', { params })
    return { data: unwrapData(response), meta: response?.meta }
  },

  async createApplication(jobId) {
    const response = await apiClient.post('/candidate/applications', { jobId })
    return unwrapData(response)
  },

  async getAdminApplications(params = {}) {
    const response = await apiClient.get('/admin/applications', { params })
    return unwrapData(response)
  },

  async getAdminApplicationStats() {
    const response = await apiClient.get('/admin/applications/stats')
    return unwrapData(response)
  },
}
