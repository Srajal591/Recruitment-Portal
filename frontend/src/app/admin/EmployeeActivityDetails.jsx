import { useState } from 'react'
import { useParams } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const EmployeeActivityDetails = () => {
  const { id } = useParams()
  
  const employee = {
    name: 'Rajesh Kumar',
    designation: 'Senior Recruitment Officer',
    employeeId: '#EMP-8821',
    location: 'Patna HQ',
    status: 'ACTIVE NOW',
    avatar: '👤'
  }

  const stats = [
    {
      title: 'Changes Today',
      value: '24',
      change: '+12%',
      color: 'text-orange-600',
      icon: '📝'
    },
    {
      title: 'Total Changes',
      value: '1,284',
      color: 'text-gray-800',
      icon: '📊'
    },
    {
      title: 'Last Activity',
      value: '10 mins ago',
      color: 'text-blue-600',
      icon: '⏰'
    },
    {
      title: 'Projects Updated',
      value: '12',
      color: 'text-yellow-600',
      icon: '📂'
    },
    {
      title: 'Critical Changes',
      value: '3',
      subtitle: 'Last 7 days',
      color: 'text-red-600',
      icon: '⚠️'
    }
  ]

  const activityLogs = [
    {
      id: 1,
      module: 'Recruitment Plan 2024',
      moduleIcon: '📋',
      action: 'CREATE',
      actionColor: 'bg-green-100 text-green-800',
      details: 'Initiated candidate screening for...',
      ipAddress: '192.168.1.144',
      timestamp: 'Oct 24, 2023 10:24 AM'
    },
    {
      id: 2,
      module: 'Personnel Registry',
      moduleIcon: '👥',
      action: 'UPDATE',
      actionColor: 'bg-blue-100 text-blue-800',
      details: 'Modified clearance hierarchy for...',
      ipAddress: '192.168.1.144',
      timestamp: 'Oct 24, 2023 09:15 AM'
    },
    {
      id: 3,
      module: 'Archived Records',
      moduleIcon: '🗄️',
      action: 'DELETE',
      actionColor: 'bg-red-100 text-red-800',
      details: 'Deleted expired security protocols...',
      ipAddress: '192.168.1.152',
      timestamp: 'Oct 23, 2023 03:45 PM'
    },
    {
      id: 4,
      module: 'Employee Portal',
      moduleIcon: '🏢',
      action: 'UPDATE',
      actionColor: 'bg-blue-100 text-blue-800',
      details: 'Updated bio-metric access logs for...',
      ipAddress: '192.168.1.144',
      timestamp: 'Oct 23, 2023 02:30 PM'
    },
    {
      id: 5,
      module: 'Payroll Disbursement',
      moduleIcon: '💰',
      action: 'CREATE',
      actionColor: 'bg-green-100 text-green-800',
      details: 'Generated monthly payroll batch for...',
      ipAddress: '192.168.1.144',
      timestamp: 'Oct 23, 2023 11:00 AM'
    }
  ]

  const deviceSecurity = [
    {
      device: 'MacBook Pro 14"',
      details: 'Apple Network - 192.168.1.144',
      status: 'SECURE',
      statusColor: 'text-green-600'
    },
    {
      device: 'iPhone 15 Pro',
      details: 'Cellular - 10.0.0.1',
      status: 'SECURE',
      statusColor: 'text-green-600'
    }
  ]

  const activityIntensity = [
    { day: 'MON', value: 15 },
    { day: 'TUE', value: 25 },
    { day: 'WED', value: 35 },
    { day: 'THU', value: 45 },
    { day: 'FRI', value: 30 },
    { day: 'SAT', value: 20 },
    { day: 'SUN', value: 55 }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Activity & Details</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              📞 Contact
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700">
              📥 Export Activity Data
            </Button>
          </div>
        </div>

        {/* Employee Info Card */}
        <Card className="bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                  {employee.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{employee.name}</h2>
                  <p className="text-gray-600">{employee.designation}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{employee.employeeId}</span>
                    <span>📍 {employee.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-800 mb-2">
                  🟢 {employee.status}
                </Badge>
                <div className="text-sm text-gray-500">SYSTEM ONLINE</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <div className="p-6 text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-xs font-medium text-gray-500 mb-1">{stat.title}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                {stat.change && (
                  <div className="text-xs text-green-600 mt-1">{stat.change}</div>
                )}
                {stat.subtitle && (
                  <div className="text-xs text-gray-500 mt-1">{stat.subtitle}</div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Audit Log */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">📋 Activity Audit Log</h3>
                  <div className="flex items-center space-x-3">
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>📅 Date Range</option>
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>📂 All Modules</option>
                      <option>Jobs</option>
                      <option>Applications</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>⚡ Action Type</option>
                      <option>CREATE</option>
                      <option>UPDATE</option>
                      <option>DELETE</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {log.moduleIcon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-800">{log.module}</div>
                          <Badge className={log.actionColor}>
                            {log.action}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{log.details}</div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>🌐 IP ADDRESS: {log.ipAddress}</span>
                          <span>📅 DATE & TIME: {log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing 5 of 1,284 entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Previous</Button>
                    <Button className="bg-orange-600 text-white" size="sm">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <span className="text-gray-500">...</span>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Intensity */}
            <Card className="bg-white">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Intensity (Last 7 Days)</h3>
                <div className="space-y-3">
                  {activityIntensity.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">{day.day}</span>
                      <div className="flex-1 mx-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${day.value}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-800">{day.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Device & Network Integrity */}
            <Card className="bg-white">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Device & Network Integrity</h3>
                <div className="space-y-4">
                  {deviceSecurity.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          {device.device.includes('MacBook') ? '💻' : '📱'}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-800">{device.device}</div>
                          <div className="text-xs text-gray-500">{device.details}</div>
                        </div>
                      </div>
                      <Badge className={`${device.statusColor} bg-green-100`}>
                        {device.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default EmployeeActivityDetails