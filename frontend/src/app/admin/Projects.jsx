import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Plus, Eye, Edit, FolderOpen, Rocket, CheckCircle, Calendar, Trash2 } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const Projects = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => adminService.getProjects({ limit: 50 }),
  })
  const { data: statsData } = useQuery({
    queryKey: ['admin-project-stats'],
    queryFn: adminService.getProjectStats,
  })

  const { mutate: deleteProject } = useMutation({
    mutationFn: adminService.deleteProject,
    onSuccess: () => {
      toast.success('Project deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
      queryClient.invalidateQueries({ queryKey: ['admin-project-stats'] })
    },
    onError: (err) => toast.error(err.message || 'Failed to delete project'),
  })

  const handleDelete = (project) => {
    if (window.confirm(`Delete project "${project.name}"? All associated jobs will be unlinked. This cannot be undone.`)) {
      deleteProject(project._id)
    }
  }

  const projects = data?.projects || []
  const stats = [
    { title: 'TOTAL PROJECTS', value: data?.pagination?.totalItems || projects.length, icon: FolderOpen, color: 'bg-blue-100 text-blue-600' },
    { title: 'ACTIVE', value: statsData?.activeProjects || projects.filter((p) => p.status === 'Active').length, icon: Rocket, color: 'bg-green-100 text-green-600' },
    { title: 'COMPLETED', value: projects.filter((p) => p.status === 'Completed').length, icon: CheckCircle, color: 'bg-purple-100 text-purple-600' },
    { title: 'UPCOMING', value: projects.filter((p) => p.status === 'Upcoming').length, icon: Calendar, color: 'bg-orange-100 text-orange-600' },
  ]

  return (
    <AdminLayout title="Projects">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
            <p className="text-gray-600">Manage recruitment projects and drives.</p>
          </div>
          <Button onClick={() => navigate('/admin/projects/create')} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
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
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Project Name</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">State</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Start</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">End</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading && <tr><td colSpan="7" className="p-6 text-gray-600">Loading projects...</td></tr>}
                  {!isLoading && projects.length === 0 && (
                    <tr><td colSpan="7" className="p-6 text-gray-600">No projects found. Create your first project.</td></tr>
                  )}
                  {projects.map((project) => (
                    <tr key={project._id} className="hover:bg-orange-50 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-gray-800">{project.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{project.description || 'No description'}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-700">{project.state}</td>
                      <td className="p-4 text-sm text-gray-700">{project.department}</td>
                      <td className="p-4">
                        <Badge className={
                          project.status === 'Active' ? 'bg-green-100 text-green-800' :
                          project.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {project.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {project.endDate ? new Date(project.endDate).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/admin/projects/${project._id}`)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Project"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/projects/${project._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Project"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Project"
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
      </div>
    </AdminLayout>
  )
}

export default Projects
