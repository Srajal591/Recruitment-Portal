import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FileText, Eye, CheckCircle, X, Search } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const Applications = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const status = activeTab === 'all' ? undefined : activeTab

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications', status],
    queryFn: () => adminService.getApplications({ status, limit: 20 }),
  })
  const { data: statsData } = useQuery({
    queryKey: ['admin-application-stats'],
    queryFn: adminService.getApplicationStats,
  })

  const applications = data?.applications || []
  const statusStats = statsData?.statusStats || []
  const countByStatus = (key) => statusStats.find((item) => item._id === key)?.count || 0
  const total = data?.pagination?.totalItems || statsData?.totalApplications || applications.length

  const stats = [
    { title: 'TOTAL APPLICATIONS', value: total, color: 'border-l-orange-500', icon: FileText },
    { title: 'UNDER REVIEW', value: countByStatus('under_review'), color: 'border-l-yellow-500', icon: Eye },
    { title: 'APPROVED', value: countByStatus('approved') + countByStatus('verified'), color: 'border-l-green-500', icon: CheckCircle },
    { title: 'REJECTED', value: countByStatus('rejected'), color: 'border-l-red-500', icon: X },
  ]

  const tabs = [
    { id: 'all', label: 'All Applications', count: total },
    { id: 'submitted', label: 'Submitted', count: countByStatus('submitted') },
    { id: 'verified', label: 'Verified', count: countByStatus('verified') },
    { id: 'rejected', label: 'Rejected', count: countByStatus('rejected') },
  ]

  return (
    <AdminLayout title="Applications">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Applications Management</h1>
            <p className="text-gray-600">Review and manage candidate applications from backend.</p>
          </div>
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Advanced Search
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className={`border-l-4 ${stat.color} bg-white`}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{Number(stat.value || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <stat.icon className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="border-b border-orange-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'
                }`}
              >
                <span>{tab.label}</span>
                <Badge className="bg-gray-100 text-gray-600">{tab.count}</Badge>
              </button>
            ))}
          </nav>
        </div>

        <Card className="bg-white">
          <div className="p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Candidate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Application ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Job</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <tr><td colSpan="7" className="py-6 px-4 text-gray-600">Loading applications...</td></tr>}
                {!isLoading && applications.length === 0 && <tr><td colSpan="7" className="py-6 px-4 text-gray-600">No applications found.</td></tr>}
                {applications.map((application) => (
                  <tr key={application._id} className="border-b border-gray-100 hover:bg-orange-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{application.candidateId?.fullName || 'Candidate'}</div>
                      <div className="text-sm text-gray-500">{application.candidateId?.email || '-'}</div>
                    </td>
                    <td className="py-4 px-4 font-medium text-orange-600">{application.applicationId}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{application.jobId?.title || 'Job'}</div>
                      <div className="text-sm text-gray-500">{application.jobId?.department || '-'}</div>
                    </td>
                    <td className="py-4 px-4"><Badge className="bg-gray-100 text-gray-800">{application.status}</Badge></td>
                    <td className="py-4 px-4"><Badge className={application.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{application.paymentStatus}</Badge></td>
                    <td className="py-4 px-4 text-sm text-gray-800">{application.submittedAt ? new Date(application.submittedAt).toLocaleDateString('en-IN') : '-'}</td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/applications/${application._id}`)} className="text-orange-600 hover:bg-orange-100">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default Applications
