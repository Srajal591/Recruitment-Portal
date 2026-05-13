import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { 
  Plus, 
  Eye, 
  Edit, 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign,
  Settings,
  BarChart3,
  HeadphonesIcon,
  Calendar,
  MoreHorizontal
} from 'lucide-react'

const ProjectDetails = () => {
  const navigate = useNavigate()

  const projectStats = [
    {
      title: 'TOTAL JOBS',
      value: '42',
      change: '+2 New',
      color: 'text-green-600'
    },
    {
      title: 'TOTAL APPLICANTS',
      value: '12,450',
      change: '+14%',
      color: 'text-green-600'
    },
    {
      title: 'COMPLETED',
      value: '8,200',
      change: '65.8% of total',
      color: 'text-blue-600'
    },
    {
      title: 'REVENUE',
      value: '₹1.2Cr',
      change: '',
      color: 'text-purple-600'
    }
  ]

  const funnelData = [
    { stage: 'STARTED', count: '12,450', color: 'bg-gray-200' },
    { stage: 'FILLED', count: '11,200', color: 'bg-orange-200' },
    { stage: 'UPLOADED', count: '10,500', color: 'bg-orange-300' },
    { stage: 'PAID', count: '8,350', color: 'bg-orange-400' },
    { stage: 'SUBMITTED', count: '8,200', color: 'bg-orange-500' }
  ]

  const activeJobs = [
    {
      position: 'Physics - Assistant Professor',
      id: 'ID: AP-PHY-001',
      applicants: '3,450',
      status: 'RECEIVING',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      position: 'Chemistry - Assistant Professor',
      id: 'ID: AP-CHE-002',
      applicants: '2,800',
      status: 'RECEIVING',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      position: 'Mathematics - Assistant Professor',
      id: 'ID: AP-MAT-003',
      applicants: '4,200',
      status: 'VERIFICATION',
      statusColor: 'bg-yellow-100 text-yellow-800'
    }
  ]

  const quickActions = [
    {
      title: 'CREATE JOB',
      icon: Plus,
      color: 'bg-orange-100 text-orange-600',
      action: () => navigate('/admin/jobs/create')
    },
    {
      title: 'VIEW APPS',
      icon: Eye,
      color: 'bg-blue-100 text-blue-600',
      action: () => navigate('/admin/applications')
    },
    {
      title: 'ANALYTICS',
      icon: BarChart3,
      color: 'bg-green-100 text-green-600',
      action: () => navigate('/admin/analytics')
    },
    {
      title: 'OPEN SUPPORT',
      icon: HeadphonesIcon,
      color: 'bg-purple-100 text-purple-600',
      action: () => navigate('/admin/support')
    }
  ]

  const supportSnapshot = {
    open: 12,
    resolved: 33
  }

  const recentActivity = [
    {
      title: 'Job Posting Updated',
      description: 'Mathematics criteria changed by Chief Admin',
      time: 'Just now',
      type: 'update'
    },
    {
      title: 'Application Milestone',
      description: 'Physics department crossed 3,500 mark',
      time: '5 minutes ago',
      type: 'milestone'
    },
    {
      title: 'Data Exported',
      description: 'Candidate CSV exported for review',
      time: '12 minutes ago',
      type: 'export'
    }
  ]

  return (
    <AdminLayout title="Project Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Badge className="bg-green-100 text-green-800">ACTIVE PROJECT</Badge>
              <span className="text-sm text-gray-500">Duration: 6 Months</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Assistant Professor Recruitment 2024</h1>
            <p className="text-gray-600">State: Bihar | Dept: Higher Education</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-300">
              <Settings className="w-4 h-4 mr-2" />
              Manage Access
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectStats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    {stat.change && (
                      <p className={`text-xs font-medium mt-1 ${stat.color}`}>{stat.change}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Funnel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">Application Funnel</h3>
                  </div>
                  <span className="text-xs text-gray-500">LIVE PIPELINE</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    {funnelData.map((stage, index) => (
                      <div key={index} className="text-center">
                        <div className={`w-16 h-16 ${stage.color} rounded-lg flex items-center justify-center mb-2`}>
                          <span className="font-bold text-white text-sm">{stage.count}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">{stage.stage}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Additional Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">4,250</div>
                      <div className="text-xs text-gray-500">PENDING REVIEW</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">120</div>
                      <div className="text-xs text-gray-500">REJECTED/FAILED</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">850</div>
                      <div className="text-xs text-gray-500">DRAFT APPS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">45</div>
                      <div className="text-xs text-gray-500">SUPPORT TICKETS</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-800">QUICK ACTIONS</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={index}
                        onClick={action.action}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-medium text-gray-700">{action.title}</div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Support Snapshot */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Support Snapshot</h3>
                  <span className="text-xs text-orange-600">45 TOTAL</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-8 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{supportSnapshot.open}</div>
                    <div className="text-xs text-gray-500">OPEN</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{supportSnapshot.resolved}</div>
                    <div className="text-xs text-gray-500">RESOLVED</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Unable to upload NET...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Payment deducted but status...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Job Positions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Active Job Positions</h3>
              <Button variant="ghost" size="sm" className="text-orange-600">
                View All Positions
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeJobs.map((job, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{job.position}</h4>
                      <p className="text-sm text-gray-500">{job.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">{job.applicants}</div>
                      <div className="text-xs text-gray-500">Applicants</div>
                    </div>
                    <Badge className={job.statusColor}>
                      {job.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'update' ? 'bg-orange-500' :
                    activity.type === 'milestone' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{activity.title}</div>
                    <div className="text-xs text-gray-600">{activity.description}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default ProjectDetails