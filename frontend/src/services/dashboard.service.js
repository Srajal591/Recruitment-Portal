import { apiClient, unwrapData } from '../api/client'

export const dashboardService = {
  async adminDashboard() {
    const response = await apiClient.get('/dashboard/admin')
    return unwrapData(response)
  },

  async candidateDashboard() {
    const response = await apiClient.get('/dashboard/candidate')
    return unwrapData(response)
  },
}
