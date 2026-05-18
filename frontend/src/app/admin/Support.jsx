import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Ticket, Clock, CheckCircle, Zap, Search, LayoutGrid, Eye } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const PRIORITY_COLORS = {
  urgent: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
}
const STATUS_COLORS = {
  open: 'bg-red-100 text-red-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
}

const Support = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')

  const status = activeTab === 'all' ? undefined : activeTab

  const { data, isLoading } = useQuery({
    queryKey: ['admin-support-tickets', status],
    queryFn: () => adminService.getSupportTickets({ status, limit: 20 }),
  })
  const { data: statsData } = useQuery({
    queryKey: ['admin-support-stats'],
    queryFn: adminService.getSupportStats,
  })

  const tickets = data?.tickets || []
  const rawStats = statsData || {}
  const statusStats = rawStats.statusStats || []
  const countByStatusName = (name) => statusStats.find(s => s._id === name)?.count || 0
  const stats = {
    open: countByStatusName('Open'),
    inProgress: countByStatusName('In Progress'),
    resolved: countByStatusName('Resolved'),
    closed: countByStatusName('Closed'),
    total: statusStats.reduce((sum, s) => sum + (s.count || 0), 0),
  }
  const total = data?.pagination?.totalItems || stats.total || tickets.length

  const statCards = [
    { title: 'OPEN TICKETS', value: stats.open || 0, color: 'border-l-red-500', icon: Ticket },
    { title: 'IN PROGRESS', value: stats.inProgress || 0, color: 'border-l-yellow-500', icon: Clock },
    { title: 'RESOLVED', value: stats.resolved || 0, color: 'border-l-green-500', icon: CheckCircle },
    { title: 'TOTAL', value: stats.total || total, color: 'border-l-blue-500', icon: Zap },
  ]

  const tabs = [
    { id: 'all', label: 'All', count: stats.total || total },
    { id: 'open', label: 'Open', count: stats.open || 0 },
    { id: 'in_progress', label: 'In Progress', count: stats.inProgress || 0 },
    { id: 'resolved', label: 'Resolved', count: stats.resolved || 0 },
  ]

  const filtered = search
    ? tickets.filter(t =>
        t.subject?.toLowerCase().includes(search.toLowerCase()) ||
        t.ticketId?.toLowerCase().includes(search.toLowerCase())
      )
    : tickets

  return (
    <AdminLayout title="Support">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Support Management</h1>
            <p className="text-gray-600">Manage support tickets from candidates.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/support/kanban')}>
            <LayoutGrid className="w-4 h-4 mr-2" />Kanban View
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((s) => (
            <Card key={s.title} className={`border-l-4 ${s.color} bg-white`}>
              <div className="p-6 flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">{s.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{Number(s.value).toLocaleString('en-IN')}</p>
                </div>
                <s.icon className="w-6 h-6 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-orange-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'
                }`}>
                <span>{tab.label}</span>
                <Badge className="bg-gray-100 text-gray-600">{tab.count}</Badge>
              </button>
            ))}
          </nav>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search tickets..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <Card className="bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Ticket ID', 'Subject', 'Candidate', 'Category', 'Priority', 'Status', 'Created', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && <tr><td colSpan="8" className="py-6 px-4 text-gray-600">Loading tickets...</td></tr>}
                {!isLoading && filtered.length === 0 && <tr><td colSpan="8" className="py-6 px-4 text-gray-600">No tickets found.</td></tr>}
                {filtered.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-orange-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-orange-600 text-sm">{ticket.ticketId}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800 text-sm max-w-[200px] truncate">{ticket.subject}</div>
                      <div className="text-xs text-gray-500">{ticket.category}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-800">{ticket.candidateId?.fullName || ticket.candidateId?.email || '—'}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 capitalize">{ticket.category || '—'}</td>
                    <td className="py-4 px-4">
                      <Badge className={PRIORITY_COLORS[ticket.priority] || 'bg-gray-100 text-gray-800'}>
                        {ticket.priority || 'medium'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={STATUS_COLORS[ticket.status] || 'bg-gray-100 text-gray-800'}>
                        {ticket.status?.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/support/ticket/${ticket._id}`)}
                        className="text-orange-600 hover:bg-orange-100">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default Support
