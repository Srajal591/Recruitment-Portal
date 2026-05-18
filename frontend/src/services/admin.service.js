import { apiClient, unwrapData } from '../api/client'

export const adminService = {
  // ── Projects ──────────────────────────────────────────────
  async getProjects(params = {}) {
    const response = await apiClient.get('/admin/projects', { params })
    return unwrapData(response)
  },
  async getProjectStats() {
    const response = await apiClient.get('/admin/projects/stats')
    return unwrapData(response)
  },
  async getProject(id) {
    const response = await apiClient.get(`/admin/projects/${id}`)
    return unwrapData(response)
  },
  async createProject(data) {
    const response = await apiClient.post('/admin/projects', data)
    return unwrapData(response)
  },
  async updateProject(id, data) {
    const response = await apiClient.put(`/admin/projects/${id}`, data)
    return unwrapData(response)
  },
  async deleteProject(id) {
    const response = await apiClient.delete(`/admin/projects/${id}`)
    return unwrapData(response)
  },

  // ── Jobs ──────────────────────────────────────────────────
  async getAdminJobs(params = {}) {
    const response = await apiClient.get('/admin/jobs', { params })
    return unwrapData(response)
  },
  async getAdminJobStats() {
    const response = await apiClient.get('/admin/jobs/stats')
    return unwrapData(response)
  },
  async getAdminJob(id) {
    const response = await apiClient.get(`/admin/jobs/${id}`)
    return unwrapData(response)
  },
  async createJob(data) {
    const response = await apiClient.post('/admin/jobs', data)
    return unwrapData(response)
  },
  async updateJob(id, data) {
    const response = await apiClient.put(`/admin/jobs/${id}`, data)
    return unwrapData(response)
  },
  async publishJob(id) {
    const response = await apiClient.put(`/admin/jobs/${id}/publish`)
    return unwrapData(response)
  },
  async closeJob(id) {
    const response = await apiClient.put(`/admin/jobs/${id}/close`)
    return unwrapData(response)
  },
  async deleteJob(id) {
    const response = await apiClient.delete(`/admin/jobs/${id}`)
    return unwrapData(response)
  },

  // ── Applications ──────────────────────────────────────────
  async getApplications(params = {}) {
    const response = await apiClient.get('/admin/applications', { params })
    return unwrapData(response)
  },
  async getApplicationStats() {
    const response = await apiClient.get('/admin/applications/stats')
    return unwrapData(response)
  },
  async getApplication(id) {
    const response = await apiClient.get(`/admin/applications/${id}`)
    return unwrapData(response)
  },
  async verifyApplication(id, data) {
    const response = await apiClient.patch(`/admin/applications/${id}/verify`, data)
    return unwrapData(response)
  },
  async updateApplicationStatus(id, data) {
    const response = await apiClient.patch(`/admin/applications/${id}/status`, data)
    return unwrapData(response)
  },

  // ── Employees ─────────────────────────────────────────────
  async getEmployees(params = {}) {
    const response = await apiClient.get('/admin/employees', { params })
    return unwrapData(response)
  },
  async getEmployeeStats() {
    const response = await apiClient.get('/admin/employees/stats')
    return unwrapData(response)
  },
  async getEmployee(id) {
    const response = await apiClient.get(`/admin/employees/${id}`)
    return unwrapData(response)
  },
  async createEmployee(data) {
    const response = await apiClient.post('/admin/employees', data)
    return unwrapData(response)
  },
  async updateEmployee(id, data) {
    const response = await apiClient.put(`/admin/employees/${id}`, data)
    return unwrapData(response)
  },
  async deleteEmployee(id) {
    const response = await apiClient.delete(`/admin/employees/${id}`)
    return unwrapData(response)
  },

  // ── Roles ─────────────────────────────────────────────────
  async getRoles(params = {}) {
    const response = await apiClient.get('/admin/roles', { params })
    return unwrapData(response)
  },
  async getRole(id) {
    const response = await apiClient.get(`/admin/roles/${id}`)
    return unwrapData(response)
  },
  async createRole(data) {
    const response = await apiClient.post('/admin/roles', data)
    return unwrapData(response)
  },
  async updateRole(id, data) {
    const response = await apiClient.put(`/admin/roles/${id}`, data)
    return unwrapData(response)
  },
  async deleteRole(id) {
    const response = await apiClient.delete(`/admin/roles/${id}`)
    return unwrapData(response)
  },

  // ── Analytics ─────────────────────────────────────────────
  async getAnalyticsOverview() {
    const response = await apiClient.get('/admin/analytics/overview')
    return unwrapData(response)
  },
  async getAnalyticsFunnel() {
    const response = await apiClient.get('/admin/analytics/funnel')
    return unwrapData(response)
  },
  async getTopJobs(params = {}) {
    const response = await apiClient.get('/admin/analytics/top-jobs', { params })
    return unwrapData(response)
  },
  async getPaymentAnalytics() {
    const response = await apiClient.get('/admin/analytics/payments')
    return unwrapData(response)
  },
  async getDepartmentStats() {
    const response = await apiClient.get('/admin/analytics/departments')
    return unwrapData(response)
  },
  async getDemographics() {
    const response = await apiClient.get('/admin/analytics/demographics')
    return unwrapData(response)
  },

  // ── Support ───────────────────────────────────────────────
  async getSupportTickets(params = {}) {
    const response = await apiClient.get('/admin/support/tickets', { params })
    return unwrapData(response)
  },
  async getSupportStats() {
    const response = await apiClient.get('/admin/support/stats')
    return unwrapData(response)
  },
  async getSupportTicket(id) {
    const response = await apiClient.get(`/admin/support/tickets/${id}`)
    return unwrapData(response)
  },
  async updateSupportTicket(id, data) {
    const response = await apiClient.put(`/admin/support/tickets/${id}`, data)
    return unwrapData(response)
  },
  async replyToTicket(id, data) {
    const response = await apiClient.post(`/admin/support/tickets/${id}/reply`, data)
    return unwrapData(response)
  },

  // ── Payments ──────────────────────────────────────────────
  async getPayments(params = {}) {
    const response = await apiClient.get('/admin/payments', { params })
    return unwrapData(response)
  },
  async getPaymentStats() {
    const response = await apiClient.get('/admin/payments/stats')
    return unwrapData(response)
  },
  async getPaymentGateways() {
    const response = await apiClient.get('/admin/payment-gateways')
    return unwrapData(response)
  },
  async upsertPaymentGateway(name, data) {
    const response = await apiClient.put(`/admin/payment-gateways/${name}`, data)
    return unwrapData(response)
  },

  // ── Activity Logs ─────────────────────────────────────────
  async getActivityLogs(params = {}) {
    const response = await apiClient.get('/admin/activity-logs', { params })
    return unwrapData(response)
  },
}
