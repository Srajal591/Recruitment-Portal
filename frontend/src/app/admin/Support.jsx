import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  Zap, 
  Search, 
  Plus, 
  LayoutGrid,
  Eye,
  Edit
} from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const Support = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('tickets')

  const stats = [
    {
      title: 'OPEN TICKETS',
      value: '45',
      change: '+12 today',
      color: 'border-l-red-500',
      icon: Ticket
    },
    {
      title: 'IN PROGRESS',
      value: '23',
      change: 'Active now',
      color: 'border-l-yellow-500',
      icon: Clock
    },
    {
      title: 'RESOLVED TODAY',
      value: '67',
      change: '+15% vs yesterday',
      color: 'border-l-green-500',
      icon: CheckCircle
    },
    {
      title: 'AVG RESPONSE TIME',
      value: '2.4h',
      change: 'Within SLA',
      color: 'border-l-blue-500',
      icon: Zap
    }
  ]

  const tickets = [
    {
      id: 'TKT-001',
      title: 'Login Issue - Cannot Access Portal',
      customer: 'Rajesh Kumar',
      email: 'rajesh.k@email.com',
      priority: 'High',
      status: 'Open',
      assignee: 'Support Team A',
      created: '2 hours ago',
      category: 'Technical'
    },
    {
      id: 'TKT-002',
      title: 'Payment Gateway Error',
      customer: 'Priya Singh',
      email: 'priya.s@email.com',
      priority: 'Critical',
      status: 'In Progress',
      assignee: 'Tech Support',
      created: '4 hours ago',
      category: 'Payment'
    },
    {
      id: 'TKT-003',
      title: 'Document Upload Failed',
      customer: 'Amit Sharma',
      email: 'amit.sharma@email.com',
      priority: 'Medium',
      status: 'Resolved',
      assignee: 'Support Team B',
      created: '1 day ago',
      category: 'Technical'
    },
    {
      id: 'TKT-004',
      title: 'Application Status Inquiry',
      customer: 'Sunita Devi',
      email: 'sunita.d@email.com',
      priority: 'Low',
      status: 'Open',
      assignee: 'Unassigned',
      created: '2 days ago',
      category: 'General'
    }
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Support Management</h1>
            <p className="text-gray-600">Manage support tickets and help requests</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/support/kanban')}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Kanban View
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
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
        <div className="border-b border-orange-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'tickets', label: 'All Tickets', count: tickets.length },
              { id: 'open', label: 'Open', count: tickets.filter(t => t.status === 'Open').length },
              { id: 'progress', label: 'In Progress', count: tickets.filter(t => t.status === 'In Progress').length },
              { id: 'resolved', label: 'Resolved', count: tickets.filter(t => t.status === 'Resolved').length }
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
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>All Categories</option>
                  <option>Technical</option>
                  <option>Payment</option>
                  <option>General</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>All Priorities</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>All Assignees</option>
                  <option>Support Team A</option>
                  <option>Support Team B</option>
                  <option>Tech Support</option>
                  <option>Unassigned</option>
                </select>
              </div>
              <Button variant="ghost" className="text-orange-600">
                Clear All
              </Button>
            </div>
          </div>
        </Card>

        {/* Tickets Table */}
        <Card className="bg-white">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">TICKET ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">TITLE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">CUSTOMER</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">PRIORITY</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">STATUS</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ASSIGNEE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">CREATED</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-orange-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-orange-600">{ticket.id}</div>
                        <div className="text-xs text-gray-500">{ticket.category}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{ticket.title}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{ticket.customer}</div>
                        <div className="text-sm text-gray-500">{ticket.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-800">{ticket.assignee}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-800">{ticket.created}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/support/ticket/${ticket.id}`)}
                            className="text-orange-600 hover:bg-orange-100"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:bg-gray-100"
                          >
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
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing 1-4 of 45 tickets
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button className="bg-orange-600 text-white" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <span className="text-gray-500">...</span>
                <Button variant="outline" size="sm">12</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default Support