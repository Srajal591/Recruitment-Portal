import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, BellOff, CheckCheck } from 'lucide-react'
import CandidateLayout from '../../components/layouts/CandidateLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { candidateService } from '../../services/candidate.service'
import toast from 'react-hot-toast'

const TYPE_COLORS = {
  application_update: 'bg-blue-100 text-blue-700',
  payment:            'bg-green-100 text-green-700',
  job_alert:          'bg-orange-100 text-orange-700',
  system:             'bg-gray-100 text-gray-700',
}

const Notifications = () => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['candidate-notifications'],
    queryFn: () => candidateService.getNotifications({ limit: 50 }),
  })

  const notifications = data?.notifications || []
  const unreadCount = data?.unreadCount || notifications.filter(n => !n.isRead).length

  const { mutate: markRead } = useMutation({
    mutationFn: candidateService.markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['candidate-notifications'] }),
  })

  const { mutate: markAllRead, isPending: markingAll } = useMutation({
    mutationFn: candidateService.markAllNotificationsRead,
    onSuccess: () => {
      toast.success('All notifications marked as read')
      queryClient.invalidateQueries({ queryKey: ['candidate-notifications'] })
    },
  })

  return (
    <CandidateLayout title="Notifications">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-orange-600">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={() => markAllRead()} disabled={markingAll}
              className="border-orange-200 text-orange-600">
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading && <div className="p-6 text-center text-gray-500">Loading notifications...</div>}
            {!isLoading && notifications.length === 0 && (
              <div className="p-8 text-center">
                <BellOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No notifications yet</p>
                <p className="text-gray-400 text-sm mt-1">You'll be notified about application updates here</p>
              </div>
            )}
            {notifications.map((n) => (
              <div key={n._id}
                onClick={() => !n.isRead && markRead(n._id)}
                className={`flex items-start gap-4 p-4 border-b border-gray-100 last:border-0 cursor-pointer transition-colors ${
                  n.isRead ? 'bg-white' : 'bg-orange-50 hover:bg-orange-100'
                }`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  n.isRead ? 'bg-gray-100' : 'bg-orange-100'
                }`}>
                  <Bell className={`w-4 h-4 ${n.isRead ? 'text-gray-400' : 'text-orange-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${n.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                      {n.title || n.message}
                    </p>
                    {!n.isRead && <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                  {n.message && n.title && (
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {n.type && (
                      <Badge className={`text-xs ${TYPE_COLORS[n.type] || TYPE_COLORS.system}`}>
                        {n.type.replace('_', ' ')}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-400">
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      }) : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </CandidateLayout>
  )
}

export default Notifications
