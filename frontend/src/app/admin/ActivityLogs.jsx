import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, Download, FileText, Briefcase, Settings, Headphones, ChevronLeft, ChevronRight } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const ACTION_COLORS = {
  create: 'bg-green-100 text-green-800',
  update: 'bg-blue-100 text-blue-800',
  delete: 'bg-red-100 text-red-800',
  view: 'bg-gray-100 text-gray-800',
  download: 'bg-purple-100 text-purple-800',
  login: 'bg-orange-100 text-orange-800',
  logout: 'bg-yellow-100 text-yellow-800',
}

const MODULE_ICONS = {
  jobs: Briefcase,
  applications: FileText,
  settings: Settings,
  support: Headphones,
}

const ActivityLogs = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ module: '', action: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-activity-logs', page, filters],
    queryFn: () => adminService.getActivityLogs({
      page,
      limit: 20,
      ...(filters.module && { module: filters.module }),
      ...(filters.action && { action: filters.action }),
    }),
  })

  const logs = data?.logs || data?.activityLogs || []
  const pagination = data?.pagination || data?.meta || {}
  const totalPages = pagination.totalPages || 1
  const totalItems = pagination.totalItems || pagination.total || logs.length

  return (
    <AdminLayout title="Activity Logs">
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Activity Logs</h1>
            <p className="text-gray-600">System audit & compliance tracking.</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              value={filters.module} onChange={(e) => { setFilters(f => ({ ...f, module: e.target.value })); setPage(1) }}>
              <option value="">All Modules</option>
              <option value="jobs">Jobs</option>
              <option value="applications">Applications</option>
              <option value="employees">Employees</option>
              <option value="roles">Roles</option>
              <option value="projects">Projects</option>
              <option value="support">Support</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              value={filters.action} onChange={(e) => { setFilters(f => ({ ...f, action: e.target.value })); setPage(1) }}>
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="view">View</option>
              <option value="login">Login</option>
            </select>
          </div>
        </div>

        <Card className="bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date & Time', 'Employee', 'Action', 'Module', 'Details'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && <tr><td colSpan="5" className="py-6 px-4 text-gray-600">Loading activity logs...</td></tr>}
                {!isLoading && logs.length === 0 && (
                  <tr><td colSpan="5" className="py-6 px-4 text-gray-600">No activity logs found.</td></tr>
                )}
                {logs.map((log) => {
                  const ModuleIcon = MODULE_ICONS[log.module?.toLowerCase()] || FileText
                  return (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-gray-800">
                          {log.createdAt ? new Date(log.createdAt).toLocaleDateString('en-IN') : '—'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.createdAt ? new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-600">
                            {(log.employeeId?.fullName || log.performedBy?.fullName || '?')[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              {log.employeeId?.fullName || log.performedBy?.fullName || 'System'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {log.employeeId?.employeeId || log.performedBy?.employeeId || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={ACTION_COLORS[log.action?.toLowerCase()] || 'bg-gray-100 text-gray-800'}>
                          {log.action?.toUpperCase() || '—'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                            <ModuleIcon className="w-3 h-3 text-orange-600" />
                          </div>
                          <span className="text-sm text-gray-800 capitalize">{log.module || '—'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-800 max-w-xs truncate">{log.description || log.details || '—'}</div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {logs.length} of {totalItems.toLocaleString('en-IN')} entries
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default ActivityLogs
