import { useState } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const Analytics = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days Oct 1 - Oct 30')
  const [selectedCategory, setSelectedCategory] = useState('Senior Administrative Officer')

  const mainStats = [
    {
      title: 'TOTAL APPLICATIONS',
      value: '128.4k',
      change: '+12%',
      trend: 'up',
      color: 'border-l-orange-500'
    },
    {
      title: 'COMPLETED APPLICATIONS',
      value: '94.2k',
      change: '+73%',
      trend: 'up',
      color: 'border-l-green-500'
    },
    {
      title: 'PENDING APPLICATIONS',
      value: '31.2k',
      status: 'Processing...',
      color: 'border-l-yellow-500'
    },
    {
      title: 'PAYMENT SUCCESS RATE',
      value: '98.4%',
      change: 'High',
      trend: 'high',
      color: 'border-l-blue-500'
    }
  ]

  const secondaryStats = [
    {
      title: 'DROPPED',
      value: '3,102',
      icon: '❌',
      color: 'text-red-600'
    },
    {
      title: 'PAYMENT FAILURES',
      value: '842',
      icon: '❌',
      color: 'text-red-600'
    },
    {
      title: 'TICKETS RAISED',
      value: '1,240',
      icon: '🎫',
      color: 'text-yellow-600'
    },
    {
      title: 'TICKETS RESOLVED',
      value: '1,195',
      icon: '✅',
      color: 'text-green-600'
    }
  ]

  const conversionFunnel = [
    { stage: 'Started', value: '156k', percentage: '100%', color: 'bg-orange-500' },
    { stage: 'Filled', value: '142k', percentage: '91%', color: 'bg-orange-500' },
    { stage: 'Uploaded', value: '138k', percentage: '97%', color: 'bg-orange-500' },
    { stage: 'Paid', value: '129k', percentage: '93%', color: 'bg-orange-500' },
    { stage: 'Submitted', value: '128.4k', percentage: '99%', color: 'bg-yellow-600' }
  ]

  const topJobs = [
    {
      title: 'Senior Administrative Officer (Group A)',
      applicants: '42,105 applicants',
      progress: 85
    },
    {
      title: 'Information Technology Manager',
      applicants: '28,940 applicants',
      progress: 70
    },
    {
      title: 'Public Relations Specialist',
      applicants: '18,211 applicants',
      progress: 60
    },
    {
      title: 'General Assistant (Finance)',
      applicants: '12,400 applicants',
      progress: 45
    },
    {
      title: 'Statistical Research Officer',
      applicants: '9,820 applicants',
      progress: 35
    }
  ]

  const supportStats = [
    {
      title: 'Open Tickets',
      value: '45',
      subtitle: 'Require immediate attention',
      icon: '🎫'
    },
    {
      title: 'Resolved Today',
      value: '1,195',
      subtitle: 'Solved within 24 hours',
      icon: '✅'
    },
    {
      title: 'Pending Response',
      value: '128',
      subtitle: 'Awaiting user action',
      icon: '⏳'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics Overview</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>Last 30 Days Oct 1 - Oct 30</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
            </select>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>Senior Administrative Officer</option>
              <option>IT Manager</option>
              <option>Finance Officer</option>
            </select>
            <Button className="bg-orange-600 hover:bg-orange-700">
              Filter
            </Button>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((stat, index) => (
            <Card key={index} className={`border-l-4 ${stat.color} bg-white`}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    {stat.status && (
                      <p className="text-xs text-gray-500 mt-1">{stat.status}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {stat.change && (
                      <span className={`text-xs font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 
                        stat.trend === 'high' ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {secondaryStats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <div className="p-6 text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-xs font-medium text-gray-500 mb-1">{stat.title}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Conversion Funnel */}
        <Card className="bg-white">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Application Conversion Funnel</h3>
              <Button variant="ghost" className="text-orange-600">
                Detailed View →
              </Button>
            </div>
            
            <div className="space-y-4">
              {conversionFunnel.map((stage, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-20 text-sm font-medium text-gray-600">
                    STAGE {index + 1}
                  </div>
                  <div className="w-24 text-sm font-medium text-gray-800">
                    {stage.stage}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 ${stage.color} rounded flex items-center justify-center text-white font-bold min-w-[120px]`}>
                        {stage.value}
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-green-600 font-medium">{stage.percentage}</span>
                        <span className="text-gray-500">of Previous</span>
                        {index > 0 && (
                          <span className="text-red-500 text-xs">
                            ↓ -{Math.floor(Math.random() * 10 + 1)}.{Math.floor(Math.random() * 9)}K Drop-off ({Math.floor(Math.random() * 5 + 1)}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">156.0K</div>
                <div className="text-sm text-gray-500">TOTAL INFLOW</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">128.4K</div>
                <div className="text-sm text-gray-500">TOTAL CONVERTED</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">27.6K</div>
                <div className="text-sm text-gray-500">TOTAL LEAKAGE</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Jobs by Applicants */}
          <Card className="bg-white">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Jobs by Applicants</h3>
              <div className="space-y-4">
                {topJobs.map((job, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium text-sm text-gray-800">{job.title}</div>
                      <div className="text-sm font-bold text-gray-800">{job.applicants}</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Support Snapshot */}
          <Card className="bg-white">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Support Snapshot</h3>
              <div className="space-y-4">
                {supportStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{stat.icon}</div>
                      <div>
                        <div className="font-semibold text-gray-800">{stat.title}</div>
                        <div className="text-sm text-gray-600">{stat.subtitle}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Analytics