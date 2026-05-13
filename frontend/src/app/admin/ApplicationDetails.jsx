import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Download, CheckCircle, X, Eye } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import Button from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const ApplicationDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('personal')

  // Mock application data
  const application = {
    id: id,
    candidateName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 9876543210',
    jobTitle: 'Software Engineer',
    applicationDate: '2024-01-15',
    status: 'under_review',
    paymentStatus: 'completed',
    personalDetails: {
      fullName: 'John Doe',
      fatherName: 'Robert Doe',
      motherName: 'Jane Doe',
      dateOfBirth: '1995-06-15',
      gender: 'Male',
      category: 'General',
      nationality: 'Indian',
      maritalStatus: 'Single'
    },
    education: {
      qualification: 'B.Tech Computer Science',
      university: 'ABC University',
      passingYear: '2017',
      percentage: '85.5%',
      rollNumber: 'CS2017001'
    },
    address: {
      permanent: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      current: {
        street: '456 Park Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400002',
        country: 'India'
      }
    },
    documents: [
      { name: 'Resume', status: 'verified', url: '#' },
      { name: 'Educational Certificate', status: 'verified', url: '#' },
      { name: 'Experience Letter', status: 'pending', url: '#' },
      { name: 'Identity Proof', status: 'verified', url: '#' }
    ],
    payment: {
      transactionId: 'TXN123456789',
      amount: '₹1,600',
      method: 'Razorpay',
      date: '2024-01-15',
      status: 'Success'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'success'
      case 'pending': return 'warning'
      case 'rejected': return 'danger'
      case 'under_review': return 'info'
      default: return 'secondary'
    }
  }

  const handleStatusUpdate = (newStatus) => {
    console.log(`Updating application status to: ${newStatus}`)
    // API call to update status
  }

  const tabs = [
    { id: 'personal', label: 'Personal Details' },
    { id: 'education', label: 'Education' },
    { id: 'address', label: 'Address' },
    { id: 'documents', label: 'Documents' },
    { id: 'payment', label: 'Payment' }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600">Application ID: {application.id}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/applications')}
          >
            Back to Applications
          </Button>
        </div>

        {/* Application Summary */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Candidate Name</span>
              <p className="text-lg font-semibold text-gray-900">{application.candidateName}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Job Position</span>
              <p className="text-lg font-semibold text-gray-900">{application.jobTitle}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Application Status</span>
              <Badge variant={getStatusColor(application.status)} className="mt-1">
                {application.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Payment Status</span>
              <Badge variant={getStatusColor(application.paymentStatus)} className="mt-1">
                {application.paymentStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Status Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Application Status</h3>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate('approved')}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate('rejected')}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate('shortlisted')}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Shortlist
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <Card className="p-6">
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(application.personalDetails).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <p className="text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Educational Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(application.education).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <p className="text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Permanent Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(application.address.permanent).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-sm font-medium text-gray-500 capitalize">{key}:</span>
                      <p className="text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(application.address.current).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-sm font-medium text-gray-500 capitalize">{key}:</span>
                      <p className="text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
              <div className="space-y-3">
                {application.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <Badge variant={getStatusColor(doc.status)} size="sm">
                          {doc.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(application.payment).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <p className="text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}

export default ApplicationDetails