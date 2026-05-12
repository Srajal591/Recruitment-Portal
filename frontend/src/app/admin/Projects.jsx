import { useState } from 'react'
import { Plus, Filter, Calendar, Eye, Edit, MoreHorizontal } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { formatCurrency, formatNumber } from '../../lib/utils'

const Projects = () => {
  const [projects] = useState([
    {
      id: 1,
      name: 'Assistant Professor Recruitment 2024',
      department: 'Dept. of Higher Education',
      state: 'Bihar',
      totalJobs: 42,
      applicants: 12450,
      revenue: 120000000,
      status: 'ACTIVE',
      duration: '6 Months',
      statusColor: 'success'
    },
    {
      id: 2,
      name: 'Village Council Executive Officers',
      department: 'Panchayati Raj Dept.',
      state: 'Bihar',
      totalJobs: 1500,
      applicants: 84200,
      revenue: 1840000000,
      status: 'COMPLETED',
      duration: '12 Months',
      statusColor: 'info'
    },
    {
      id: 3,
      name: 'Health Services - Nurses Grade-A',
      department: 'Health Department',
      state: 'Bihar',
      totalJobs: 320,
      applicants: null,
      revenue: 4500000,
      status: 'UPCOMING',
      duration: '4 Months',
      statusColor: 'warning'
    },
    {
      id: 4,
      name: 'Secondary Teacher Eligibility Test (STET)',
      department: 'BSEB Education Board',
      state: 'Bihar',
      totalJobs: 5400,
      applicants: 3120000,
      revenue: 1420000000,
      status: 'ACTIVE',
      duration: '8 Months',
      statusColor: 'success'
    }
  ])

  const stats = [
    {
      label: 'TOTAL PROJECTS',
      value: '128',
      icon: '📊',
      color: 'blue'
    },
    {
      label: 'ACTIVE',
      value: '42',
      icon: '🚀',
      color: 'green'
    },
    {
      label: 'COMPLETED',
      value: '76',
      icon: '✅',
      color: 'purple'
    },
    {
      label: 'UPCOMING',
      value: '10',
      icon: '📅',
      color: 'orange'
    }
  ]

  const getStatusBadge = (status) => {
    const variants = {
      ACTIVE: 'success',
      COMPLETED: 'info',
      UPCOMING: 'warning'
    }
    return <Badge variant={variants[status]}>● {status}</Badge>
  }

  return (
    <AdminLayout title="Projects">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-2">Projects</h1>
            <p className="text-text-secondary">
              Oversee and manage recruitment cycles across Bihar departments.
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                    <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
                  </div>
                  <div className="text-2xl">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">All States</span>
                <Button variant="outline" size="sm">Status: All</Button>
                <Button variant="outline" size="sm">Department: All</Button>
              </div>
              
              <div className="flex items-center space-x-2 ml-auto">
                <Calendar className="w-4 h-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">Jan 2024 - Jun 2024</span>
                <Button variant="outline" size="sm">Reset Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium text-text-secondary text-sm">PROJECT NAME</th>
                    <th className="text-left p-4 font-medium text-text-secondary text-sm">STATE</th>
                    <th className="text-left p-4 font-medium text-text-secondary text-sm">TOTAL JOBS</th>
                    <th className="text-left p-4 font-medium text-text-secondary text-sm">APPLICANTS</th>
                    <th className="text-left p-4 font-medium text-text-secondary text-sm">REVENUE</th>
                    <th className="text-left p-4 font-medium text-text-secondary text-sm">STATUS</th>
                    <th className="text-left p-4 font-medium text-text-secondary text-sm">DURATION</th>
                    <th className="text-left p-4 font-medium text-text-secondary text-sm">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b border-border hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-text-primary">{project.name}</div>
                          <div className="text-sm text-text-secondary">{project.department}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-text-primary">{project.state}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-text-primary font-medium">{formatNumber(project.totalJobs)}</span>
                      </td>
                      <td className="p-4">
                        {project.applicants ? (
                          <div>
                            <div className="font-medium text-text-primary">{formatNumber(project.applicants)}</div>
                            <div className="text-xs text-green-600">↗ +14%</div>
                          </div>
                        ) : (
                          <span className="text-text-secondary">--</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-text-primary">{formatCurrency(project.revenue)}</span>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="p-4">
                        <span className="text-text-primary">{project.duration}</span>
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
            <div className="flex items-center justify-between p-4 border-t border-border">
              <div className="text-sm text-text-secondary">
                Showing 1 to 4 of 128 projects
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="primary" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <span className="text-text-secondary">...</span>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default Projects