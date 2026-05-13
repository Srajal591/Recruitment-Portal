import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import Button from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const JobReview = () => {
  const navigate = useNavigate()
  const [isPublishing, setIsPublishing] = useState(false)

  // Mock data - in real app, this would come from context or API
  const jobData = {
    basicInfo: {
      title: 'Software Engineer',
      department: 'IT Department',
      location: 'Mumbai, Maharashtra',
      employmentType: 'Full-time',
      experience: '2-5 years',
      salary: '₹8,00,000 - ₹15,00,000',
      description: 'We are looking for a skilled Software Engineer...'
    },
    eligibility: {
      education: 'Bachelor\'s in Computer Science',
      age: '21-35 years',
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
      examFee: '₹1000',
      processingFee: '₹100',
      total: '₹1600'
    },
    timeline: {
      applicationStart: '2024-01-15',
      applicationEnd: '2024-02-15',
      examDate: '2024-03-01',
      resultDate: '2024-03-15'
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Job published successfully')
      navigate('/admin/jobs')
    } catch (error) {
      console.error('Error publishing job:', error)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleSaveDraft = () => {
    console.log('Job saved as draft')
    navigate('/admin/jobs')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Job Posting</h1>
            <p className="text-gray-600">Review all details before publishing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Job Title:</span>
                  <p className="text-gray-900">{jobData.basicInfo.title}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Department:</span>
                  <p className="text-gray-900">{jobData.basicInfo.department}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Location:</span>
                  <p className="text-gray-900">{jobData.basicInfo.location}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Employment Type:</span>
                  <Badge variant="secondary">{jobData.basicInfo.employmentType}</Badge>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Experience:</span>
                  <p className="text-gray-900">{jobData.basicInfo.experience}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Salary Range:</span>
                  <p className="text-gray-900">{jobData.basicInfo.salary}</p>
                </div>
              </div>
            </Card>

            {/* Eligibility Criteria */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Criteria</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Education:</span>
                  <p className="text-gray-900">{jobData.eligibility.education}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Age Limit:</span>
                  <p className="text-gray-900">{jobData.eligibility.age}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Required Skills:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {jobData.eligibility.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Required Documents */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
              <ul className="space-y-2">
                {jobData.documents.map((doc, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-gray-900">{doc}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Payment Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Application Fee:</span>
                  <span className="text-gray-900">{jobData.payment.applicationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exam Fee:</span>
                  <span className="text-gray-900">{jobData.payment.examFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="text-gray-900">{jobData.payment.processingFee}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">{jobData.payment.total}</span>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Dates</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Application Start:</span>
                  <p className="text-gray-900">{jobData.timeline.applicationStart}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Application End:</span>
                  <p className="text-gray-900">{jobData.timeline.applicationEnd}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Exam Date:</span>
                  <p className="text-gray-900">{jobData.timeline.examDate}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Result Date:</span>
                  <p className="text-gray-900">{jobData.timeline.resultDate}</p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="w-full"
                >
                  {isPublishing ? 'Publishing...' : 'Publish Job'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="w-full"
                >
                  Save as Draft
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/jobs/create/payment')}
          >
            Previous
          </Button>
          <div className="space-x-3">
            <Button variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? 'Publishing...' : 'Publish Job'}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default JobReview