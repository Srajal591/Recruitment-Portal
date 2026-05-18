import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  FileText, BarChart3, FolderOpen, Download, Calendar,
  Globe, ChevronLeft, ChevronRight, ArrowLeft, Loader2,
  Users, Shield,
} from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
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

const EmployeeActivityDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ module: '', action: '' })

  // Fetch employee info
  const { data: empData, isLoading: empLoading } = useQuery({
    queryKey: ['admin-employee', id],
    queryFn: () => adminService.getEmployee(id),
  })

  // Fetch activity logs for this employee
  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['admin-employee-activity', id, page, filters],
    queryFn: () => adminService.getActivityLogs({
      employeeId: id,
      page,
      limit: 20,
      ...(filters.module && { module: filters.module }),
      ...(filters.action && { action: filters.action }),
    }),
  })

  const employee = empData?.employee
  const logs = Array.isArray(logsData) ? logsData : (logsData?.logs || logsData?.activityLogs || [])
  const pagination = logsData?.pagination || {}
  const totalPages = pagination.totalPages || 1
  const totalItems = pagination.totalItems || logs.length

  // Action summary from logs
  const actionSummary = logs.reduce((acc, log) => {
    const key = log.action?.toUpperCase() || 'OTHER'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const handleExport = () => {
    const token = localStorage.getItem('rp_access_token')
    const params = new URLSearchParams({ employeeId: id })
    const url = `${API_BASE_URL}/admin/activity-logs/export?${params.toString()}`
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = `activity-${employee?.employeeId || id}.csv`
        a.click()
        URL.revokeObjectURL(blobUrl)
      })
  }

  const formatTime = (ts) => {
    if (!ts) return '—'
    return new Date(ts).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  if (empLoading) return (
    <AdminLayout title="Employee Activity">
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout title="Employee Activity">
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/employees')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Employee Activity & Details</h1>
              <p className="text-gray-500 text-sm">Full audit trail for this employee.</p>
            </div>
          </div>
          <Button onClick={handleExport} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Activity Data
          </Button>
        </div>

        {/* Employee Info Card */}
        {employee && (
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl font-bold text-orange-600">
                    {employee.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{employee.fullName}</h2>
                    <p className="text-gray-600">{employee.roleDesignation}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
                      <span className="font-mono">{employee.employeeId}</span>
                      <span>{employee.department}</span>
                      <span>{employee.officialEmail}</span>
                    </div>
                  </div>
                </div>
                <Badge className={employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {employee.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Actions', value: totalItems, icon: BarChart3, color: 'text-orange-600' },
            { label: 'Creates', value: actionSummary['CREATE'] || 0, icon: FileText, color: 'text-green-600' },
            { label: 'Updates', value: actionSummary['UPDATE'] || 0, icon: Shield, color: 'text-blue-600' },
            { label: 'Deletes', value: actionSummary['DELETE'] || 0, icon: Users, color: 'text-red-600' },
          ].map(s => (
            <Card key={s.label} className="bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{Number(s.value).toLocaleString('en-IN')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters + Table */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-800">Activity Audit Log</h3>
              </div>
              <div className="flex items-center gap-3">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={filters.module}
                  onChange={(e) => { setFilters(f => ({ ...f, module: e.target.value })); setPage(1) }}
                >
                  <option value="">All Modules</option>
                  <option value="Jobs">Jobs</option>
                  <option value="Applications">Applications</option>
                  <option value="Employees">Employees</option>
                  <option value="Roles">Roles</option>
                  <option value="Projects">Projects</option>
                  <option value="Support">Support</option>
                  <option value="Payments">Payments</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={filters.action}
                  onChange={(e) => { setFilters(f => ({ ...f, action: e.target.value })); setPage(1) }}
                >
                  <option value="">All Actions</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                  <option value="LOGIN">Login</option>
                  <option value="LOGOUT">Logout</option>
                  <option value="PUBLISH">Publish</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Date & Time', 'Action', 'Module', 'Details', 'IP Address'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logsLoading && (
                    <tr><td colSpan="5" className="py-8 text-center text-gray-500">Loading activity logs...</td></tr>
                  )}
                  {!logsLoading && logs.length === 0 && (
                    <tr><td colSpan="5" className="py-8 text-center text-gray-500">No activity logs found for this employee.</td></tr>
                  )}
                  {logs.map((log) => (
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
                        <Badge className={ACTION_COLORS[log.action?.toUpperCase()] || 'bg-gray-100 text-gray-800'}>
                          {log.action?.toUpperCase() || '—'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                            <FolderOpen className="w-3 h-3 text-orange-600" />
                          </div>
                          <span className="text-sm text-gray-800">{log.module || '—'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate" title={log.details || log.description}>
                          {log.details || log.description || '—'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                          <Globe className="w-3 h-3" />
                          {log.ipAddress || '—'}
                        </div>
                      </td>
                    </tr>
                  ))}
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default EmployeeActivityDetails
