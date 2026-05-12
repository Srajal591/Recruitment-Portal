import { useState } from 'react'
import { Plus, Download, Eye, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const CandidateDashboard = () => {
  const [applications] = useState([
    {
      id: '#BR-2023-1120',
      title: 'Senior Clerk',
      department: 'Finance Department',
      date: 'Dec 12, 2023',
      status: 'ACCEPTED',
      statusColor: 'success'
    },
    {
      id: '#BR-2024-0045',
      title: 'Revenue Officer',
      department: 'Revenue & Land Reforms',
      date: 'Jan 19, 2024',
      status: 'UNDER REVIEW',
      statusColor: 'warning'
    }
  ])

  const alerts = [
    {
      type: 'warning',
      title: 'Complete Document Verification',
      message: 'Application #BR-2024-8892 requires additional certificates for the Junior Engineer post.',
      action: 'Resolve Now'
    },
    {
      type: 'error',
      title: 'Payment Pending',
      message: 'Your draft application for "District Coordinator" is incomplete. Payment gateway closes in 14 hours.',
      action: 'Pay Fees'
    }
  ]

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
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, Candidate</span>
            <Button className="bg-orange-600 hover:bg-orange-700">
              New Application
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
              <p className="text-orange-100">Track your recruitment progress and pending actions.</p>
              <div className="mt-4 flex items-center space-x-4 text-sm">
                <span className="bg-orange-500/30 px-3 py-1 rounded-full">📅 October 24, 2024</span>
              </div>
            </div>
            <div className="text-right">
              <Button className="bg-white text-orange-600 hover:bg-orange-50">
                Apply for New Job
              </Button>
            </div>
          </div>
        </div>

        {/* Alert Cards */}
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <Card key={index} className={`border-l-4 ${
              alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-red-500 bg-red-50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                      alert.type === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                    <div>
                      <h3 className={`font-medium ${
                        alert.type === 'warning' ? 'text-yellow-800' : 'text-red-800'
                      }`}>
                        {alert.title}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        alert.type === 'warning' ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className={`ml-4 ${
                      alert.type === 'warning' 
                        ? 'bg-yellow-600 hover:bg-yellow-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {alert.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Application */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">Submitted Applications</h3>
                    <p className="text-sm text-orange-600">#BR-2024-8892 - Primary Active Application</p>
                  </div>
                  <Badge variant="success">SUBMITTED</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-800">Applied Posts</h4>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                          <span className="text-sm text-gray-700">Assistant Section Officer</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                          <span className="text-sm text-gray-700">Junior Engineer</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-orange-600">Last Update</div>
                      <div className="font-medium text-gray-800">Yesterday, 4:30 PM</div>
                      <div className="text-xs text-gray-500">System verified documents</div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-3">Application Progress</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-orange-700">65% Complete</span>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-orange-600">
                        <span>REGISTRATION</span>
                        <span>VERIFICATION</span>
                        <span>FEES</span>
                        <span>FINAL</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download Acknowledgement
                    </Button>
                    <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                      View Full Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Continue Draft */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-6 h-6" />
                    <h3 className="font-semibold">Continue Draft</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Complete your pending application for Administrative Head.
                  </p>
                  <Button className="w-full bg-orange-600 text-white hover:bg-orange-700">
                    Resume Application →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Admit Cards */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-800">Admit Cards</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800 text-sm">ARO Prelims 2024</div>
                      <div className="text-xs text-orange-600">AVAILABLE NOW</div>
                    </div>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Snapshot */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-800">Support Snapshot</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-800">12</div>
                    <div className="text-sm text-orange-600">OPEN</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">33</div>
                    <div className="text-sm text-green-600">RESOLVED</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                  📞 Get Help & Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Application History */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Application History</h3>
              <Button variant="outline" size="sm" className="border-orange-200 text-orange-600">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border border-orange-100 rounded-lg hover:bg-orange-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{app.title}</div>
                      <div className="text-sm text-orange-600">{app.department}</div>
                      <div className="text-xs text-gray-500">{app.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge variant={app.statusColor}>{app.status}</Badge>
                      <div className="text-xs text-gray-500 mt-1">{app.date}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-100">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CandidateDashboard