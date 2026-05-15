import { apiClient, unwrapData } from '../api/client'

export const dashboardService = {
  async adminDashboard() {
    const [overview, funnel, topJobs, support] = await Promise.allSettled([
      apiClient.get('/admin/analytics/overview'),
      apiClient.get('/admin/analytics/funnel'),
      apiClient.get('/admin/analytics/top-jobs', { params: { limit: 5 } }),
      apiClient.get('/admin/support/stats'),
    ])

    return {
      overview: overview.status === 'fulfilled' ? unwrapData(overview.value) : null,
      funnel: funnel.status === 'fulfilled' ? unwrapData(funnel.value) : null,
      topJobs: topJobs.status === 'fulfilled' ? unwrapData(topJobs.value)?.topJobs || [] : [],
      support: support.status === 'fulfilled' ? unwrapData(support.value) : null,
    }
  },

  async candidateDashboard() {
    const [applications, notifications, tickets, jobs] = await Promise.allSettled([
      apiClient.get('/candidate/applications', { params: { limit: 5 } }),
      apiClient.get('/candidate/notifications', { params: { limit: 5 } }),
      apiClient.get('/candidate/support/tickets', { params: { limit: 5 } }),
      apiClient.get('/jobs', { params: { limit: 5 } }),
    ])

    return {
      applications: applications.status === 'fulfilled' ? unwrapData(applications.value) : [],
      notifications: notifications.status === 'fulfilled' ? unwrapData(notifications.value) : null,
      tickets: tickets.status === 'fulfilled' ? unwrapData(tickets.value) : [],
      jobs: jobs.status === 'fulfilled' ? unwrapData(jobs.value)?.jobs || [] : [],
      meta: applications.status === 'fulfilled' ? applications.value?.meta : null,
    }
  },
}
