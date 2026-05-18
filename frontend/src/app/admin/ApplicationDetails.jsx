import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  ArrowLeft, FileText, Loader2, User, GraduationCap, MapPin,
  Upload, CreditCard, CheckCircle, XCircle, Clock, Eye,
  Download, MessageSquare, AlertCircle,
} from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

const PAYMENT_COLORS = {
  paid: 'bg-green-100 text-green-800',
  success: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
  initiated: 'bg-blue-100 text-blue-800',
}

const TABS = [
  { id: 'personal',  label: 'Personal Details',  icon: User },
  { id: 'education', label: 'Education',          icon: GraduationCap },
  { id: 'address',   label: 'Address',            icon: MapPin },
  { id: 'documents', label: 'Documents',          icon: Upload },
  { id: 'payment',   label: 'Payment',            icon: CreditCard },
]

const InfoRow = ({ label, value }) => (
  <div className="py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500 block">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value || '—'}</span>
  </div>
)

const ApplicationDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('personal')
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [reviewNote, setReviewNote] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-application', id],
    queryFn: () => adminService.getApplication(id),
  })

  const application = data?.application || data

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: ({ status, notes }) => adminService.updateApplicationStatus(id, { status, notes }),
    onSuccess: (_, vars) => {
      toast.success(`Application ${vars.status === 'verified' ? 'approved' : vars.status === 'rejected' ? 'rejected' : 'updated'}`)
      queryClient.invalidateQueries({ queryKey: ['admin-application', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] })
      setShowRejectModal(false)
      setReviewNote('')
    },
    onError: (err) => toast.error(err.message || 'Failed to update status'),
  })

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
  const address = application.addressDetails || application.address || {}
  const documents = application.documents || {}
  const payment = application.paymentDetails || {}
  const canAct = ['submitted', 'under_review'].includes(application.status)

  return (
    <AdminLayout title="Application Details">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/applications')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
              <p className="text-gray-500 text-sm">ID: <span className="font-mono text-orange-600">{application.applicationId || id}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={STATUS_COLORS[application.status] || 'bg-gray-100 text-gray-800'}>
              {application.status?.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge className={PAYMENT_COLORS[application.paymentStatus] || 'bg-gray-100 text-gray-800'}>
              {application.paymentStatus?.toUpperCase() || 'UNPAID'}
            </Badge>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Candidate</p>
                <p className="font-semibold text-gray-900">{application.candidateId?.fullName || '—'}</p>
                <p className="text-sm text-gray-600">{application.candidateId?.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Job Applied</p>
                <p className="font-semibold text-gray-900">{application.jobId?.title || '—'}</p>
                <p className="text-sm text-gray-600">{application.jobId?.department || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Submitted On</p>
                <p className="font-semibold text-gray-900">
                  {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Category</p>
                <p className="font-semibold text-gray-900">{personal.category || application.category || '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Panel */}
        {canAct && (
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Review Actions
              </h3>
              <div className="flex flex-wrap gap-3 items-start">
                <div className="flex-1 min-w-[200px]">
                  <textarea
                    rows="2"
                    placeholder="Add reviewer notes (optional)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => updateStatus({ status: 'under_review', notes: reviewNote })}
                    disabled={isPending || application.status === 'under_review'}
                    variant="outline"
                    className="text-yellow-700 border-yellow-300 hover:bg-yellow-50"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Mark Under Review
                  </Button>
                  <Button
                    onClick={() => updateStatus({ status: 'verified', notes: reviewNote })}
                    disabled={isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Approve
                  </Button>
                  <Button
                    onClick={() => setShowRejectModal(true)}
                    disabled={isPending}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Notes (if rejected) */}
        {application.verificationNotes && (
          <Card className="border-l-4 border-l-red-400 bg-red-50">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-red-800 mb-1">Reviewer Notes:</p>
              <p className="text-sm text-red-700">{application.verificationNotes}</p>
            </CardContent>
          </Card>
        )}

        {/* Tabs + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tab Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-2">
                {TABS.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-orange-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {tab.label}
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">

                {/* Personal Details */}
                {activeTab === 'personal' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-orange-600" />
                      Personal Information
                    </h3>
                    {Object.keys(personal).length === 0 ? (
                      <p className="text-gray-500 text-sm">No personal details submitted yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        {[
                          ['Full Name', personal.fullName],
                          ["Father's Name", personal.fatherName],
                          ["Mother's Name", personal.motherName],
                          ['Date of Birth', personal.dateOfBirth ? new Date(personal.dateOfBirth).toLocaleDateString('en-IN') : null],
                          ['Gender', personal.gender],
                          ['Category', personal.category],
                          ['Nationality', personal.nationality],
                          ['Religion', personal.religion],
                          ['Marital Status', personal.maritalStatus],
                          ['Contact Number', personal.contactNumber || personal.phone],
                          ['Alternate Phone', personal.alternatePhone],
                          ['Email', personal.email],
                          ['Aadhar Number', personal.aadharNumber],
                          ['PAN Number', personal.panNumber],
                          ['Disability', personal.disability ? 'Yes' : 'No'],
                          ['Ex-Serviceman', personal.exServiceman ? 'Yes' : 'No'],
                        ].map(([label, value]) => value !== undefined && value !== null && (
                          <InfoRow key={label} label={label} value={value} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Education */}
                {activeTab === 'education' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-orange-600" />
                      Educational Qualifications
                    </h3>
                    {education.length === 0 ? (
                      <p className="text-gray-500 text-sm">No education details submitted yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {education.map((edu, i) => (
                          <div key={i} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-800">{edu.level || edu.qualification || `Education ${i + 1}`}</h4>
                              {edu.percentage && (
                                <Badge className="bg-orange-100 text-orange-800">{edu.percentage}%</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                ['Board/University', edu.board || edu.university],
                                ['Year of Passing', edu.yearOfPassing || edu.year],
                                ['Percentage/CGPA', edu.percentage || edu.cgpa],
                                ['Subject/Stream', edu.subject || edu.stream],
                                ['Institution', edu.institution || edu.school || edu.college],
                                ['Grade', edu.grade],
                              ].map(([label, value]) => value && (
                                <div key={label}>
                                  <p className="text-xs text-gray-500">{label}</p>
                                  <p className="text-sm font-medium text-gray-800">{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Address */}
                {activeTab === 'address' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      Address Details
                    </h3>
                    {Object.keys(address).length === 0 ? (
                      <p className="text-gray-500 text-sm">No address details submitted yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Permanent Address */}
                        {(address.permanent || address.permanentAddress) && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-3 text-sm uppercase tracking-wide">Permanent Address</h4>
                            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                              {Object.entries(address.permanent || address.permanentAddress || {}).map(([k, v]) => (
                                <InfoRow key={k} label={k.replace(/([A-Z])/g, ' $1').trim()} value={String(v)} />
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Current Address */}
                        {(address.current || address.currentAddress) && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-3 text-sm uppercase tracking-wide">Current Address</h4>
                            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                              {Object.entries(address.current || address.currentAddress || {}).map(([k, v]) => (
                                <InfoRow key={k} label={k.replace(/([A-Z])/g, ' $1').trim()} value={String(v)} />
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Flat address (no nested) */}
                        {!address.permanent && !address.current && !address.permanentAddress && !address.currentAddress && (
                          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            {Object.entries(address).map(([k, v]) => (
                              <InfoRow key={k} label={k.replace(/([A-Z])/g, ' $1').trim()} value={typeof v === 'object' ? JSON.stringify(v) : String(v)} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Documents */}
                {activeTab === 'documents' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-orange-600" />
                      Uploaded Documents
                    </h3>
                    {Object.keys(documents).length === 0 ? (
                      <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(documents).map(([name, url]) => {
                          if (!url) return null
                          const isImage = typeof url === 'string' && /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
                          return (
                            <div key={name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 capitalize">
                                    {name.replace(/([A-Z])/g, ' $1').trim()}
                                  </p>
                                  <p className="text-xs text-gray-500">{isImage ? 'Image' : 'Document'}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </a>
                                <a href={url} download>
                                  <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </a>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Payment */}
                {activeTab === 'payment' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                      Payment Information
                    </h3>
                    {Object.keys(payment).length === 0 ? (
                      <p className="text-gray-500 text-sm">No payment information available.</p>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            ['Amount', payment.amount ? `₹${Number(payment.amount).toLocaleString('en-IN')}` : null],
                            ['Status', payment.status?.toUpperCase()],
                            ['Gateway', payment.gateway],
                            ['Transaction ID', payment.transactionId],
                            ['Order ID', payment.orderId],
                            ['Paid At', payment.paidAt ? new Date(payment.paidAt).toLocaleString('en-IN') : null],
                          ].map(([label, value]) => value && (
                            <div key={label} className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-500 mb-1">{label}</p>
                              <p className="font-semibold text-gray-900 text-sm">{value}</p>
                            </div>
                          ))}
                        </div>
                        {payment.status && (
                          <div className={`p-4 rounded-lg flex items-center gap-3 ${
                            ['paid', 'success'].includes(payment.status)
                              ? 'bg-green-50 border border-green-200'
                              : payment.status === 'pending'
                              ? 'bg-yellow-50 border border-yellow-200'
                              : 'bg-red-50 border border-red-200'
                          }`}>
                            {['paid', 'success'].includes(payment.status)
                              ? <CheckCircle className="w-5 h-5 text-green-600" />
                              : payment.status === 'pending'
                              ? <Clock className="w-5 h-5 text-yellow-600" />
                              : <XCircle className="w-5 h-5 text-red-600" />
                            }
                            <span className="font-medium text-sm">
                              Payment {payment.status === 'success' || payment.status === 'paid' ? 'Successful' : payment.status}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Reject Application</h3>
              <p className="text-sm text-gray-500 mt-1">Please provide a reason for rejection. This will be visible to the candidate.</p>
            </div>
            <div className="p-6">
              <textarea
                rows="4"
                placeholder="Enter rejection reason (required)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>Cancel</Button>
              <Button
                onClick={() => updateStatus({ status: 'rejected', notes: rejectReason })}
                disabled={isPending || !rejectReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default ApplicationDetails
