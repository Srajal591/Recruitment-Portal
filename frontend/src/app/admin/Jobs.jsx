import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Eye, Edit, Briefcase, Users, CheckCircle, Clock, FolderOpen } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { jobService } from '../../services/job.service'
import { adminService } from '../../services/admin.service'

const Jobs = () => {
  const navigate = useNavigate()
  const [showProjectSelector, setShowProjectSelector] = useState(false)

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: () => jobService.getAdminJobs({ limit: 20 }),
  })
  const { data: statsData } = useQuery({
    queryKey: ['admin-job-stats'],
    queryFn: jobService.getAdminJobStats,
  })
  const { data: projectsData } = useQuery({
    queryKey: ['admin-projects-for-job-create'],
    queryFn: () => adminService.getProjects({ limit: 20 }),
  })

  const jobs = jobsData?.jobs || []
  const projects = projectsData?.projects || []
  const statusStats = statsData?.statusStats || []
  const countByStatus = (status) => statusStats.find((item) => item._id === status)?.count || 0
  const totalApplicants = jobs.reduce((sum, job) => sum + (job.totalApplicants || 0), 0)

  const stats = [
    { title: 'TOTAL JOBS', value: jobsData?.pagination?.totalItems || jobs.length, icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
    { title: 'ACTIVE', value: countByStatus('active'), icon: Clock, color: 'bg-green-100 text-green-600' },
    { title: 'CLOSED', value: countByStatus('closed'), icon: CheckCircle, color: 'bg-purple-100 text-purple-600' },
    { title: 'TOTAL APPLICANTS', value: totalApplicants, icon: Users, color: 'bg-orange-100 text-orange-600' },
  ]

  const handleProjectSelect = (projectId) => {
    setShowProjectSelector(false)
    navigate(`/admin/jobs/create/basic-info?project=${projectId}`)
  }

  return (
    <AdminLayout title="Jobs">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Jobs</h1>
            <p className="text-gray-600">Manage job postings from the recruitment service.</p>
          </div>
          <Button onClick={() => setShowProjectSelector(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Job
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{Number(stat.value || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Job Position</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Project</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Applicants</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Deadline</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading && (
                    <tr><td colSpan="6" className="p-6 text-gray-600">Loading jobs...</td></tr>
                  )}
                  {!isLoading && jobs.length === 0 && (
                    <tr><td colSpan="6" className="p-6 text-gray-600">No jobs found.</td></tr>
                  )}
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-800">{job.title}</div>
                        <div className="text-sm text-gray-500">ID: {job.postCode}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-800">{job.projectId?.name || 'No project'}</td>
                      <td className="p-4 text-sm font-medium text-gray-800">{job.totalApplicants || 0}</td>
                      <td className="p-4">
                        <Badge className={job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {job.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('en-IN') : 'Not set'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${job._id}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/jobs/create/basic-info?job=${job._id}`)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {showProjectSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Select Project</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowProjectSelector(false)}>x</Button>
              </div>
              <div className="space-y-4">
                {projects.length === 0 && <div className="p-4 text-gray-600">No projects available. Create a project first.</div>}
                {projects.map((project) => (
                  <button
                    type="button"
                    key={project._id}
                    onClick={() => handleProjectSelect(project._id)}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{project.name}</h4>
                        <p className="text-sm text-gray-500">{project.department} • {project.state}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Jobs
