import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Eye, Edit, BarChart3, HeadphonesIcon, FileText, Loader2 } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-project', id],
    queryFn: () => adminService.getProject(id),
  })

  const project = data?.project || data

  if (isLoading) return (
    <AdminLayout title="Project Details">
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    </AdminLayout>
  )

  if (!project) return (
    <AdminLayout title="Project Details">
      <div className="p-6">
        <p className="text-gray-600">Project not found.</p>
        <Button variant="outline" onClick={() => navigate('/admin/projects')} className="mt-4">Back to Projects</Button>
      </div>
    </AdminLayout>
  )

  const jobs = project.jobs || []

  const statCards = [
    { title: 'TOTAL JOBS', value: project.totalJobs || jobs.length, color: 'text-blue-600' },
    { title: 'TOTAL APPLICANTS', value: (project.totalApplicants || 0).toLocaleString('en-IN'), color: 'text-green-600' },
    { title: 'PAID APPLICANTS', value: (project.paidApplicants || 0).toLocaleString('en-IN'), color: 'text-orange-600' },
    { title: 'REVENUE', value: `₹${(project.totalRevenue || 0).toLocaleString('en-IN')}`, color: 'text-purple-600' },
  ]

  const quickActions = [
    { title: 'CREATE JOB', icon: Plus, color: 'bg-orange-100 text-orange-600', action: () => navigate(`/admin/jobs/create?project=${id}`) },
    { title: 'VIEW APPS', icon: Eye, color: 'bg-blue-100 text-blue-600', action: () => navigate('/admin/applications') },
    { title: 'ANALYTICS', icon: BarChart3, color: 'bg-green-100 text-green-600', action: () => navigate('/admin/analytics') },
    { title: 'SUPPORT', icon: HeadphonesIcon, color: 'bg-purple-100 text-purple-600', action: () => navigate('/admin/support') },
  ]

  return (
    <AdminLayout title="Project Details">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={project.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {project.status?.toUpperCase()}
              </Badge>
              {project.startDate && project.endDate && (
                <span className="text-sm text-gray-500">
                  {new Date(project.startDate).toLocaleDateString('en-IN')} – {new Date(project.endDate).toLocaleDateString('en-IN')}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-gray-600">{project.state} | {project.department}</p>
            {project.description && <p className="text-gray-500 text-sm mt-1">{project.description}</p>}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/admin/projects')}>Back</Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Edit className="w-4 h-4 mr-2" />Edit Project
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((s) => (
            <Card key={s.title} className="bg-white">
              <CardContent className="p-6">
                <p className="text-xs font-medium text-gray-500 mb-1">{s.title}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jobs List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Job Positions ({jobs.length})</h3>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => navigate(`/admin/jobs/create?project=${id}`)}>
                    <Plus className="w-4 h-4 mr-1" />Add Job
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {jobs.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p className="text-sm">No jobs created yet.</p>
                    <Button size="sm" className="mt-3 bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => navigate(`/admin/jobs/create?project=${id}`)}>
                      Create First Job
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {jobs.map((job) => (
                      <div key={job._id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{job.title}</p>
                            <p className="text-xs text-gray-500">{job.postCode}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold text-gray-800 text-sm">{job.totalApplicants || 0}</p>
                            <p className="text-xs text-gray-500">applicants</p>
                          </div>
                          <Badge className={job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {job.status}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${job._id}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-800">Quick Actions</h3></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <button key={action.title} onClick={action.action}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                      <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                        <action.icon className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-medium text-gray-700">{action.title}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><h3 className="font-semibold text-gray-800">Project Info</h3></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">State</span>
                  <span className="font-medium text-gray-800">{project.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Department</span>
                  <span className="font-medium text-gray-800">{project.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium text-gray-800">{project.status}</span>
                </div>
                {project.startDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start</span>
                    <span className="font-medium text-gray-800">{new Date(project.startDate).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
                {project.endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">End</span>
                    <span className="font-medium text-gray-800">{new Date(project.endDate).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Created by</span>
                  <span className="font-medium text-gray-800">{project.createdBy?.fullName || '—'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ProjectDetails
