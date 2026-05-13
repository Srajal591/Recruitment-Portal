import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import JobStepProgress from './JobStepProgress'
import { 
  ArrowLeft, 
  CheckCircle, 
  FileText, 
  GraduationCap, 
  CreditCard, 
  Calendar,
  Edit,
  Loader2
} from 'lucide-react'

const JobReview = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('project')
  const [isPublishing, setIsPublishing] = useState(false)

  // Mock data — in real app this would come from context / API
  const jobData = {
    basicInfo: {
      title: 'Software Engineer',
      department: 'IT Department',
      location: 'Mumbai, Maharashtra',
      employmentType: 'Full-time',
      experience: '2-5 years',
      salary: '₹8,00,000 – ₹15,00,000',
      description: 'We are looking for a skilled Software Engineer...'
    },
    eligibility: {
      education: "Bachelor's in Computer Science",
      age: '21–35 years',
      experience: 'Minimum 2 years',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
    },
    documents: [
      'Resume/CV',
      'Educational Certificates',
      'Experience Letters',
      'Identity Proof'
    ],
    payment: {
      applicationFee: '₹500',
      examFee: '₹1,000',
      processingFee: '₹100',
      total: '₹1,600'
    },
    timeline: {
      applicationStart: '15 Jan 2025',
      applicationEnd: '15 Feb 2025',
      examDate: '1 Mar 2025',
      resultDate: '15 Mar 2025'
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      navigate('/admin/jobs')
    } catch (error) {
      console.error('Error publishing job:', error)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleSaveDraft = () => {
    navigate('/admin/jobs')
  }

  const handleBack = () => {
    navigate(`/admin/jobs/create/payment${projectId ? `?project=${projectId}` : ''}`)
  }

  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
      <span className="text-sm font-medium text-gray-500 sm:w-36 flex-shrink-0">{label}:</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  )

  return (
    <AdminLayout title="Create Job - Review">
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Create Job Posting</h1>
              <p className="text-gray-500 text-sm mt-0.5">Step 6 of 6: Review & Publish</p>
            </div>
            <Badge className="bg-orange-100 text-orange-800">Ready to Publish</Badge>
          </div>

          {/* Progress Steps */}
          <JobStepProgress currentStep={6} projectId={projectId} clickable />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Review Content */}
            <div className="lg:col-span-2 space-y-5">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-800">Basic Information</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/jobs/create/basic-info${projectId ? `?project=${projectId}` : ''}`)}
                      className="text-orange-600 hover:bg-orange-50"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <InfoRow label="Job Title" value={jobData.basicInfo.title} />
                  <InfoRow label="Department" value={jobData.basicInfo.department} />
                  <InfoRow label="Location" value={jobData.basicInfo.location} />
                  <InfoRow label="Employment Type" value={jobData.basicInfo.employmentType} />
                  <InfoRow label="Experience" value={jobData.basicInfo.experience} />
                  <InfoRow label="Salary Range" value={jobData.basicInfo.salary} />
                </CardContent>
              </Card>

              {/* Eligibility Criteria */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-800">Eligibility Criteria</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/jobs/create/eligibility${projectId ? `?project=${projectId}` : ''}`)}
                      className="text-orange-600 hover:bg-orange-50"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <InfoRow label="Education" value={jobData.eligibility.education} />
                  <InfoRow label="Age Limit" value={jobData.eligibility.age} />
                  <InfoRow label="Experience" value={jobData.eligibility.experience} />
                  <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-3">
                    <span className="text-sm font-medium text-gray-500 sm:w-36 flex-shrink-0">Required Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {jobData.eligibility.skills.map((skill, index) => (
                        <Badge key={index} className="bg-orange-100 text-orange-800 text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Required Documents */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-800">Required Documents</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/jobs/create/documents${projectId ? `?project=${projectId}` : ''}`)}
                      className="text-orange-600 hover:bg-orange-50"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {jobData.documents.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-800">Payment Summary</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/jobs/create/payment${projectId ? `?project=${projectId}` : ''}`)}
                      className="text-orange-600 hover:bg-orange-50"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Application Fee</span>
                      <span className="font-medium text-gray-900">{jobData.payment.applicationFee}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Exam Fee</span>
                      <span className="font-medium text-gray-900">{jobData.payment.examFee}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Processing Fee</span>
                      <span className="font-medium text-gray-900">{jobData.payment.processingFee}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                      <span className="text-gray-800">Total</span>
                      <span className="text-orange-600">{jobData.payment.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-800">Important Dates</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5 text-sm">
                    <InfoRow label="App. Start" value={jobData.timeline.applicationStart} />
                    <InfoRow label="App. End" value={jobData.timeline.applicationEnd} />
                    <InfoRow label="Exam Date" value={jobData.timeline.examDate} />
                    <InfoRow label="Result Date" value={jobData.timeline.resultDate} />
                  </div>
                </CardContent>
              </Card>

              {/* Publish Actions */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-5 space-y-3">
                  <p className="text-sm text-orange-800 font-medium">
                    Review all information carefully before publishing. Published jobs are visible to candidates immediately.
                  </p>
                  <Button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Publish Job
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    Save as Draft
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons (bottom) */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <Button 
              onClick={handleBack}
              variant="outline" 
              className="px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back: Payment
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSaveDraft} className="px-6">
                Save Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish Job'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default JobReview