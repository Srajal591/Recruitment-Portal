import { useState } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const ActivityLogs = () => {
  const [filters, setFilters] = useState({
    employee: 'All Employees',
    module: 'All Modules',
    actionType: 'All Action Types'
  })

  const stats = [
    {
      title: 'CHANGES TODAY',
      value: '1,284',
      change: '+12% vs avg',
      icon: '📝',
      color: 'text-orange-600'
    },
    {
      title: 'ACTIVE EMPLOYEES',
      value: '42',
      subtitle: 'Currently session active',
      icon: '👥',
      color: 'text-blue-600'
    },
    {
      title: 'JOBS UPDATED',
      value: '156',
      subtitle: 'Pending validation',
      icon: '💼',
      color: 'text-yellow-600'
    },
    {
      title: 'CRITICAL ALERTS',
      value: '03',
      subtitle: 'Requires immediate review',
      icon: '🚨',
      color: 'text-red-600'
    }
  ]

  const activityLogs = [
    {
      date: 'Oct 24, 2023',
      time: '11:30 AM',
      employee: {
        name: 'Rajesh Kumar',
        avatar: '👤'
      },
      action: 'CREATE',
      module: 'Jobs',
      details: 'Created new listing "Senior Urban Planner - Municipal Corporation"',
      actionColor: 'bg-green-100 text-green-800'
    },
    {
      date: 'Oct 24, 2023',
      time: '10:45 AM',
      employee: {
        name: 'Ananya Singh',
        avatar: '👤'
      },
      action: 'UPDATE',
      module: 'Applications',
      details: 'Updated status for App #RL-9021 to "Interview Scheduled"',
      actionColor: 'bg-blue-100 text-blue-800'
    },
    {
      date: 'Oct 24, 2023',
      time: '10:30 AM',
      employee: {
        name: 'Vikram Mehta',
        avatar: '👤'
      },
      action: 'DELETE',
      module: 'Settings',
      details: 'Removed access for Guest Account #4492',
      actionColor: 'bg-red-100 text-red-800'
    },
    {
      date: 'Oct 23, 2023',
      time: '04:15 PM',
      employee: {
        name: 'System Admin',
        avatar: '🤖'
      },
      action: 'DOWNLOAD',
      module: 'Support',
      details: 'Exported monthly performance report (Sept 2023)',
      actionColor: 'bg-purple-100 text-purple-800'
    },
    {
      date: 'Oct 23, 2023',
      time: '03:30 PM',
      employee: {
        name: 'Rajesh Kumar',
        avatar: '👤'
      },
      action: 'VIEW',
      module: 'Applicants',
      details: 'Viewed confidential medical documents for App #8821',
      actionColor: 'bg-gray-100 text-gray-800'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Activity Logs</h1>
            <p className="text-gray-600">System Audit & Compliance Tracking for Recruitment Modules</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-orange-600 hover:bg-orange-700">
              📥 Download CSV
            </Button>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>📅 Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">{stat.title}</div>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    {stat.subtitle && (
                      <div className="text-xs text-gray-500 mt-1">{stat.subtitle}</div>
                    )}
                    {stat.change && (
                      <div className="text-xs text-green-600 mt-1">{stat.change}</div>
                    )}
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">🔍 Filters:</span>
                <select 
                  value={filters.employee}
                  onChange={(e) => setFilters({...filters, employee: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>All Employees</option>
                  <option>Rajesh Kumar</option>
                  <option>Ananya Singh</option>
                  <option>Vikram Mehta</option>
                </select>
                <select 
                  value={filters.module}
                  onChange={(e) => setFilters({...filters, module: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>All Modules</option>
                  <option>Jobs</option>
                  <option>Applications</option>
                  <option>Settings</option>
                  <option>Support</option>
                </select>
                <select 
                  value={filters.actionType}
                  onChange={(e) => setFilters({...filters, actionType: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>All Action Types</option>
                  <option>CREATE</option>
                  <option>UPDATE</option>
                  <option>DELETE</option>
                  <option>VIEW</option>
                  <option>DOWNLOAD</option>
                </select>
              </div>
              <Button variant="ghost" className="text-orange-600">
                Clear All
              </Button>
            </div>
          </div>
        </Card>

        {/* Activity Logs Table */}
        <Card className="bg-white">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">DATE & TIME</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">EMPLOYEE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ACTION</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">MODULE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.map((log, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-gray-800">{log.date}</div>
                        <div className="text-xs text-gray-500">{log.time}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            {log.employee.avatar}
                          </div>
                          <div className="text-sm font-medium text-gray-800">{log.employee.name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={log.actionColor}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                            {log.module === 'Jobs' ? '💼' : 
                             log.module === 'Applications' ? '📋' :
                             log.module === 'Settings' ? '⚙️' :
                             log.module === 'Support' ? '🎧' : '📄'}
                          </div>
                          <span className="text-sm text-gray-800">{log.module}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-800">{log.details}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing 5 of 12,284 entries
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button className="bg-orange-600 text-white" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <span className="text-gray-500">...</span>
                <Button variant="outline" size="sm">410</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default ActivityLogs