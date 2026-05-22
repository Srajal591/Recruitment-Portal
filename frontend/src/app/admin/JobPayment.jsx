import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import JobStepProgress from './JobStepProgress'
import { ArrowRight, ArrowLeft, CreditCard, DollarSign, Shield } from 'lucide-react'

const JobPayment = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('project')
  const returnToReview = searchParams.get('returnTo') === 'review'

  const [paymentConfig, setPaymentConfig] = useState(() => {
    const saved = JSON.parse(sessionStorage.getItem('job_draft') || '{}')
    const methods = saved.paymentConfig?.paymentMethods || ['razorpay']
    return {
    applicationFee: saved.paymentConfig?.applicationFee || '',
    examFee: saved.paymentConfig?.examFee || '',
    processingFee: saved.paymentConfig?.processingFee || '',
    paymentMethods: {
      razorpay: methods.includes('razorpay'),
      payu: methods.includes('payu'),
      ccavenue: methods.includes('ccavenue')
    },
    refundPolicy: saved.paymentConfig?.refundPolicy || '',
    paymentDeadline: ''
  }})

  const handleInputChange = (field, value) => {
    setPaymentConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMethodChange = (method, enabled) => {
    setPaymentConfig(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: enabled
      }
    }))
  }

  const handleNext = () => {
    const existing = JSON.parse(sessionStorage.getItem('job_draft') || '{}')
    const enabledMethods = Object.entries(paymentConfig.paymentMethods)
      .filter(([, enabled]) => enabled)
      .map(([method]) => method)
    sessionStorage.setItem('job_draft', JSON.stringify({
      ...existing,
      paymentConfig: {
        applicationFee: Number(paymentConfig.applicationFee) || 0,
        examFee: Number(paymentConfig.examFee) || 0,
        processingFee: Number(paymentConfig.processingFee) || 0,
        paymentMethods: enabledMethods,
        refundPolicy: paymentConfig.refundPolicy || undefined,
      },
    }))
    navigate(`/admin/jobs/create/review${projectId ? `?project=${projectId}` : ''}`)
  }

  const handleBack = () => {
    navigate(`/admin/jobs/create/documents${projectId ? `?project=${projectId}` : ''}`)
  }

  const methodLabels = {
    razorpay: 'Razorpay',
    payu: 'PayU',
    ccavenue: 'CCAvenue'
  }

  return (
    <AdminLayout title="Create Job - Payment">
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Create Job Posting</h1>
              <p className="text-gray-500 text-sm mt-0.5">Step 5 of 6: Payment Configuration</p>
            </div>
          </div>

          {/* Progress Steps */}
          <JobStepProgress currentStep={5} projectId={projectId} clickable />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Fees Configuration */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-800">Fee Structure</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application Fee (₹)
                      </label>
                      <input
                        type="number"
                        value={paymentConfig.applicationFee}
                        onChange={(e) => handleInputChange('applicationFee', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g. 500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Fee (₹)
                      </label>
                      <input
                        type="number"
                        value={paymentConfig.examFee}
                        onChange={(e) => handleInputChange('examFee', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g. 1000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Processing Fee (₹)
                      </label>
                      <input
                        type="number"
                        value={paymentConfig.processingFee}
                        onChange={(e) => handleInputChange('processingFee', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g. 100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={paymentConfig.paymentDeadline}
                      onChange={(e) => handleInputChange('paymentDeadline', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refund Policy
                    </label>
                    <textarea
                      value={paymentConfig.refundPolicy}
                      onChange={(e) => handleInputChange('refundPolicy', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Describe the refund policy for this job's application fee..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-800">Payment Methods</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(paymentConfig.paymentMethods).map(([method, enabled]) => (
                    <label key={method} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => handleMethodChange(method, e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {methodLabels[method] || method}
                      </span>
                    </label>
                  ))}
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-blue-800 text-sm">Payment Tips</h3>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1.5">
                    <li>• Ensure fees are as per government guidelines</li>
                    <li>• SC/ST candidates are usually exempt from fees</li>
                    <li>• Set a clear payment deadline</li>
                    <li>• Review gateway charges before enabling</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <Button 
              onClick={handleBack}
              variant="outline" 
              className="px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back: Documents
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8"
            >
              {returnToReview ? 'Save & Return to Review' : 'Next: Review'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default JobPayment
