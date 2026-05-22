import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Bell, Trash2, Archive, CheckCircle, AlertCircle, Info,
  Clock, Filter, Search, Loader2,
} from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

// Mock notifications data
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of ₹500 received from candidate Raj Kumar for job application',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
    icon: '💳',
  },
  {
    id: 2,
    type: 'application',
    title: 'New Application Submitted',
    message: 'Priya Singh submitted application for Assistant Professor position',
    timestamp: new Date(Date.now() - 15 * 60000),
    read: false,
    icon: '📝',
  },
  {
    id: 3,
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance completed successfully',
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: true,
    icon: '⚙️',
  },
  {
    id: 4,
    type: 'job',
    title: 'Job Posted Successfully',
    message: 'Senior Lecturer - Physics job has been published',
    timestamp: new Date(Date.now() - 24 * 3600000),
    read: true,
    icon: '📢',
  },
  {
    id: 5,
    type: 'alert',
    title: 'High Application Volume',
    message: 'Received 150+ applications for Physics position in last 24 hours',
    timestamp: new Date(Date.now() - 48 * 3600000),
    read: true,
    icon: '⚠️',
  },
]

const AdminNotifications = () => {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState('all') // all, unread, payment, application, system, job, alert
  const [searchTerm, setSearchTerm] = useState('')
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' || (filter === 'unread' ? !n.read : n.type === filter)
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         n.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Mark as read
  const handleMarkAsRead = (id) => {
    setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif))
  }

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(n => n.map(notif => ({ ...notif, read: true })))
    toast.success('All notifications marked as read')
  }

  // Delete notification
  const handleDelete = (id) => {
    setNotifications(n => n.filter(notif => notif.id !== id))
    toast.success('Notification deleted')
  }

  // Archive notification
  const handleArchive = (id) => {
    setNotifications(n => n.filter(notif => notif.id !== id))
    toast.success('Notification archived')
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getTypeColor = (type) => {
    const colors = {
      payment: 'bg-green-100 text-green-700',
      application: 'bg-blue-100 text-blue-700',
      system: 'bg-gray-100 text-gray-700',
      job: 'bg-purple-100 text-purple-700',
      alert: 'bg-red-100 text-red-700',
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  const getTypeIcon = (type) => {
    const icons = {
      payment: '💳',
      application: '📝',
      system: '⚙️',
      job: '📢',
      alert: '⚠️',
    }
    return icons[type] || '📌'
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <AdminLayout title="Notifications">
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-500 text-sm mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="text-sm"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
              { id: 'application', label: 'Applications', count: notifications.filter(n => n.type === 'application').length },
              { id: 'job', label: 'Jobs', count: notifications.filter(n => n.type === 'job').length },
              { id: 'alert', label: 'Alerts', count: notifications.filter(n => n.type === 'alert').length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === tab.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label} {tab.count > 0 && <span className="ml-1">({tab.count})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No notifications</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? 'Try adjusting your search' : 'You\'re all caught up!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all ${
                  notification.read
                    ? 'bg-white border-gray-200 hover:border-gray-300'
                    : 'bg-orange-50 border-orange-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${getTypeColor(notification.type)}`}>
                    {notification.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                        <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>

                      {/* Type Badge */}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getTypeColor(notification.type)}`}>
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleArchive(notification.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminNotifications
