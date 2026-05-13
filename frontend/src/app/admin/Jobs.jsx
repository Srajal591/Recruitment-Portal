import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  FolderOpen,
  Calendar
} from 'lucide-react'

const Jobs = () => {
  const navigate = useNavigate()
  const [showProjectSelector, setShowProjectSelector] = useState(false)

  const stats = [
    {
      title: 'TOTAL JOBS',
      value: '1,847',
      icon: Briefcase,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'ACTIVE',
      value: '342',
      icon: Clock,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'COMPLETED',
      value: '1,456',
      icon: CheckCircle,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'TOTAL APPLICANTS',
      value: '4.2M',
      icon: Users,
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const projects = [
    {
      id: 1,
      name: 'Assistant Professor Recruitment 2024',
      department: 'Dept. of Higher Education',
      state: 'Bihar',
      totalJobs: 42,
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 2,
      name: 'Village Council Executive Officers',
      department: 'Panchayati Raj Dept.',
      state: 'Bihar',
      totalJobs: 1500,
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 3,
      name: 'Secondary Teacher Eligibility Test (STET)',
      department: 'BSEB Education Board',
      state: 'Bihar',
      totalJobs: 5400,
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800'
    }
  ]

  const jobs = [
    {
      position: 'Physics - Assistant Professor',
      id: 'AP-PHY-001',
      project: 'Assistant Professor Recruitment 2024',
      applicants: '3,450',
      status: 'RECEIVING',
      statusColor: 'bg-green-100 text-green-800',
      deadline: '15 Dec 2024'
    },
    {
      position: 'Chemistry - Assistant Professor',
      id: 'AP-CHE-002',
      project: 'Assistant Professor Recruitment 2024',
      applicants: '2,800',
      status: 'RECEIVING',
      statusColor: 'bg-green-100 text-green-800',
      deadline: '15 Dec 2024'
    },
    {
      position: 'Mathematics - Assistant Professor',
      id: 'AP-MAT-003',
      project: 'Assistant Professor Recruitment 2024',
      applicants: '4,200',
      status: 'VERIFICATION',
      statusColor: 'bg-yellow-100 text-yellow-800',
      deadline: '10 Dec 2024'
    },
    {
      position: 'Village Executive Officer',
      id: 'VEO-001',
      project: 'Village Council Executive Officers',
      applicants: '12,450',
      status: 'COMPLETED',
      statusColor: 'bg-blue-100 text-blue-800',
      deadline: '30 Nov 2024'
    }
  ]

  const handleCreateJob = () => {
    setShowProjectSelector(true)
  }

  const handleProjectSelect = (projectId) => {
    setShowProjectSelector(false)
    navigate(`/admin/jobs/create/basic-info?project=${projectId}`)
  }

  return (
    <AdminLayout title="Jobs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Jobs</h1>
            <p className="text-gray-600">Manage job postings and recruitment processes across all projects.</p>
          </div>
          <Button 
            onClick={handleCreateJob}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>All Projects</option>
                  <option>Assistant Professor Recruitment 2024</option>
                  <option>Village Council Executive Officers</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Status: All</option>
                  <option>Receiving</option>
                  <option>Verification</option>
                  <option>Completed</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Department: All</option>
                  <option>Education</option>
                  <option>Panchayati Raj</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>This Month</span>
                </div>
                <Button variant="ghost" size="sm" className="text-orange-600">
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      JOB POSITION
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PROJECT
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      APPLICANTS
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DEADLINE
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-800">{job.position}</div>
                          <div className="text-sm text-gray-500">ID: {job.id}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-800">{job.project}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-gray-800">{job.applicants}</span>
                      </td>
                      <td className="p-4">
                        <Badge className={`${job.statusColor} text-xs`}>
                          {job.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{job.deadline}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing 1 to 4 of 1,847 jobs
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                  1
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  2
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  3
                </Button>
                <span className="text-gray-500">...</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Selection Modal */}
        {showProjectSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Select Project</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowProjectSelector(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    onClick={() => handleProjectSelect(project.id)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FolderOpen className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{project.name}</h4>
                          <p className="text-sm text-gray-500">{project.department} • {project.state}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">{project.totalJobs}</div>
                        <div className="text-xs text-gray-500">Total Jobs</div>
                      </div>
                    </div>
                  </div>
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