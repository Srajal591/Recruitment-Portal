import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ArrowLeft, FileText, Loader2 } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import Button from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
}

const ApplicationDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('personal')
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-application', id],
    queryFn: () => adminService.getApplication(id),
  })

  const application = data?.application || data

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: ({ status, notes }) => adminService.updateApplicationStatus(id, { status, notes }),
    onSuccess: () => {
      toast.success('Application status updated')
      queryClient.invalidateQueries({ queryKey: ['admin-application', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] })
      setShowRejectModal(false)
    },
    onError: (err) => toast.error(err.message || 'Failed to update status'),
  })

  const tabs = ['personal', 'education', 'address', 'documents', 'payment']

  if (isLoading) return (
    <AdminLayout title="Application Details">
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    </AdminLayout>
  )

  if (!application) return (
    <AdminLayout title="Application Details">
      <div className="p-6">
        <p className="text-gray-600">Application not found.</p>
        <Button variant="outline" onClick={() => navigate('/admin/applications')} className="mt-4">
          Back to Applications
        </Button>
      </div>
    </AdminLayout>
  )

  const personal = application.personalDetails || {}
  const education = application.educationDetails || []
  const address = application.addressDetails || {}
  const documents = application.documents || {}
  const payment = application.paymentDetails || {}

  return (
    <AdminLayout title="Application Details">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/applications')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
              <p className="text-gray-600 text-sm">ID: {application.applicationId || id}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Candidate</p>
              <p className="font-semibold text-gray-900">{application.candidateId?.fullName || application.candidateId?.email || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Job</p>
              <p className="font-semibold text-gray-900">{application.jobId?.title || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge className={STATUS_COLORS[application.status] || 'bg-gray-100 text-gray-800'}>
                {application.status?.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment</p>
              <Badge className={STATUS_COLORS[application.paymentStatus] || 'bg-gray-100 text-gray-800'}>
                {application.paymentStatus?.toUpperCase() || '—'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Actions */}
        {['submitted', 'under_review'].includes(application.status) && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={() => updateStatus({ status: 'verified' })} disabled={isPending}
                className="bg-green-600 hover:bg-green-700 text-white">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Approve'}
              </Button>
              <Button onClick={() => setShowRejectModal(true)} disabled={isPending}
                className="bg-red-600 hover:bg-red-700 text-white">
                Reject
              </Button>
              <Button onClick={() => updateStatus({ status: 'under_review' })} disabled={isPending}
                variant="outline">
                Mark Under Review
              </Button>
            </div>
          </Card>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Reject Application</h3>
              <textarea rows="4" placeholder="Enter rejection reason..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowRejectModal(false)}>Cancel</Button>
                <Button onClick={() => updateStatus({ status: 'rejected', notes: rejectReason })}
                  disabled={isPending || !rejectReason.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Reject'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
                  activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'
                }`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <Card className="p-6">
          {activeTab === 'personal' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              {Object.keys(personal).length === 0
                ? <p className="text-gray-500 text-sm">No personal details submitted yet.</p>
                : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(personal).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-sm text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-gray-900">{String(v) || '—'}</p>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}

          {activeTab === 'education' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Education Details</h3>
              {education.length === 0
                ? <p className="text-gray-500 text-sm">No education details submitted yet.</p>
                : education.map((edu, i) => (
                    <div key={i} className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(edu).map(([k, v]) => (
                          <div key={k}>
                            <p className="text-sm text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-gray-900">{String(v) || '—'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
              }
            </div>
          )}

          {activeTab === 'address' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Details</h3>
              {Object.keys(address).length === 0
                ? <p className="text-gray-500 text-sm">No address details submitted yet.</p>
                : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(address).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-sm text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-gray-900">{typeof v === 'object' ? JSON.stringify(v) : String(v) || '—'}</p>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
              {Object.keys(documents).length === 0
                ? <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
                : <div className="space-y-3">
                    {Object.entries(documents).map(([name, url]) => url && (
                      <div key={name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-orange-600" />
                          <p className="font-medium text-gray-900 capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</p>
                        </div>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">View</Button>
                        </a>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}

          {activeTab === 'payment' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              {Object.keys(payment).length === 0
                ? <p className="text-gray-500 text-sm">No payment information available.</p>
                : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(payment).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-sm text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-gray-900">{String(v) || '—'}</p>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}

export default ApplicationDetails
