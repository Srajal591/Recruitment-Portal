import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, BarChart3, Briefcase, CheckCircle, FileText, Plus, Users } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { dashboardService } from '../../services/dashboard.service'

const Dashboard = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: dashboardService.adminDashboard,
  })

  const overview = data?.overview?.overview || {}
  const applicationsByStatus = data?.overview?.applicationsByStatus || []
  const recentApplications = data?.overview?.recentApplications || []
  const funnel = data?.funnel?.funnel || {}
  const topJobs = data?.topJobs || []
  const rawSupport = data?.support || {}
  const supportStatusStats = rawSupport.statusStats || []
  const countSupportByStatus = (name) => supportStatusStats.find(s => s._id === name)?.count || 0
  const support = {
    open: countSupportByStatus('Open'),
    pending: countSupportByStatus('In Progress'),
    resolved: countSupportByStatus('Resolved'),
  }
  const submitted = applicationsByStatus.find((item) => item._id === 'submitted')?.count || 0

  const stats = [
    { title: 'ACTIVE JOBS', value: overview.totalJobs || 0, icon: Briefcase, color: 'border-l-orange-500' },
    { title: 'APPLICATIONS', value: overview.totalApplications || 0, icon: FileText, color: 'border-l-blue-500' },
    { title: 'CANDIDATES', value: overview.totalCandidates || 0, icon: Users, color: 'border-l-green-500' },
    { title: 'SUBMITTED', value: submitted, icon: CheckCircle, color: 'border-l-yellow-500' },
  ]

  const funnelItems = [
    ['STARTED', funnel.started],
    ['PERSONAL', funnel.personalDetailsCompleted],
    ['EDUCATION', funnel.educationCompleted],
    ['DOCUMENTS', funnel.documentsUploaded],
    ['PAID', funnel.paymentCompleted],
    ['SUBMITTED', funnel.submitted],
  ]

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard Overview</h1>
            <p className="text-gray-600">Live recruitment metrics from backend services.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/admin/jobs/create')} className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Job
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/applications">View Applications</Link>
            </Button>
          </div>
        </div>

        {isLoading && <Card><CardContent className="p-6">Loading dashboard...</CardContent></Card>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className={`border-l-4 ${stat.color} bg-white`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value.toLocaleString('en-IN')}</p>
                  </div>
                  <stat.icon className="w-5 h-5 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Candidate Conversion Funnel</h3>
                <BarChart3 className="w-5 h-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {funnelItems.map(([label, value], index) => (
                  <div key={label} className={`rounded-lg p-4 text-center ${index === funnelItems.length - 1 ? 'bg-gray-900 text-white' : 'bg-orange-50 text-gray-800'}`}>
                    <div className="font-bold text-lg">{(value || 0).toLocaleString('en-IN')}</div>
                    <div className="text-[10px] font-bold tracking-wide mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Support Snapshot</h3>
                <Badge variant="warning">LIVE</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600">{support.open || 0}</div>
                  <div className="text-xs text-gray-500">OPEN</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{support.pending || 0}</div>
                  <div className="text-xs text-gray-500">PENDING</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{support.resolved || 0}</div>
                  <div className="text-xs text-gray-500">RESOLVED</div>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link to="/admin/support">Open Support Center</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-800">Top Job Performance</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {topJobs.length === 0 && <p className="text-sm text-gray-600">No submitted applications yet.</p>}
              {topJobs.map((job) => (
                <div key={job._id || job.postCode} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                  <div>
                    <h4 className="font-medium text-sm text-gray-800">{job.jobTitle}</h4>
                    <p className="text-xs text-gray-500">{job.department} • {job.postCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">{job.totalApplications || 0}</p>
                    <p className="text-xs text-gray-500">APPLICANTS</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-800">Recent Applications</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentApplications.length === 0 && <p className="text-sm text-gray-600">No recent applications.</p>}
              {recentApplications.map((application) => (
                <div key={application._id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-800">{application.applicationId}</h4>
                    <p className="text-xs text-gray-600">{application.jobId?.title || 'Job'} • {application.candidateId?.email || 'Candidate'}</p>
                    <p className="text-xs text-gray-500 mt-1">{application.status}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {!isLoading && !data?.overview && (
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4 flex gap-3 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              Dashboard APIs did not return data. Confirm backend services are running and the logged-in role has analytics permissions.
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}

export default Dashboard
