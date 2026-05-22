import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  CreditCard, Smartphone, Building, Shield, AlertCircle,
  Loader2, CheckCircle, ArrowLeft,
} from 'lucide-react'
import ApplicationLayout from '../../components/layouts/ApplicationLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { candidateService } from '../../services/candidate.service'

const PAYMENT_METHODS = [
  { id: 'card',       name: 'Credit / Debit Card', icon: CreditCard,  desc: 'Visa, Mastercard, RuPay accepted' },
  { id: 'upi',        name: 'UPI Payment',          icon: Smartphone,  desc: 'PhonePe, Google Pay, Paytm, BHIM' },
  { id: 'netbanking', name: 'Net Banking',           icon: Building,    desc: 'All major banks supported' },
]

const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const applicationId = location.state?.applicationId

  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' })

  // Fetch application to get fee details
  const { data: appData, isLoading: appLoading } = useQuery({
    queryKey: ['candidate-application', applicationId],
    queryFn: () => candidateService.getApplication(applicationId),
    enabled: !!applicationId,
  })

  useEffect(() => {
    if (!applicationId) {
      toast.error('No application found')
      navigate('/candidate/applications')
    }
  }, [applicationId, navigate])

  const application = appData?.application || appData

  // Initiate payment mutation
  const { mutate: initiatePayment, isPending: isInitiating } = useMutation({
    mutationFn: () => candidateService.initiatePayment(applicationId, 'razorpay'),
    onSuccess: (data) => {
      // If Razorpay SDK order created, open Razorpay checkout
      if (data?.gatewayOrderId && data?.gatewayKeyId) {
        openRazorpayCheckout(data)
      } else {
        // Fallback: simulate payment (dev mode — no gateway keys configured)
        simulatePayment(data?.transactionId)
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to initiate payment')
    },
  })

  // Verify payment mutation
  const { mutate: verifyPayment, isPending: isVerifying } = useMutation({
    mutationFn: (verifyData) => candidateService.verifyPayment(verifyData),
    onSuccess: () => {
      toast.success('Payment successful!')
      navigate('/application/success', {
        state: { applicationId, paymentSuccess: true },
      })
    },
    onError: (err) => {
      toast.error(err.message || 'Payment verification failed')
    },
  })

  const openRazorpayCheckout = (paymentData) => {
    const options = {
      key: paymentData.gatewayKeyId,
      amount: paymentData.amount * 100, // paise
      currency: paymentData.currency || 'INR',
      name: 'Bihar Recruitment Portal',
      description: `Application Fee — ${application?.applicationId || applicationId}`,
      order_id: paymentData.gatewayOrderId,
      prefill: {
        name: application?.personalDetails?.fullName || '',
        email: '',
        contact: application?.personalDetails?.registeredMobile || '',
      },
      theme: { color: '#f97316' },
      handler: (response) => {
        // Payment successful — verify with backend
        verifyPayment({
          transactionId: paymentData.transactionId,
          gatewayOrderId: paymentData.gatewayOrderId,
          gatewayPaymentId: response.razorpay_payment_id,
          gatewaySignature: response.razorpay_signature,
          status: 'success',
        })
      },
      modal: {
        ondismiss: () => {
          toast.error('Payment cancelled')
        },
      },
    }

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        verifyPayment({
          transactionId: paymentData.transactionId,
          gatewayOrderId: paymentData.gatewayOrderId,
          gatewayPaymentId: response.error?.metadata?.payment_id || '',
          status: 'failed',
        })
      })
      rzp.open()
    } else {
      // Razorpay SDK not loaded — simulate
      simulatePayment(paymentData.transactionId)
    }
  }

  const simulatePayment = (transactionId) => {
    // Dev mode: simulate successful payment after 1.5s
    toast.loading('Processing payment...', { id: 'payment' })
    setTimeout(() => {
      toast.dismiss('payment')
      verifyPayment({
        transactionId,
        status: 'success',
      })
    }, 1500)
  }

  const handlePay = () => {
    // Basic validation
    if (selectedMethod === 'upi' && !upiId.trim()) {
      toast.error('Please enter your UPI ID')
      return
    }
    if (selectedMethod === 'netbanking' && !selectedBank) {
      toast.error('Please select your bank')
      return
    }
    if (selectedMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        toast.error('Please fill all card details')
        return
      }
    }
    initiatePayment()
  }

  const isProcessing = isInitiating || isVerifying

  if (appLoading) {
    return (
      <ApplicationLayout currentStep={8} title="Payment Gateway">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </ApplicationLayout>
    )
  }

  if (!application && !appLoading) {
    return (
      <ApplicationLayout currentStep={8} title="Payment Gateway">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Application not found</p>
            <Button onClick={() => navigate('/candidate/applications')}>
              Go to Applications
            </Button>
          </CardContent>
        </Card>
      </ApplicationLayout>
    )
  }

  const totalFee = application?.totalFee || 0
  const processingFee = totalFee > 0 ? Math.round(totalFee * 0.02) : 0
  const grandTotal = totalFee + processingFee

  return (
    <ApplicationLayout currentStep={8} title="Payment Gateway">
      {/* Load Razorpay SDK */}
      {!window.Razorpay && (
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          onLoad={() => console.log('Razorpay loaded')}
        />
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Payment Methods */}
          <div className="lg:col-span-2 space-y-5">
            {/* Method Selection */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-800">Select Payment Method</h2>
                <p className="text-sm text-gray-500">Choose your preferred payment method</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={selectedMethod === method.id}
                        onChange={() => setSelectedMethod(method.id)}
                        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedMethod === method.id ? 'bg-orange-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${selectedMethod === method.id ? 'text-orange-600' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Payment Details Form */}
            {selectedMethod === 'upi' && (
              <Card>
                <CardHeader><h3 className="font-semibold text-gray-800">UPI Payment</h3></CardHeader>
                <CardContent>
                  <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@paytm or yourname@upi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-2">Enter your UPI ID to proceed with payment</p>
                </CardContent>
              </Card>
            )}

            {selectedMethod === 'card' && (
              <Card>
                <CardHeader><h3 className="font-semibold text-gray-800">Card Details</h3></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails(d => ({ ...d, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails(d => ({ ...d, expiry: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails(d => ({ ...d, cvv: e.target.value.replace(/\D/g, '') }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Name as on card"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails(d => ({ ...d, name: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedMethod === 'netbanking' && (
              <Card>
                <CardHeader><h3 className="font-semibold text-gray-800">Select Your Bank</h3></CardHeader>
                <CardContent>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                    <option value="bob">Bank of Baroda</option>
                    <option value="canara">Canara Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                  </select>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-5">
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-800">Payment Summary</h3></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Application Fee</span>
                    <span className="font-medium text-gray-800">₹{totalFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Fee (2%)</span>
                    <span className="font-medium text-gray-800">₹{processingFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-800">Total Amount</span>
                    <span className="font-bold text-orange-600 text-lg">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {application?.applicationId && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Application ID</p>
                    <p className="text-xs font-mono font-semibold text-gray-800">{application.applicationId}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800 text-sm">Secure Payment</span>
                </div>
                <p className="text-xs text-green-700">
                  Your payment is encrypted with SSL. We comply with PCI-DSS standards.
                </p>
              </CardContent>
            </Card>

            {totalFee === 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-800 font-medium">No fee applicable for your category</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={() => navigate('/application/post-selection', { state: { applicationId } })}
            disabled={isProcessing}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handlePay}
            disabled={isProcessing || (totalFee === 0 && grandTotal === 0)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8"
          >
            {isProcessing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
            ) : totalFee === 0 ? (
              'Submit Application'
            ) : (
              `Pay ₹${grandTotal.toLocaleString('en-IN')}`
            )}
          </Button>
        </div>
      </div>
    </ApplicationLayout>
  )
}

export default Payment
