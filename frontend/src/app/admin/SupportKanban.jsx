import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { LayoutList, Loader2 } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import Button from '../../components/ui/Button'
import { Card, CardContent } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-orange-100 text-orange-800',
  Critical: 'bg-red-100 text-red-800',
}

const COLUMNS = [
  { id: 'Open',        label: 'Open',        color: 'bg-red-50 border-red-200',    dot: 'bg-red-500' },
  { id: 'In Progress', label: 'In Progress', color: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  { id: 'Resolved',    label: 'Resolved',    color: 'bg-green-50 border-green-200',  dot: 'bg-green-500' },
  { id: 'Closed',      label: 'Closed',      color: 'bg-gray-50 border-gray-200',    dot: 'bg-gray-400' },
]

const SupportKanban = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch all tickets (high limit to show all in kanban)
  const { data, isLoading } = useQuery({
    queryKey: ['admin-support-tickets-kanban'],
    queryFn: () => adminService.getSupportTickets({ limit: 100 }),
  })

  const { data: statsData } = useQuery({
    queryKey: ['admin-support-stats'],
    queryFn: adminService.getSupportStats,
  })

  const { mutate: updateTicket } = useMutation({
    mutationFn: ({ id, status }) => adminService.updateSupportTicket(id, { status }),
    onSuccess: () => {
      toast.success('Ticket status updated')
      queryClient.invalidateQueries({ queryKey: ['admin-support-tickets-kanban'] })
      queryClient.invalidateQueries({ queryKey: ['admin-support-stats'] })
    },
    onError: (err) => toast.error(err.message || 'Failed to update ticket'),
  })

  const allTickets = data?.tickets || []
  const rawStats = statsData || {}
  const statusStats = rawStats.statusStats || []
  const countByStatusName = (name) => statusStats.find(s => s._id === name)?.count || 0
  const stats = {
    open: countByStatusName('Open'),
    inProgress: countByStatusName('In Progress'),
    resolved: countByStatusName('Resolved'),
    closed: countByStatusName('Closed'),
  }

  // Group tickets by status
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = allTickets.filter(t =>
      (t.status || '').toLowerCase() === col.id.toLowerCase() ||
      t.status === col.id
    )
    return acc
  }, {})

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'

  return (
    <AdminLayout title="Support Kanban">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support Kanban</h1>
            <p className="text-gray-600 text-sm">Drag-free kanban view of all support tickets.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/support')}>
            <LayoutList className="w-4 h-4 mr-2" />
            List View
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Open', value: stats.open || grouped['Open']?.length || 0, color: 'text-red-600' },
            { label: 'In Progress', value: stats.inProgress || grouped['In Progress']?.length || 0, color: 'text-yellow-600' },
            { label: 'Resolved', value: stats.resolved || grouped['Resolved']?.length || 0, color: 'text-green-600' },
            { label: 'Closed', value: stats.closed || grouped['Closed']?.length || 0, color: 'text-gray-600' },
          ].map(s => (
            <Card key={s.label} className="bg-white">
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Kanban Board */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLUMNS.map((col) => {
              const colTickets = grouped[col.id] || []
              return (
                <div key={col.id} className={`rounded-xl border p-4 ${col.color}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                      <h3 className="font-semibold text-gray-800 text-sm">{col.label}</h3>
                    </div>
                    <span className="text-xs font-bold text-gray-600 bg-white rounded-full px-2 py-0.5 border">
                      {colTickets.length}
                    </span>
                  </div>

                  <div className="space-y-3 min-h-[200px]">
                    {colTickets.length === 0 && (
                      <div className="text-center py-8 text-gray-400 text-sm">No tickets</div>
                    )}
                    {colTickets.map((ticket) => (
                      <div
                        key={ticket._id}
                        onClick={() => navigate(`/admin/support/ticket/${ticket._id}`)}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
                            {ticket.subject || ticket.title}
                          </p>
                          <Badge className={`${PRIORITY_COLORS[ticket.priority] || 'bg-gray-100 text-gray-800'} text-xs flex-shrink-0`}>
                            {ticket.priority}
                          </Badge>
                        </div>

                        <p className="text-xs text-orange-600 font-mono mb-2">{ticket.ticketId}</p>

                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                          {ticket.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{ticket.raisedBy?.fullName || ticket.candidateId?.fullName || 'Candidate'}</span>
                          <span>{formatDate(ticket.createdAt)}</span>
                        </div>

                        {/* Quick status change */}
                        <div className="mt-3 pt-3 border-t border-gray-100 flex gap-1 flex-wrap">
                          {COLUMNS.filter(c => c.id !== col.id).map(c => (
                            <button
                              key={c.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                updateTicket({ id: ticket._id, status: c.id })
                              }}
                              className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            >
                              → {c.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default SupportKanban
