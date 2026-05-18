import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  FileText, Eye, CheckCircle, X, Search, Download,
  ChevronLeft, ChevronRight, Filter, Loader2,
} from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-green-100 text-green-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

const PAYMENT_COLORS = {
  paid: 'bg-green-100 text-green-800',
  success: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
  initiated: 'bg-blue-100 text-blue-800',
}

const Applications = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState([])
  const [bulkAction, setBulkAction] = useState('')
  const [showBulkConfirm, setShowBulkConfirm] = useState(false)

  const status = activeTab === 'all' ? undefined : activeTab

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications', status, search, page],
    queryFn: () => adminService.getApplications({
      status,
      limit: 20,
      page,
      ...(search && { search }),
    }),
  })

  const { data: statsData } = useQuery({
    queryKey: ['admin-application-stats'],
    queryFn: adminService.getApplicationStats,
  })

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, status, notes }) => adminService.updateApplicationStatus(id, { status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] })
      queryClient.invalidateQueries({ queryKey: ['admin-application-stats'] })
    },
    onError: (err) => toast.error(err.message || 'Failed to update'),
  })

  const applications = data?.applications || []
  const pagination = data?.pagination || {}
  const totalPages = pagination.totalPages || 1
  const totalItems = pagination.totalItems || applications.length

  const statusStats = statsData?.statusStats || []
  const countByStatus = (key) => statusStats.find((item) => item._id === key)?.count || 0
  const total = totalItems || statsData?.totalApplications || applications.length

  const stats = [
    { title: 'TOTAL', value: total, color: 'border-l-orange-500', icon: FileText },
    { title: 'UNDER REVIEW', value: countByStatus('under_review'), color: 'border-l-yellow-500', icon: Eye },
    { title: 'VERIFIED', value: countByStatus('verified') + countByStatus('approved'), color: 'border-l-green-500', icon: CheckCircle },
    { title: 'REJECTED', value: countByStatus('rejected'), color: 'border-l-red-500', icon: X },
  ]

  const tabs = [
    { id: 'all', label: 'All', count: total },
    { id: 'submitted', label: 'Submitted', count: countByStatus('submitted') },
    { id: 'under_review', label: 'Under Review', count: countByStatus('under_review') },
    { id: 'verified', label: 'Verified', count: countByStatus('verified') },
    { id: 'rejected', label: 'Rejected', count: countByStatus('rejected') },
  ]

  // Selection helpers
  const allSelected = applications.length > 0 && selected.length === applications.length
  const toggleAll = () => setSelected(allSelected ? [] : applications.map(a => a._id))
  const toggleOne = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleBulkApply = async () => {
    if (!bulkAction || selected.length === 0) return
    const newStatus = bulkAction === 'approve' ? 'verified' : 'rejected'
    let done = 0
    for (const id of selected) {
      await new Promise(resolve => {
        updateStatus({ id, status: newStatus }, { onSettled: resolve })
      })
      done++
    }
    toast.success(`${done} application(s) ${newStatus}`)
    setSelected([])
    setBulkAction('')
    setShowBulkConfirm(false)
  }

  const handleExport = () => {
    toast.success('Export started — check your downloads')
    // In production: trigger CSV download via API
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setPage(1)
    setSelected([])
  }

  const handleSearch = (val) => {
    setSearch(val)
    setPage(1)
    setSelected([])
  }

  return (
    <AdminLayout title="Applications">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Applications Management</h1>
            <p className="text-gray-600 text-sm">Review and manage candidate applications.</p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className={`border-l-4 ${stat.color} bg-white`}>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{Number(stat.value || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <stat.icon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-orange-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <Badge className="bg-gray-100 text-gray-600 text-xs">{tab.count}</Badge>
              </button>
            ))}
          </nav>
        </div>

        {/* Search + Bulk Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or application ID..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {selected.length > 0 && (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
              <span className="text-sm font-medium text-orange-800">{selected.length} selected</span>
              <select
                className="text-sm border border-orange-300 rounded px-2 py-1 bg-white focus:outline-none"
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
              >
                <option value="">Bulk Action</option>
                <option value="approve">Approve All</option>
                <option value="reject">Reject All</option>
              </select>
              <Button
                size="sm"
                disabled={!bulkAction || isUpdating}
                onClick={() => setShowBulkConfirm(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
              >
                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
              </Button>
              <button
                onClick={() => setSelected([])}
                className="text-gray-400 hover:text-gray-600 ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <Card className="bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="w-4 h-4 text-orange-600 rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Candidate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Application ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Job</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr><td colSpan="8" className="py-8 text-center text-gray-500">Loading applications...</td></tr>
                )}
                {!isLoading && applications.length === 0 && (
                  <tr><td colSpan="8" className="py-8 text-center text-gray-500">No applications found.</td></tr>
                )}
                {applications.map((app) => (
                  <tr
                    key={app._id}
                    className={`hover:bg-orange-50 transition-colors ${selected.includes(app._id) ? 'bg-orange-50' : ''}`}
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(app._id)}
                        onChange={() => toggleOne(app._id)}
                        className="w-4 h-4 text-orange-600 rounded border-gray-300"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800 text-sm">{app.candidateId?.fullName || 'Candidate'}</div>
                      <div className="text-xs text-gray-500">{app.candidateId?.email || '—'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm font-semibold text-orange-600">{app.applicationId}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800 text-sm">{app.jobId?.title || '—'}</div>
                      <div className="text-xs text-gray-500">{app.jobId?.department || '—'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-700'}>
                        {app.status?.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={PAYMENT_COLORS[app.paymentStatus] || 'bg-gray-100 text-gray-700'}>
                        {app.paymentStatus || 'unpaid'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/admin/applications/${app._id}`)}
                          className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {['submitted', 'under_review'].includes(app.status) && (
                          <>
                            <button
                              onClick={() => updateStatus({ id: app._id, status: 'verified' })}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStatus({ id: app._id, status: 'rejected' })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
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
              Showing {applications.length} of {Number(total).toLocaleString('en-IN')} applications
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

      {/* Bulk Confirm Modal */}
      {showBulkConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Bulk Action</h3>
            <p className="text-gray-600 text-sm mb-6">
              You are about to <strong>{bulkAction}</strong> <strong>{selected.length}</strong> application(s).
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowBulkConfirm(false)}>Cancel</Button>
              <Button
                onClick={handleBulkApply}
                disabled={isUpdating}
                className={bulkAction === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
              >
                {isUpdating
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                  : `Confirm ${bulkAction === 'approve' ? 'Approval' : 'Rejection'}`
                }
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default Applications
