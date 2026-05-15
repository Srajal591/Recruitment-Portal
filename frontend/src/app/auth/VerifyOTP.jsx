import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import { Card, CardContent } from '../../components/ui/Card'
import heroBg from '../../assets/herobg.jpg'
import { authService } from '../../services/auth.service'

const VerifyOTP = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [email, setEmail] = useState(location.state?.email || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleVerify = async () => {
    setError('')
    setIsLoading(true)

    try {
      await authService.verifyOtp({ email, otp: otp.join('') })
      toast.success('OTP verified successfully')
      navigate('/candidate/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-20 w-full max-w-lg">
        <Card className="bg-white shadow-2xl border-t-4 border-t-orange-500">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                VERIFICATION
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Candidate Account</h1>
              <p className="text-gray-600 text-sm">
                Enter the 6-digit OTP sent to your registered email address.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="candidate@example.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">Enter OTP Code</label>
              <div className="flex justify-center space-x-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                ))}
              </div>
              <p className="text-center text-sm text-gray-600">OTP is valid for 10 minutes.</p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              onClick={handleVerify}
              disabled={!email || otp.some((digit) => !digit) || isLoading}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-medium text-base"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <div className="text-center mt-6">
              <Link to="/auth/register" className="text-sm text-orange-600 hover:text-orange-700">
                Back to registration
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default VerifyOTP
