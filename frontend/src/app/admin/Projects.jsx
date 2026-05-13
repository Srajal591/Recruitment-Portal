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
  FolderOpen,
  Rocket,
  CheckCircle,
  Calendar
} from 'lucide-react'

const Projects = () => {
  const navigate = useNavigate()

  const stats = [
    {
      title: 'TOTAL PROJECTS',
      value: '128',
      icon: FolderOpen,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'ACTIVE',
      value: '42',
      icon: Rocket,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'COMPLETED',
      value: '76',
      icon: CheckCircle,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'UPCOMING',
      value: '10',
      icon: Calendar,
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const projects = [
    {
      name: 'Assistant Professor Recruitment 2024',
      department: 'Dept. of Higher Education',
      state: 'Bihar',
      totalJobs: 42,
      applicants: '12,450',
      revenue: '₹1.2 Cr',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800',
      duration: '6 Months',
      actions: ['view', 'edit']
    },
    {
      name: 'Village Council Executive Officers',
      department: 'Panchayati Raj Dept.',
      state: 'Bihar',
      totalJobs: 1500,
      applicants: '84,200',
      revenue: '₹8.4 Cr',
      status: 'Completed',
      statusColor: 'bg-blue-100 text-blue-800',
      duration: '12 Months',
      actions: ['view', 'edit']
    },
    {
      name: 'Health Services - Nurses Grade-A',
      department: 'Health Department',
      state: 'Bihar',
      totalJobs: 320,
      applicants: '--',
      revenue: '₹45 L',
      status: 'Upcoming',
      statusColor: 'bg-orange-100 text-orange-800',
      duration: '4 Months',
      actions: ['view', 'edit']
    },
    {
      name: 'Secondary Teacher Eligibility Test (STET)',
      department: 'BSEB Education Board',
      state: 'Bihar',
      totalJobs: 5400,
      applicants: '3,12,000',
      revenue: '₹14.2 Cr',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800',
      duration: '8 Months',
      actions: ['view', 'edit']
    }
  ]

  return (
    <AdminLayout title="Projects">
      <div className="p-6">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
            <p className="text-gray-600">Oversee and manage recruitment cycles across Bihar departments.</p>
          </div>
          <Button 
            onClick={() => navigate('/admin/projects/create')}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Project
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
                  <option>All States</option>
                  <option>Bihar</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Status: All</option>
                  <option>Active</option>
                  <option>Completed</option>
                  <option>Upcoming</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Department: All</option>
                  <option>Education</option>
                  <option>Health</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Jan 2024 - Jun 2024</span>
                </div>
                <Button variant="ghost" size="sm" className="text-orange-600">
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PROJECT NAME
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATE
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TOTAL JOBS
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      APPLICANTS
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      REVENUE
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DURATION
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-800">{project.name}</div>
                          <div className="text-sm text-gray-500">{project.department}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-800">{project.state}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-gray-800">{project.totalJobs}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-gray-800">{project.applicants}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-gray-800">{project.revenue}</span>
                      </td>
                      <td className="p-4">
                        <Badge className={`${project.statusColor} text-xs`}>
                          {project.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{project.duration}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/admin/projects/${index + 1}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
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
                Showing 1 to 4 of 128 projects
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
        </div>
      </div>
    </AdminLayout>
  )
}

export default Projects