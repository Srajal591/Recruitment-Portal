import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Plus, Eye, Edit, Briefcase, Users, CheckCircle, Clock,
  FolderOpen, Trash2, Send, XCircle,
} from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { jobService } from '../../services/job.service'
import { adminService } from '../../services/admin.service'

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-700',
  active: 'bg-green-100 text-green-800',
  closed: 'bg-red-100 text-red-800',
  published: 'bg-green-100 text-green-800',
}

const Jobs = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showProjectSelector, setShowProjectSelector] = useState(false)

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: () => jobService.getAdminJobs({ limit: 50 }),
  })
  const { data: statsData } = useQuery({
    queryKey: ['admin-job-stats'],
    queryFn: jobService.getAdminJobStats,
  })
  const { data: projectsData } = useQuery({
    queryKey: ['admin-projects-for-job-create'],
    queryFn: () => adminService.getProjects({ limit: 50 }),
  })

  const { mutate: publishJob } = useMutation({
    mutationFn: adminService.publishJob,
    onSuccess: () => {
      toast.success('Job published successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['admin-job-stats'] })
    },
    onError: (err) => toast.error(err.message || 'Failed to publish job'),
  })

  const { mutate: closeJob } = useMutation({
    mutationFn: adminService.closeJob,
    onSuccess: () => {
      toast.success('Job closed')
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['admin-job-stats'] })
    },
    onError: (err) => toast.error(err.message || 'Failed to close job'),
  })

  const { mutate: deleteJob } = useMutation({
    mutationFn: adminService.deleteJob,
    onSuccess: () => {
      toast.success('Job deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['admin-job-stats'] })
    },
    onError: (err) => toast.error(err.message || 'Failed to delete job'),
  })

  const handleDelete = (job) => {
    if (window.confirm(`Delete "${job.title}"? This cannot be undone.`)) {
      deleteJob(job._id)
    }
  }

  const handlePublish = (job) => {
    if (window.confirm(`Publish "${job.title}"? It will be visible to all candidates.`)) {
      publishJob(job._id)
    }
  }

  const handleClose = (job) => {
    if (window.confirm(`Close "${job.title}"? No new applications will be accepted.`)) {
      closeJob(job._id)
    }
  }

  const jobs = jobsData?.jobs || []
  const projects = projectsData?.projects || []
  const statusStats = statsData?.statusStats || []
  const countByStatus = (status) => statusStats.find((item) => item._id === status)?.count || 0
  const totalApplicants = jobs.reduce((sum, job) => sum + (job.totalApplicants || 0), 0)

  const stats = [
    { title: 'TOTAL JOBS', value: jobsData?.pagination?.totalItems || jobs.length, icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
    { title: 'ACTIVE', value: countByStatus('active') || countByStatus('published'), icon: Clock, color: 'bg-green-100 text-green-600' },
    { title: 'DRAFT', value: countByStatus('draft'), icon: Edit, color: 'bg-yellow-100 text-yellow-600' },
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

        {/* Stats */}
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

        {/* Table */}
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
                  {isLoading && <tr><td colSpan="6" className="p-6 text-gray-600">Loading jobs...</td></tr>}
                  {!isLoading && jobs.length === 0 && <tr><td colSpan="6" className="p-6 text-gray-600">No jobs found. Create your first job.</td></tr>}
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-orange-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-800">{job.title}</div>
                        <div className="text-xs text-gray-500 font-mono">{job.postCode}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-700">{job.projectId?.name || '—'}</td>
                      <td className="p-4 text-sm font-semibold text-gray-800">{job.totalApplicants || 0}</td>
                      <td className="p-4">
                        <Badge className={STATUS_COLORS[job.status] || 'bg-gray-100 text-gray-700'}>
                          {job.status?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {job.applicationDeadline
                          ? new Date(job.applicationDeadline).toLocaleDateString('en-IN')
                          : '—'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {/* View */}
                          <button
                            onClick={() => navigate(`/jobs/${job._id}`)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Job"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Publish — only for draft */}
                          {(job.status === 'draft' || job.status === 'Draft') && (
                            <button
                              onClick={() => handlePublish(job)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Publish Job"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}

                          {/* Close — only for active/published */}
                          {(job.status === 'active' || job.status === 'published') && (
                            <button
                              onClick={() => handleClose(job)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Close Job"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(job)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Project Selector Modal */}
        {showProjectSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Select Project</h3>
                  <p className="text-sm text-gray-500 mt-1">Choose a project to associate this job with.</p>
                </div>
                <button
                  onClick={() => setShowProjectSelector(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                {projects.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-3">No projects available.</p>
                    <Button
                      onClick={() => { setShowProjectSelector(false); navigate('/admin/projects/create') }}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Create a Project First
                    </Button>
                  </div>
                )}
                {projects.map((project) => (
                  <button
                    type="button"
                    key={project._id}
                    onClick={() => handleProjectSelect(project._id)}
                    className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{project.name}</h4>
                        <p className="text-sm text-gray-500">{project.department} • {project.state}</p>
                      </div>
                      <Badge className={project.status === 'Active' ? 'bg-green-100 text-green-800 ml-auto' : 'bg-gray-100 text-gray-700 ml-auto'}>
                        {project.status}
                      </Badge>
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
