import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import Button from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const SupportKanban = () => {
  const navigate = useNavigate()
  const [tickets] = useState({
    new: [
      {
        id: 'TKT-001',
        title: 'Login Issue',
        description: 'Unable to login with correct credentials',
        priority: 'high',
        assignee: 'Unassigned',
        createdAt: '2024-01-15',
        customer: 'John Doe'
      },
      {
        id: 'TKT-002',
        title: 'Payment Failed',
        description: 'Payment gateway showing error',
        priority: 'critical',
        assignee: 'Unassigned',
        createdAt: '2024-01-15',
        customer: 'Jane Smith'
      }
    ],
    inProgress: [
      {
        id: 'TKT-003',
        title: 'Document Upload Error',
        description: 'PDF files not uploading properly',
        priority: 'medium',
        assignee: 'Alice Johnson',
        createdAt: '2024-01-14',
        customer: 'Mike Wilson'
      }
    ],
    resolved: [
      {
        id: 'TKT-004',
        title: 'Profile Update Issue',
        description: 'Cannot update profile information',
        priority: 'low',
        assignee: 'Bob Brown',
        createdAt: '2024-01-13',
        customer: 'Sarah Davis',
        resolvedAt: '2024-01-15'
      }
    ],
    closed: [
      {
        id: 'TKT-005',
        title: 'Email Notification',
        description: 'Not receiving email notifications',
        priority: 'medium',
        assignee: 'Alice Johnson',
        createdAt: '2024-01-12',
        customer: 'Tom Anderson',
        resolvedAt: '2024-01-14',
        closedAt: '2024-01-15'
      }
    ]
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'danger'
      case 'high': return 'warning'
      case 'medium': return 'info'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const columns = [
    { id: 'new', title: 'New', color: 'bg-gray-50' },
    { id: 'inProgress', title: 'In Progress', color: 'bg-blue-50' },
    { id: 'resolved', title: 'Resolved', color: 'bg-green-50' },
    { id: 'closed', title: 'Closed', color: 'bg-gray-100' }
  ]

  const handleTicketClick = (ticketId) => {
    navigate(`/admin/support/ticket/${ticketId}`)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support Kanban</h1>
            <p className="text-gray-600">Manage support tickets with drag-and-drop interface</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/support')}
            >
              List View
            </Button>
            <Button>
              New Ticket
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className={`${column.color} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <Badge variant="secondary">
                  {tickets[column.id]?.length || 0}
                </Badge>
              </div>

              <div className="space-y-3">
                {tickets[column.id]?.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleTicketClick(ticket.id)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {ticket.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {ticket.id}
                          </p>
                        </div>
                        <Badge
                          variant={getPriorityColor(ticket.priority)}
                          size="sm"
                        >
                          {ticket.priority}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {ticket.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Customer:</span>
                          <span className="font-medium">{ticket.customer}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Assignee:</span>
                          <span className="font-medium">
                            {ticket.assignee === 'Unassigned' ? (
                              <Badge variant="outline" size="sm">Unassigned</Badge>
                            ) : (
                              ticket.assignee
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Created:</span>
                          <span>{ticket.createdAt}</span>
                        </div>

                        {ticket.resolvedAt && (
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Resolved:</span>
                            <span>{ticket.resolvedAt}</span>
                          </div>
                        )}

                        {ticket.closedAt && (
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Closed:</span>
                            <span>{ticket.closedAt}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {(!tickets[column.id] || tickets[column.id].length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No tickets in this column</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(tickets).flat().length}
              </p>
              <p className="text-sm text-gray-600">Total Tickets</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {tickets.inProgress?.length || 0}
              </p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {tickets.resolved?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Resolved Today</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {tickets.new?.filter(t => t.priority === 'critical').length || 0}
              </p>
              <p className="text-sm text-gray-600">Critical Issues</p>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default SupportKanban