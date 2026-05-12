import { useState } from 'react'
import { Plus, Eye, TrendingUp, Users, FileText, DollarSign, AlertTriangle } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { formatCurrency, formatNumber } from '../../lib/utils'

const AdminDashboard = () => {
  const stats = [
    {
      title: 'TOTAL APPLICATIONS',
      value: '124,582',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'COMPLETED',
      value: '98,230',
      subtitle: '78.8% of total',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
      color: 'green'
    },
    {
      title: 'PENDING REVIEW',
      value: '26,352',
      subtitle: 'Priority Required',
      change: '+5%',
      changeType: 'positive',
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      title: 'PAYMENT SUCCESS',
      value: '94.5%',
      subtitle: 'Stable',
      change: '+2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'purple'
    }
  ]

  const funnelData = [
    { stage: 'STARTED', count: '185k', percentage: 100 },
    { stage: 'FILLED', count: '142k', percentage: 77 },
    { stage: 'UPLOADED', count: '129k', percentage: 70 },
    { stage: 'PAID', count: '125k', percentage: 68 },
    { stage: 'SUBMITTED', count: '124k', percentage: 67 }
  ]

  const topJobs = [
    { title: 'Senior Engineer (Mechanical)', code: 'SE', applicants: '45,230' },
    { title: 'Administrative Assistant', code: 'AA', applicants: '32,115' },
    { title: 'Medical Officer Grade-II', code: 'MO', applicants: '18,500' }
  ]

  const recentActivity = [
    { action: 'Job Posting Updated', user: 'Mathematics criteria changed by Chief Admin', time: 'Just now', type: 'update' },
    { action: 'Application Milestone', user: 'Physics department crossed 3,500 mark', time: '5 minutes ago', type: 'milestone' },
    { action: 'Data Exported', user: 'Candidate CSV exported for review', time: '12 minutes ago', type: 'export' }
  ]

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard Overview</h1>
            <p className="text-gray-600">Real-time recruitment oversight for the 2024 fiscal cycle.</p>
          </div>
          <div className="flex space-x-3">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create New Job Posting</span>
            </Button>
            <Button variant="outline">View All Applications</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                      stat.color === 'yellow' ? 'bg-yellow-100' :
                      'bg-purple-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'yellow' ? 'text-yellow-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <Badge variant={stat.changeType === 'positive' ? 'success' : 'error'}>
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{stat.title}</div>
                  {stat.subtitle && (
                    <div className="text-xs text-gray-500">{stat.subtitle}</div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidate Conversion Funnel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">Candidate Conversion Funnel</h3>
                    <p className="text-sm text-gray-600">LAST 30 DAYS</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-20 text-sm font-medium text-gray-600">{item.stage}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg font-semibold text-gray-800">{item.count}</span>
                          <span className="text-sm text-gray-600">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Dropout Rate: 33%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Submission Efficiency: 86.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Top Job Performance */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Top Job Performance</h3>
                  <Button variant="ghost" size="sm">Download Report</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {topJobs.map((job, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium text-xs">{job.code}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{job.title}</div>
                        <div className="text-xs text-gray-500">{job.applicants} applicants</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-800">Recent Activity</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'update' ? 'bg-primary' :
                      activity.type === 'milestone' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{activity.action}</div>
                      <div className="text-xs text-gray-600">{activity.user}</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">RECRUITMENT CYCLE PROGRESS</h3>
                <p className="text-sm text-gray-600">Phase 3 of 5 • Document Verification & Shortlisting</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">72%</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div className="bg-gradient-to-r from-primary to-primary-light h-3 rounded-full" style={{ width: '72%' }}></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className="text-primary font-medium">APPLICATIONS</span>
              <span className="text-yellow-600 font-medium">SHORTLISTED</span>
              <span className="text-green-600 font-medium">VERIFICATION</span>
              <span className="text-gray-400">EXAMINATION</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard