import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FileText, 
  Eye, 
  CheckCircle, 
  X, 
  Search, 
  BarChart3, 
  Download, 
  Users,
  Mail,
  ClipboardList
} from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const Applications = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [filters, setFilters] = useState({
    status: 'All Status',
    job: 'All Jobs',
    department: 'All Departments'
  })

  const stats = [
    {
      title: 'TOTAL APPLICATIONS',
      value: '12,847',
      change: '+234 today',
      color: 'border-l-orange-500',
      icon: FileText
    },
    {
      title: 'UNDER REVIEW',
      value: '3,421',
      change: 'Pending action',
      color: 'border-l-yellow-500',
      icon: Eye
    },
    {
      title: 'APPROVED',
      value: '8,156',
      change: '+89 today',
      color: 'border-l-green-500',
      icon: CheckCircle
    },
    {
      title: 'REJECTED',
      value: '1,270',
      change: '9.9% rejection rate',
      color: 'border-l-red-500',
      icon: X
    }
  ]

  const applications = [
    {
      id: 'APP-2024-001',
      candidateName: 'Rajesh Kumar Singh',
      email: 'rajesh.kumar@email.com',
      phone: '+91 9876543210',
      jobTitle: 'Senior Administrative Officer',
      department: 'Public Administration',
      appliedDate: '2024-01-15',
      status: 'Under Review',
      score: '85%',
      documents: 'Complete',
      paymentStatus: 'Paid',
      avatar: 'RK'
    },
    {
      id: 'APP-2024-002',
      candidateName: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 9876543211',
      jobTitle: 'Junior Engineer',
      department: 'Public Works',
      appliedDate: '2024-01-14',
      status: 'Approved',
      score: '92%',
      documents: 'Complete',
      paymentStatus: 'Paid',
      avatar: 'PS'
    },
    {
      id: 'APP-2024-003',
      candidateName: 'Amit Verma',
      email: 'amit.verma@email.com',
      phone: '+91 9876543212',
      jobTitle: 'Medical Officer',
      department: 'Health & Family Welfare',
      appliedDate: '2024-01-13',
      status: 'Rejected',
      score: '67%',
      documents: 'Incomplete',
      paymentStatus: 'Paid',
      avatar: 'AV'
    },
    {
      id: 'APP-2024-004',
      candidateName: 'Sunita Devi',
      email: 'sunita.devi@email.com',
      phone: '+91 9876543213',
      jobTitle: 'Assistant Teacher',
      department: 'Education',
      appliedDate: '2024-01-12',
      status: 'Shortlisted',
      score: '88%',
      documents: 'Complete',
      paymentStatus: 'Paid',
      avatar: 'SD'
    },
    {
      id: 'APP-2024-005',
      candidateName: 'Vikash Kumar',
      email: 'vikash.kumar@email.com',
      phone: '+91 9876543214',
      jobTitle: 'Accounts Officer',
      department: 'Finance',
      appliedDate: '2024-01-11',
      status: 'Under Review',
      score: '79%',
      documents: 'Pending',
      paymentStatus: 'Paid',
      avatar: 'VK'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800'
      case 'Under Review': return 'bg-yellow-100 text-yellow-800'
      case 'Rejected': return 'bg-red-100 text-red-800'
      case 'Shortlisted': return 'bg-blue-100 text-blue-800'
      case 'Interview Scheduled': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDocumentStatus = (status) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-800'
      case 'Incomplete': return 'bg-red-100 text-red-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true
    if (activeTab === 'pending') return app.status === 'Under Review'
    if (activeTab === 'approved') return app.status === 'Approved'
    if (activeTab === 'rejected') return app.status === 'Rejected'
    return true
  })

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Applications Management</h1>
            <p className="text-gray-600">Review and manage candidate applications</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Bulk Actions
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Search className="w-4 h-4 mr-2" />
              Advanced Search
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className={`border-l-4 ${stat.color} bg-white`}>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-xs text-gray-600 mt-1">{stat.change}</p>
                    </div>
                    <IconComponent className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="border-b border-orange-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'all', label: 'All Applications', count: applications.length },
              { id: 'pending', label: 'Under Review', count: applications.filter(a => a.status === 'Under Review').length },
              { id: 'approved', label: 'Approved', count: applications.filter(a => a.status === 'Approved').length },
              { id: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'Rejected').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                <Badge className="bg-gray-100 text-gray-600">{tab.count}</Badge>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <Card className="bg-white mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>
                <select 
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>All Status</option>
                  <option>Under Review</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Shortlisted</option>
                </select>
                <select 
                  value={filters.job}
                  onChange={(e) => setFilters({...filters, job: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>All Jobs</option>
                  <option>Senior Administrative Officer</option>
                  <option>Junior Engineer</option>
                  <option>Medical Officer</option>
                  <option>Assistant Teacher</option>
                </select>
                <select 
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>All Departments</option>
                  <option>Public Administration</option>
                  <option>Public Works</option>
                  <option>Health & Family Welfare</option>
                  <option>Education</option>
                  <option>Finance</option>
                </select>
              </div>
              <Button variant="ghost" className="text-orange-600">
                Clear All
              </Button>
            </div>
          </div>
        </Card>

        {/* Applications Table */}
        <Card className="bg-white">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">CANDIDATE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">APPLICATION ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">JOB POSITION</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">DEPARTMENT</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">STATUS</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">SCORE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">DOCUMENTS</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">APPLIED DATE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-orange-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-medium text-sm text-orange-600">
                            {application.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{application.candidateName}</div>
                            <div className="text-sm text-gray-500">{application.email}</div>
                            <div className="text-xs text-gray-500">{application.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-orange-600">{application.id}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{application.jobTitle}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-800">{application.department}</div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{application.score}</div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getDocumentStatus(application.documents)}>
                          {application.documents}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-800">{application.appliedDate}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/applications/${application.id}`)}
                            className="text-orange-600 hover:bg-orange-100"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:bg-green-100"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-100"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing 1-5 of 12,847 applications
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button className="bg-orange-600 text-white" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <span className="text-gray-500">...</span>
                <Button variant="outline" size="sm">2570</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white">
            <div className="p-6 text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <h3 className="font-semibold text-gray-800 mb-2">Bulk Review</h3>
              <p className="text-sm text-gray-600 mb-4">Review multiple applications at once</p>
              <Button variant="outline" className="w-full border-orange-200 text-orange-600">
                Start Bulk Review
              </Button>
            </div>
          </Card>

          <Card className="bg-white">
            <div className="p-6 text-center">
              <Mail className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <h3 className="font-semibold text-gray-800 mb-2">Send Notifications</h3>
              <p className="text-sm text-gray-600 mb-4">Notify candidates about status updates</p>
              <Button variant="outline" className="w-full border-orange-200 text-orange-600">
                Send Notifications
              </Button>
            </div>
          </Card>

          <Card className="bg-white">
            <div className="p-6 text-center">
              <ClipboardList className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <h3 className="font-semibold text-gray-800 mb-2">Generate Reports</h3>
              <p className="text-sm text-gray-600 mb-4">Create detailed application reports</p>
              <Button variant="outline" className="w-full border-orange-200 text-orange-600">
                Generate Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Applications