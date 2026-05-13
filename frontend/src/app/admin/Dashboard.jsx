import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { 
  Plus, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  BarChart3
} from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()

  const stats = [
    {
      title: 'TOTAL APPLICATIONS',
      value: '124,582',
      change: '+12%',
      trend: 'up',
      color: 'border-l-orange-500'
    },
    {
      title: 'COMPLETED',
      value: '98,230',
      change: '76.8%',
      subtitle: 'of total',
      trend: 'up',
      color: 'border-l-green-500'
    },
    {
      title: 'PENDING REVIEW',
      value: '26,352',
      change: 'Priority Required',
      trend: 'warning',
      color: 'border-l-yellow-500'
    },
    {
      title: 'PAYMENT SUCCESS',
      value: '94.5%',
      change: 'Stable',
      trend: 'stable',
      color: 'border-l-blue-500'
    }
  ]

  const conversionFunnel = [
    { stage: 'STARTED', value: '185k', color: 'bg-gray-200' },
    { stage: 'FILLED', value: '142k', color: 'bg-orange-200' },
    { stage: 'UPLOADED', value: '129k', color: 'bg-orange-300' },
    { stage: 'PAID', value: '125k', color: 'bg-orange-400' },
    { stage: 'SUBMITTED', value: '124k', color: 'bg-gray-800' }
  ]

  const criticalAlerts = [
    {
      type: 'error',
      title: 'Payment Gateway Spike',
      description: 'UPI2 failures in the last 2 hours. Merchant HDFC is reporting balance.',
      count: '3 NEW'
    },
    {
      type: 'warning',
      title: 'Document Buffer Full',
      description: 'Storage 94% at 80% capacity. Warning uploaded might be throttled.',
      count: ''
    },
    {
      type: 'info',
      title: 'Support Ticket Surge',
      description: '42 new tickets created. Urgent: related to Aadhar verification.',
      count: ''
    }
  ]

  const topJobs = [
    {
      id: 'SE',
      title: 'Senior Engineer (Mechanical)',
      subtitle: 'Post ID: BR-2024-041 • Open',
      applicants: '45,230',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'AA',
      title: 'Administrative Assistant',
      subtitle: 'Post ID: BR-2024-044 • Closing Soon',
      applicants: '32,115',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'MO',
      title: 'Medical Officer Grade-II',
      subtitle: 'Post ID: BR-2024-040 • Closed',
      applicants: '18,500',
      color: 'bg-gray-100 text-gray-800'
    }
  ]

  const recentActivity = [
    {
      type: 'job',
      title: 'Job #BR-2024-08 Posted',
      description: 'Senior Administrative Officer added to public portal.',
      time: '12 mins ago',
      icon: '📋'
    },
    {
      type: 'admin',
      title: 'Admin updated roles',
      description: 'Security Admin: Reviewer Tier permissions modified by RK.',
      time: '4 minutes ago',
      icon: '👤'
    },
    {
      type: 'verification',
      title: 'Bulk Verification Complete',
      description: '2000 applications verified for Assistant Professor post.',
      time: '8 minutes ago',
      icon: '✅'
    }
  ]

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard Overview</h1>
            <p className="text-gray-600">Real-time recruitment oversight for the 2024 fiscal cycle.</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={() => navigate('/admin/jobs/create')}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Job Posting
            </Button>
            <Button variant="outline" className="border-gray-300">
              <Eye className="w-4 h-4 mr-2" />
              View All Applications
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className={`border-l-4 ${stat.color} bg-white`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    {stat.subtitle && (
                      <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                    {stat.trend === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                    <span className={`text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 
                      stat.trend === 'warning' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversion Funnel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">Candidate Conversion Funnel</h3>
                  </div>
                  <span className="text-xs text-gray-500">LAST 30 DAYS</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    {conversionFunnel.map((stage, index) => (
                      <div key={index} className="text-center">
                        <div className={`w-16 h-16 ${stage.color} rounded-lg flex items-center justify-center mb-2`}>
                          <span className="font-bold text-white">{stage.value}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">{stage.stage}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-4">
                    <span>• Dropout Rate: 33%</span>
                    <span>• Submission Efficiency: 86.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Critical Alerts</h3>
                <Badge variant="destructive" className="text-xs">3 NEW</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalAlerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'error' ? 'bg-red-500' : 
                    alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm text-gray-800">{alert.title}</h4>
                      {alert.count && (
                        <Badge variant="destructive" className="text-xs">{alert.count}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Job Performance */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Top Job Performance</h3>
                <Button variant="ghost" size="sm" className="text-orange-600">
                  Download Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {topJobs.map((job, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${job.color} rounded-lg flex items-center justify-center font-bold text-sm`}>
                      {job.id}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-800">{job.title}</h4>
                      <p className="text-xs text-gray-500">{job.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">{job.applicants}</p>
                    <p className="text-xs text-gray-500">APPLICANTS</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Support Snapshot & Recent Activity */}
          <div className="space-y-6">
            {/* Support Snapshot */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-800">Support Snapshot</h3>
                <p className="text-xs text-gray-500">Available since March 2024</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-8 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">145</div>
                    <div className="text-xs text-gray-500">RESOLVED</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">8</div>
                    <div className="text-xs text-gray-500">PENDING</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">12</div>
                    <div className="text-xs text-gray-500">OPEN</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full text-sm">
                  📞 Go to Support Command Center
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Recent Activity</h3>
                  <span className="text-xs text-gray-500">Real-time log</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-800">{activity.title}</h4>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recruitment Cycle Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <img src="/api/placeholder/40/40" alt="Profile" className="w-10 h-10 rounded-full" />
                <div>
                  <h4 className="font-semibold text-gray-800">R.K. Srivastava</h4>
                  <p className="text-sm text-gray-600">Principal Admin</p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-gray-800">RECRUITMENT CYCLE PROGRESS</h3>
                <div className="text-3xl font-bold text-orange-600">72%</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full" style={{ width: '72%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>APPLICATIONS</span>
              <span>SHORTLISTED</span>
              <span>VERIFIED</span>
              <span>EXAMINATION</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default Dashboard