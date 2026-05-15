import { apiClient, unwrapData } from '../api/client'

export const adminService = {
  async getProjects(params = {}) {
    const response = await apiClient.get('/admin/projects', { params })
    return unwrapData(response)
  },

  async getProjectStats() {
    const response = await apiClient.get('/admin/projects/stats')
    return unwrapData(response)
  },

  async getApplications(params = {}) {
    const response = await apiClient.get('/admin/applications', { params })
    return unwrapData(response)
  },

  async getApplicationStats() {
    const response = await apiClient.get('/admin/applications/stats')
    return unwrapData(response)
  },

  async getEmployees(params = {}) {
    const response = await apiClient.get('/admin/employees', { params })
    return unwrapData(response)
  },

  async getEmployeeStats() {
    const response = await apiClient.get('/admin/employees/stats')
    return unwrapData(response)
  },

  async getRoles(params = {}) {
    const response = await apiClient.get('/admin/roles', { params })
    return unwrapData(response)
  },
}
