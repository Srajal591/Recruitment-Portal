import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  FileText, Briefcase, Settings, Headphones, Users,
  ChevronLeft, ChevronRight, Download, Filter,
} from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'
import { API_BASE_URL } from '../../api/config'

const ACTION_COLORS = {
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  DELETE: 'bg-red-100 text-red-800',
  VIEW: 'bg-gray-100 text-gray-800',
  DOWNLOAD: 'bg-purple-100 text-purple-800',
  LOGIN: 'bg-orange-100 text-orange-800',
  LOGOUT: 'bg-yellow-100 text-yellow-800',
  PUBLISH: 'bg-teal-100 text-teal-800',
  APPROVE: 'bg-green-100 text-green-800',
  REJECT: 'bg-red-100 text-red-800',
}

const MODULE_ICONS = {
  Jobs: Briefcase,
  Applications: FileText,
  Employees: Users,
  Settings: Settings,
  Support: Headphones,
}

const ActivityLogs = () => {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    module: '',
    action: '',
    startDate: '',
    endDate: '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-activity-logs', page, filters],
    queryFn: () => adminService.getActivityLogs({
      page,
      limit: 20,
      ...(filters.module && { module: filters.module }),
      ...(filters.action && { action: filters.action }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
    }),
  })

  // Backend returns logs array directly in data field (not nested)
  const logs = Array.isArray(data) ? data : (data?.logs || data?.activityLogs || [])
  const pagination = data?.pagination || {}
  const totalPages = pagination.totalPages || 1
  const totalItems = pagination.totalItems || pagination.total || logs.length

  const handleFilterChange = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }))
    setPage(1)
  }

  const handleExport = () => {
    const token = localStorage.getItem('accessToken')
    const params = new URLSearchParams({
      ...(filters.module && { module: filters.module }),
      ...(filters.action && { action: filters.action }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
    })
    // Open export URL in new tab — browser will download the CSV
    const url = `${API_BASE_URL}/admin/activity-logs/export?${params.toString()}`
    const a = document.createElement('a')
    a.href = url
    a.setAttribute('download', `activity-logs-${Date.now()}.csv`)
    // Add auth header via fetch instead
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob)
        a.href = blobUrl
        a.click()
        URL.revokeObjectURL(blobUrl)
      })
      .catch(() => window.open(url, '_blank'))
  }

  const clearFilters = () => {
    setFilters({ module: '', action: '', startDate: '', endDate: '' })
    setPage(1)
  }

  const hasFilters = filters.module || filters.action || filters.startDate || filters.endDate

  return (
    <AdminLayout title="Activity Logs">
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Activity Logs</h1>
            <p className="text-gray-600">System audit trail — all employee actions recorded.</p>
          </div>
          <Button
            onClick={handleExport}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-white">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-orange-600 hover:underline ml-2">
                  Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                value={filters.module}
                onChange={(e) => handleFilterChange('module', e.target.value)}
              >
                <option value="">All Modules</option>
                <option value="Jobs">Jobs</option>
                <option value="Applications">Applications</option>
                <option value="Employees">Employees</option>
                <option value="Roles">Roles</option>
                <option value="Projects">Projects</option>
                <option value="Support">Support</option>
                <option value="Payments">Payments</option>
                <option value="Analytics">Analytics</option>
                <option value="Settings">Settings</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
              >
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="VIEW">View</option>
                <option value="DOWNLOAD">Download</option>
                <option value="LOGIN">Login</option>
                <option value="LOGOUT">Logout</option>
                <option value="PUBLISH">Publish</option>
                <option value="APPROVE">Approve</option>
                <option value="REJECT">Reject</option>
              </select>

              <div>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  placeholder="Start date"
                />
              </div>

              <div>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  placeholder="End date"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date & Time', 'Employee', 'Action', 'Module', 'Details', 'IP Address'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr><td colSpan="6" className="py-8 px-4 text-center text-gray-500">Loading activity logs...</td></tr>
                )}
                {!isLoading && logs.length === 0 && (
                  <tr><td colSpan="6" className="py-8 px-4 text-center text-gray-500">No activity logs found.</td></tr>
                )}
                {logs.map((log) => {
                  const ModuleIcon = MODULE_ICONS[log.module] || FileText
                  const actionKey = log.action?.toUpperCase()
                  return (
                    <tr key={log._id} className="hover:bg-orange-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-gray-800">
                          {log.createdAt ? new Date(log.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.createdAt ? new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-600 flex-shrink-0">
                            {(log.employeeId?.fullName || '?')[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              {log.employeeId?.fullName || 'System'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {log.employeeId?.employeeId || log.employeeId?.department || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={ACTION_COLORS[actionKey] || 'bg-gray-100 text-gray-800'}>
                          {actionKey || '—'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                            <ModuleIcon className="w-3 h-3 text-orange-600" />
                          </div>
                          <span className="text-sm text-gray-800">{log.module || '—'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate" title={log.details || log.description}>
                          {log.details || log.description || '—'}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-500 font-mono">
                        {log.ipAddress || '—'}
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
              Showing {logs.length} of {Number(totalItems).toLocaleString('en-IN')} entries
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-700 px-2">Page {page} of {totalPages}</span>
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
