import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { 
  ArrowRight,
  ArrowLeft,
  FileText,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock
} from 'lucide-react'

const JobBasicInfo = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('project')

  const [formData, setFormData] = useState({
    jobTitle: '',
    postCode: '',
    department: '',
    category: 'General',
    totalPosts: '',
    reservedPosts: {
      sc: '',
      st: '',
      obc: '',
      ews: '',
      pwd: ''
    },
    salaryRange: {
      min: '',
      max: ''
    },
    jobType: 'Permanent',
    workLocation: '',
    applicationFee: {
      general: '',
      scSt: '',
      pwd: ''
    },
    applicationDeadline: '',
    examDate: '',
    description: ''
  })

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleNext = () => {
    navigate(`/admin/jobs/create/eligibility${projectId ? `?project=${projectId}` : ''}`)
  }

  const handleBack = () => {
    navigate('/admin/jobs')
  }

  const steps = [
    { id: 1, name: 'Basic Info', active: true },
    { id: 2, name: 'Eligibility', active: false },
    { id: 3, name: 'Form Builder', active: false },
    { id: 4, name: 'Documents', active: false },
    { id: 5, name: 'Payment', active: false },
    { id: 6, name: 'Review', active: false }
  ]

  return (
    <AdminLayout title="Create Job - Basic Info">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create Job Posting</h1>
            <p className="text-gray-600">Step 1 of 6: Basic Information</p>
          </div>
          <Badge className="bg-orange-100 text-orange-800">
            Project: Assistant Professor Recruitment 2024
          </Badge>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.active 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step.active ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-12 h-0.5 bg-gray-200 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-800">Job Details</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Assistant Professor - Physics"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Post Code *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AP-PHY-001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.postCode}
                      onChange={(e) => handleInputChange('postCode', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Department of Physics"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                      <option value="General">General</option>
                      <option value="Technical">Technical</option>
                      <option value="Administrative">Administrative</option>
                      <option value="Teaching">Teaching</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Describe the role, responsibilities, and requirements..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Post Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-800">Post Details</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Posts *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.totalPosts}
                      onChange={(e) => handleInputChange('totalPosts', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.jobType}
                      onChange={(e) => handleInputChange('jobType', e.target.value)}
                    >
                      <option value="Permanent">Permanent</option>
                      <option value="Contract">Contract</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reserved Posts
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">SC</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.reservedPosts.sc}
                        onChange={(e) => handleInputChange('reservedPosts.sc', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">ST</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.reservedPosts.st}
                        onChange={(e) => handleInputChange('reservedPosts.st', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">OBC</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.reservedPosts.obc}
                        onChange={(e) => handleInputChange('reservedPosts.obc', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">EWS</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.reservedPosts.ews}
                        onChange={(e) => handleInputChange('reservedPosts.ews', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">PWD</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.reservedPosts.pwd}
                        onChange={(e) => handleInputChange('reservedPosts.pwd', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Salary & Location */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-800">Salary & Location</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Salary (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 56100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.salaryRange.min}
                      onChange={(e) => handleInputChange('salaryRange.min', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Salary (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 177500"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.salaryRange.max}
                      onChange={(e) => handleInputChange('salaryRange.max', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Patna, Bihar"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.workLocation}
                      onChange={(e) => handleInputChange('workLocation', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Fees */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-800">Application Fees</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    General/OBC (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.applicationFee.general}
                    onChange={(e) => handleInputChange('applicationFee.general', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SC/ST (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.applicationFee.scSt}
                    onChange={(e) => handleInputChange('applicationFee.scSt', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PWD (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.applicationFee.pwd}
                    onChange={(e) => handleInputChange('applicationFee.pwd', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Important Dates */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-800">Important Dates</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.applicationDeadline}
                    onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tentative Exam Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.examDate}
                    onChange={(e) => handleInputChange('examDate', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-orange-800 mb-3">Quick Tips</h3>
                <ul className="text-sm text-orange-700 space-y-2">
                  <li>• Use clear, descriptive job titles</li>
                  <li>• Ensure post codes are unique</li>
                  <li>• Verify reservation quotas as per policy</li>
                  <li>• Set realistic application deadlines</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button 
            onClick={handleBack}
            variant="outline" 
            className="px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8"
          >
            Next: Eligibility Criteria
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}

export default JobBasicInfo