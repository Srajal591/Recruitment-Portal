import { useQuery } from '@tanstack/react-query'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import { adminService } from '../../services/admin.service'

const Analytics = () => {
  const { data: overviewData } = useQuery({
    queryKey: ['admin-analytics-overview'],
    queryFn: adminService.getAnalyticsOverview,
  })
  const { data: funnelData } = useQuery({
    queryKey: ['admin-analytics-funnel'],
    queryFn: adminService.getAnalyticsFunnel,
  })
  const { data: topJobsData } = useQuery({
    queryKey: ['admin-analytics-top-jobs'],
    queryFn: () => adminService.getTopJobs({ limit: 5 }),
  })
  const { data: supportData } = useQuery({
    queryKey: ['admin-support-stats'],
    queryFn: adminService.getSupportStats,
  })

  const overview = overviewData?.overview || {}
  const appsByStatus = overviewData?.applicationsByStatus || []
  const funnel = funnelData?.funnel || {}
  const topJobs = topJobsData?.topJobs || []
  const support = supportData || {}

  const countByStatus = (s) => appsByStatus.find(x => x._id === s)?.count || 0

  const mainStats = [
    { title: 'TOTAL APPLICATIONS', value: (overview.totalApplications || 0).toLocaleString('en-IN'), color: 'border-l-orange-500' },
    { title: 'VERIFIED', value: countByStatus('verified').toLocaleString('en-IN'), color: 'border-l-green-500' },
    { title: 'UNDER REVIEW', value: countByStatus('under_review').toLocaleString('en-IN'), color: 'border-l-yellow-500' },
    { title: 'TOTAL CANDIDATES', value: (overview.totalCandidates || 0).toLocaleString('en-IN'), color: 'border-l-blue-500' },
  ]

  const funnelStages = [
    ['STARTED', funnel.started],
    ['PERSONAL', funnel.personalDetailsCompleted],
    ['EDUCATION', funnel.educationCompleted],
    ['DOCUMENTS', funnel.documentsUploaded],
    ['PAID', funnel.paymentCompleted],
    ['SUBMITTED', funnel.submitted],
  ]

  const maxFunnel = Math.max(...funnelStages.map(([, v]) => v || 0), 1)

  return (
    <AdminLayout title="Analytics">
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Overview</h1>
          <p className="text-gray-600">Live recruitment metrics from backend services.</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((stat) => (
            <Card key={stat.title} className={`border-l-4 ${stat.color} bg-white`}>
              <div className="p-6">
                <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'ACTIVE JOBS', value: overview.totalJobs || 0, color: 'text-orange-600' },
            { title: 'REJECTED', value: countByStatus('rejected'), color: 'text-red-600' },
            { title: 'SUPPORT OPEN', value: support.open || 0, color: 'text-yellow-600' },
            { title: 'SUPPORT RESOLVED', value: support.resolved || 0, color: 'text-green-600' },
          ].map((s) => (
            <Card key={s.title} className="bg-white">
              <div className="p-6 text-center">
                <div className="text-xs font-medium text-gray-500 mb-1">{s.title}</div>
                <div className={`text-2xl font-bold ${s.color}`}>{Number(s.value).toLocaleString('en-IN')}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Conversion Funnel */}
        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Application Conversion Funnel</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {funnelStages.map(([label, value], i) => {
                const pct = maxFunnel > 0 ? Math.round(((value || 0) / maxFunnel) * 100) : 0
                return (
                  <div key={label} className={`rounded-lg p-4 text-center ${i === funnelStages.length - 1 ? 'bg-gray-900 text-white' : 'bg-orange-50 text-gray-800'}`}>
                    <div className="font-bold text-lg">{(value || 0).toLocaleString('en-IN')}</div>
                    <div className="text-[10px] font-bold tracking-wide mt-1">{label}</div>
                    <div className="text-[10px] mt-1 opacity-70">{pct}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Jobs */}
          <Card className="bg-white">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Jobs by Applicants</h3>
              {topJobs.length === 0 && <p className="text-sm text-gray-500">No data yet.</p>}
              <div className="space-y-4">
                {topJobs.map((job, i) => {
                  const maxApps = topJobs[0]?.totalApplications || 1
                  const pct = Math.round(((job.totalApplications || 0) / maxApps) * 100)
                  return (
                    <div key={job._id || i}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium text-sm text-gray-800 truncate max-w-[200px]">{job.jobTitle || job.title}</div>
                        <div className="text-sm font-bold text-gray-800 ml-2">{(job.totalApplications || 0).toLocaleString('en-IN')}</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Support Snapshot */}
          <Card className="bg-white">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Support Snapshot</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{support.open || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">OPEN</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{support.inProgress || support.pending || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">IN PROGRESS</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{support.resolved || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">RESOLVED</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <div className="text-sm text-gray-500">Total Tickets</div>
                <div className="text-xl font-bold text-gray-800">{support.total || 0}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Analytics
