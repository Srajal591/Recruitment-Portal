import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Bell, Briefcase, Clock, Download, Eye, FileText, Plus } from 'lucide-react'
import CandidateLayout from '../../components/layouts/CandidateLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { dashboardService } from '../../services/dashboard.service'
import { getStoredUser } from '../../services/auth.service'

const CandidateDashboard = () => {
  const user = getStoredUser()
  const { data, isLoading } = useQuery({
    queryKey: ['candidate-dashboard'],
    queryFn: dashboardService.candidateDashboard,
  })

  const applications = data?.applications || []
  const jobs = data?.jobs || []
  const notifications = data?.notifications?.notifications || []
  const unreadCount = data?.notifications?.unreadCount || 0
  const submittedCount = applications.filter((app) => app.status !== 'draft').length
  const draftCount = applications.filter((app) => app.status === 'draft').length

  return (
    <CandidateLayout title="Candidate Dashboard">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome, {user?.fullName || user?.email || 'Candidate'}</h1>
              <p className="text-orange-100">Track applications, active jobs, and recruitment notifications.</p>
            </div>
            <Button asChild className="bg-white text-orange-600 hover:bg-orange-50">
              <Link to="/jobs">
                <Plus className="w-4 h-4 mr-2" />
                Apply for New Job
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Stat icon={FileText} label="Applications" value={applications.length} />
          <Stat icon={Clock} label="Drafts" value={draftCount} />
          <Stat icon={Briefcase} label="Submitted" value={submittedCount} />
          <Stat icon={Bell} label="Unread Alerts" value={unreadCount} />
        </div>

        {isLoading && <Card><CardContent className="p-6">Loading dashboard...</CardContent></Card>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">My Applications</h3>
                  <p className="text-sm text-orange-600">Latest records from backend</p>
                </div>
                <Button asChild variant="outline" size="sm" className="border-orange-200 text-orange-600">
                  <Link to="/candidate/applications">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!isLoading && applications.length === 0 && (
                <div className="rounded-lg border border-orange-100 bg-orange-50 p-4 text-sm text-orange-700">
                  You have not started any applications yet.
                </div>
              )}
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application._id} className="flex items-center justify-between p-4 border border-orange-100 rounded-lg hover:bg-orange-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{application.jobId?.title || 'Application'}</div>
                        <div className="text-sm text-orange-600">{application.jobId?.department || 'Department pending'}</div>
                        <div className="text-xs text-gray-500">{application.applicationId}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge variant={application.status === 'submitted' ? 'success' : 'warning'}>
                          {application.status}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {application.createdAt ? new Date(application.createdAt).toLocaleDateString('en-IN') : ''}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-100">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-800">Active Jobs</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {jobs.length === 0 && <p className="text-sm text-gray-600">No active jobs available.</p>}
                {jobs.slice(0, 3).map((job) => (
                  <Link key={job._id} to={`/jobs/${job._id}`} className="block p-3 bg-orange-50 rounded-lg hover:bg-orange-100">
                    <div className="font-medium text-gray-800 text-sm">{job.title}</div>
                    <div className="text-xs text-orange-600">{job.department}</div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.length === 0 && <p className="text-sm text-gray-600">No notifications yet.</p>}
                {notifications.slice(0, 4).map((notification) => (
                  <div key={notification._id} className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-medium text-gray-800 text-sm">{notification.title || notification.message}</div>
                    {notification.message && <div className="text-xs text-gray-600 mt-1">{notification.message}</div>}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-800">Admit Cards</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800 text-sm">Available after verification</div>
                    <div className="text-xs text-gray-500">Backend record dependent</div>
                  </div>
                  <Button size="sm" disabled className="bg-orange-600 hover:bg-orange-700">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CandidateLayout>
  )
}

const Stat = ({ icon: Icon, label, value }) => (
  <Card>
    <CardContent className="p-5 flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-orange-600">{label}</div>
      </div>
      <Icon className="w-6 h-6 text-orange-500" />
    </CardContent>
  </Card>
)

export default CandidateDashboard
