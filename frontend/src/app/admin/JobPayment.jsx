import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import Button from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import Input from '../../components/ui/Input'

const JobPayment = () => {
  const navigate = useNavigate()
  const [paymentConfig, setPaymentConfig] = useState({
    applicationFee: '',
    examFee: '',
    processingFee: '',
    paymentMethods: {
      razorpay: true,
      payu: false,
      ccavenue: false
    },
    refundPolicy: '',
    paymentDeadline: ''
  })

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

  const handleSave = () => {
    // Save payment configuration
    console.log('Payment config saved:', paymentConfig)
    // Navigate to next step or back to jobs
    navigate('/admin/jobs/create/review')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Configuration</h1>
            <p className="text-gray-600">Configure payment settings for this job</p>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Fee (₹)
                </label>
                <Input
                  type="number"
                  value={paymentConfig.applicationFee}
                  onChange={(e) => handleInputChange('applicationFee', e.target.value)}
                  placeholder="Enter application fee"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Fee (₹)
                </label>
                <Input
                  type="number"
                  value={paymentConfig.examFee}
                  onChange={(e) => handleInputChange('examFee', e.target.value)}
                  placeholder="Enter exam fee"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Processing Fee (₹)
                </label>
                <Input
                  type="number"
                  value={paymentConfig.processingFee}
                  onChange={(e) => handleInputChange('processingFee', e.target.value)}
                  placeholder="Enter processing fee"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Methods
              </label>
              <div className="space-y-2">
                {Object.entries(paymentConfig.paymentMethods).map(([method, enabled]) => (
                  <label key={method} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => handleMethodChange(method, e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {method === 'payu' ? 'PayU' : method === 'ccavenue' ? 'CCAvenue' : method}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Deadline
              </label>
              <Input
                type="datetime-local"
                value={paymentConfig.paymentDeadline}
                onChange={(e) => handleInputChange('paymentDeadline', e.target.value)}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter refund policy details..."
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/jobs/create/documents')}
          >
            Previous
          </Button>
          <Button onClick={handleSave}>
            Next: Review
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}

export default JobPayment