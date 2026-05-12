import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '../../components/ui/Button'
import { Card, CardContent } from '../../components/ui/Card'
import heroBg from '../../assets/herobg.jpg'

const VerifyOTP = () => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      
      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleVerify = () => {
    setIsLoading(true)
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false)
      navigate('/application/personal-details')
    }, 1500)
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-orange-200 px-6 py-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">RP</span>
            </div>
            <div>
              <div className="font-bold text-gray-800">Recruitment Portal</div>
              <div className="text-sm text-gray-600">GOVERNMENT OF INDIA</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Home</span>
            <span className="text-gray-600">About Us</span>
            <span className="text-gray-600">How to Apply</span>
            <span className="text-gray-600">FAQ</span>
            <span className="text-gray-600">Contact Us</span>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2">
              Login/Register
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-20 w-full max-w-lg mt-20">
        <Card className="bg-white shadow-2xl border-t-4 border-t-orange-500">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                ✓ VERIFICATION
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Apply for Senior<br />
                Administrative Officer
              </h1>
              <p className="text-gray-600 text-sm">
                Enter the 6-digit verification code sent to your mobile number
              </p>
            </div>

            {/* Mobile Number Display */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ENTER MOBILE NUMBER
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  value="98765 43210"
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg bg-gray-50 text-gray-700"
                />
              </div>
              <div className="flex justify-end mt-2">
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  Change Number
                </button>
              </div>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                ENTER OTP CODE
              </label>
              <div className="flex justify-center space-x-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                ))}
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">OTP valid for 10 minutes</span>
                <button className="text-orange-600 hover:text-orange-700 font-medium">
                  Resend
                </button>
              </div>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              disabled={otp.some(digit => !digit) || isLoading}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-medium text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify & Continue'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default VerifyOTP