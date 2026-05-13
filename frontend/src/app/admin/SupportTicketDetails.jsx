import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Link, MessageSquare, Clock, User, Mail, Phone, Paperclip } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import Button from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'

const SupportTicketDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [newMessage, setNewMessage] = useState('')
  const [ticket] = useState({
    id: id,
    title: 'Login Issue',
    description: 'Unable to login with correct credentials. Getting error message "Invalid credentials" even with correct username and password.',
    status: 'new',
    priority: 'high',
    category: 'Technical',
    assignee: 'Unassigned',
    customer: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 9876543210',
      userId: 'USR-001'
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    messages: [
      {
        id: 1,
        sender: 'John Doe',
        senderType: 'customer',
        message: 'I am unable to login to my account. I have tried multiple times with the correct credentials but keep getting an error.',
        timestamp: '2024-01-15T10:30:00Z',
        attachments: []
      },
      {
        id: 2,
        sender: 'Support Team',
        senderType: 'agent',
        message: 'Thank you for contacting us. We have received your ticket and are looking into the issue. Can you please provide your registered email address?',
        timestamp: '2024-01-15T11:15:00Z',
        attachments: []
      },
      {
        id: 3,
        sender: 'John Doe',
        senderType: 'customer',
        message: 'My registered email is john.doe@email.com. I have been trying to login since yesterday.',
        timestamp: '2024-01-15T14:20:00Z',
        attachments: [
          { name: 'screenshot.png', size: '245 KB' }
        ]
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'info'
      case 'inProgress': return 'warning'
      case 'resolved': return 'success'
      case 'closed': return 'secondary'
      default: return 'secondary'
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage)
      setNewMessage('')
      // API call to send message
    }
  }

  const handleStatusChange = (newStatus) => {
    console.log('Changing status to:', newStatus)
    // API call to update status
  }

  const handleAssignTicket = () => {
    console.log('Assigning ticket')
    // Open assignment modal or dropdown
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ticket Details</h1>
            <p className="text-gray-600">Ticket ID: {ticket.id}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/support')}
          >
            Back to Support
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Header */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{ticket.title}</h2>
                    <p className="text-gray-600 mt-2">{ticket.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority.toUpperCase()}
                    </Badge>
                    <Badge variant={getStatusColor(ticket.status)}>
                      {ticket.status.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category</span>
                    <p className="text-gray-900">{ticket.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Created</span>
                    <p className="text-gray-900">{formatTimestamp(ticket.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Last Updated</span>
                    <p className="text-gray-900">{formatTimestamp(ticket.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Messages */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {ticket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.senderType === 'agent'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {message.sender}
                        </span>
                        <span className={`text-xs ${
                          message.senderType === 'agent' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                      {message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center space-x-2 text-xs">
                              <Paperclip className="w-3 h-3 text-gray-400" />
                              <span>{attachment.name}</span>
                              <span className="text-gray-400">({attachment.size})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <div className="mt-6 pt-4 border-t">
                <div className="space-y-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      Attach File
                    </Button>
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name</span>
                  <p className="text-gray-900">{ticket.customer.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email</span>
                  <p className="text-gray-900">{ticket.customer.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Phone</span>
                  <p className="text-gray-900">{ticket.customer.phone}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">User ID</span>
                  <p className="text-gray-900">{ticket.customer.userId}</p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Status
                  </label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="new">New</option>
                    <option value="inProgress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To
                  </label>
                  <select
                    value={ticket.assignee}
                    onChange={(e) => console.log('Assigning to:', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Unassigned">Unassigned</option>
                    <option value="Alice Johnson">Alice Johnson</option>
                    <option value="Bob Brown">Bob Brown</option>
                    <option value="Carol White">Carol White</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={ticket.priority}
                    onChange={(e) => console.log('Changing priority to:', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Escalate Ticket
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Create Internal Note
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Link className="w-4 h-4 mr-2" />
                  Link Related Ticket
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  View Customer History
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default SupportTicketDetails