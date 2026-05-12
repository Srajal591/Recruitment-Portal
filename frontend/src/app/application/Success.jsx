import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { CheckCircle, Download, Calendar, FileText, CreditCard } from 'lucide-react'

const Success = () => {
  const navigate = useNavigate()

  const applicationDetails = {
    applicationId: 'BR-2024-8892',
    transactionId: 'TXN-789456123',
    amount: 1275,
    paymentMethod: 'Credit Card',
    timestamp: '24 Oct 2024, 2:15 PM',
    posts: [
      'Assistant Section Officer',
      'Junior Engineer (Civil)'
    ]
  }

  const handleGoToDashboard = () => {
    navigate('/candidate/dashboard')
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-200 px-6 py-4">
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
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Application Submitted Successfully!</h1>
          <p className="text-gray-600 text-lg">
            Your application has been submitted and payment has been processed successfully.
          </p>
        </div>

        {/* Application Details */}
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">Application Details</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Application ID</label>
                  <div className="text-lg font-semibold text-orange-600">{applicationDetails.applicationId}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                  <div className="text-lg font-mono text-gray-800">{applicationDetails.transactionId}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Status</label>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-medium">Payment Successful</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount Paid</label>
                  <div className="text-lg font-semibold text-gray-800">₹{applicationDetails.amount}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Method</label>
                  <div className="text-lg text-gray-800">{applicationDetails.paymentMethod}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Submitted On</label>
                  <div className="text-lg text-gray-800">{applicationDetails.timestamp}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <label className="text-sm font-medium text-gray-600 block mb-2">Applied Posts</label>
              <div className="space-y-2">
                {applicationDetails.posts.map((post, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-gray-800">{post}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Download Receipt</h3>
              <p className="text-sm text-gray-600 mb-4">Get your payment receipt and application acknowledgment</p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Download PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Exam Schedule</h3>
              <p className="text-sm text-gray-600 mb-4">Check important dates and exam schedule</p>
              <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                View Schedule
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Track Application</h3>
              <p className="text-sm text-gray-600 mb-4">Monitor your application status and updates</p>
              <Button variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50">
                Track Status
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card className="shadow-sm bg-blue-50 border-blue-200 mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-800 mb-3">Important Information</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Keep your Application ID ({applicationDetails.applicationId}) safe for future reference</li>
              <li>• Admit cards will be available 15 days before the examination date</li>
              <li>• Check your registered email and SMS for important updates</li>
              <li>• Document verification will be conducted after the written examination</li>
              <li>• Results will be published on the official website</li>
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <Button 
            onClick={handleGoToDashboard}
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-lg"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Success