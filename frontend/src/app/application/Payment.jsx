import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApplicationLayout from '../../components/layouts/ApplicationLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { CreditCard, Smartphone, Building, Shield, AlertCircle } from 'lucide-react'
import { applicationService } from '../../services/application.service'

const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const applicationId = location.state?.applicationId
  
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [processing, setProcessing] = useState(false)

  const { data: appData, isLoading } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationService.getApplication(applicationId),
    enabled: !!applicationId,
  })

  const application = appData?.application

  useEffect(() => {
    if (!applicationId) {
      toast.error('No application found')
      navigate('/candidate/applications')
    }
  }, [applicationId, navigate])

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay accepted'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'PhonePe, Google Pay, Paytm, BHIM'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building,
      description: 'All major banks supported'
    }
  ]

  const handlePayment = async () => {
    setProcessing(true)
    
    // Simulate payment processing (actual gateway integration will be added later)
    setTimeout(() => {
      setProcessing(false)
      toast.success('Payment successful!')
      navigate('/application/success', {
        state: { applicationId, paymentSuccess: true }
      })
    }, 2000)
  }

  const handlePrevious = () => {
    navigate('/application/post-selection', {
      state: { applicationId }
    })
  }

  if (isLoading) {
    return (
      <ApplicationLayout currentStep={8} title="Payment Gateway">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </ApplicationLayout>
    )
  }

  if (!application) {
    return (
      <ApplicationLayout currentStep={8} title="Payment Gateway">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Application not found</p>
            <Button onClick={() => navigate('/candidate/applications')} className="mt-4">
              Go to Applications
            </Button>
          </CardContent>
        </Card>
      </ApplicationLayout>
    )
  }

  const totalFee = application.totalFee || 0
  const processingFee = Math.round(totalFee * 0.02) // 2% processing fee
  const grandTotal = totalFee + processingFee

  return (
    <ApplicationLayout currentStep={8} title="Payment Gateway">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-800">Select Payment Method</h2>
                <p className="text-gray-600">Choose your preferred payment method to complete the application</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={selectedMethod === method.id}
                          onChange={() => setSelectedMethod(method.id)}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-800">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Payment Gateway Note */}
            <Card className="shadow-sm bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800 mb-1">Payment Gateway Integration</p>
                    <p className="text-sm text-blue-700">
                      The actual payment gateway will be integrated by the admin. For now, clicking "Pay" will simulate a successful payment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-800">Payment Summary</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Application Fee</span>
                    <span className="font-medium text-gray-800">₹{totalFee}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Processing Fee (2%)</span>
                    <span className="font-medium text-gray-800">₹{processingFee}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Total Amount</span>
                      <span className="font-bold text-orange-600 text-lg">₹{grandTotal}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                  <p className="font-medium mb-1">Application ID:</p>
                  <p className="text-xs font-mono">{application.applicationId}</p>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="shadow-sm bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Secure Payment</span>
                </div>
                <p className="text-sm text-green-700">
                  Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm">Secure payment gateway</span>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              className="px-6"
              disabled={processing}
            >
              ← Back
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={processing || totalFee === 0}
              className="px-8 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400"
            >
              {processing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>Pay ₹{grandTotal}</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </ApplicationLayout>
  )
}

export default Payment

  return (
    <ApplicationLayout currentStep={8} title="Payment Gateway">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-800">Select Payment Method</h2>
                <p className="text-gray-600">Choose your preferred payment method to complete the application</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={selectedMethod === method.id}
                          onChange={() => setSelectedMethod(method.id)}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-800">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Payment Form */}
            {selectedMethod === 'card' && (
              <Card className="shadow-sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-800">Card Details</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter name as on card"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedMethod === 'upi' && (
              <Card className="shadow-sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-800">UPI Payment</h3>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="yourname@paytm"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedMethod === 'netbanking' && (
              <Card className="shadow-sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-800">Select Your Bank</h3>
                </CardHeader>
                <CardContent>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                  </select>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {orderSummary.posts.map((post, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{post.name}</span>
                      <span className="font-medium text-gray-800">₹{post.fee}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Subtotal</span>
                      <span className="font-medium text-gray-800">₹{orderSummary.subtotal}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-700">Processing Fee</span>
                      <span className="font-medium text-gray-800">₹{orderSummary.processingFee}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Total Amount</span>
                      <span className="font-bold text-orange-600 text-lg">₹{orderSummary.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="shadow-sm bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Secure Payment</span>
                </div>
                <p className="text-sm text-green-700">
                  Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm">Secure payment gateway</span>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              className="px-6"
              disabled={processing}
            >
              ← Back
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={processing}
              className="px-8 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400"
            >
              {processing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>Pay ₹{orderSummary.total}</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </ApplicationLayout>
  )
}

export default Payment