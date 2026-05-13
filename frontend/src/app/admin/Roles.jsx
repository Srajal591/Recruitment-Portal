import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const Roles = () => {
  const navigate = useNavigate()

  const stats = [
    {
      title: 'TOTAL ACTIVE ROLES',
      value: '08',
      change: '+25% vs LY',
      color: 'border-l-orange-500'
    },
    {
      title: 'USERS ASSIGNED',
      value: '1,242',
      color: 'border-l-blue-500'
    },
    {
      title: 'SYSTEM LOAD',
      value: '64%',
      color: 'border-l-yellow-500'
    }
  ]

  const roles = [
    {
      id: 1,
      name: 'Admin',
      type: 'CRITICAL ROLE',
      description: 'Full system access, user management, and security overrides',
      assignedUsers: [
        { name: 'User 1', avatar: '👤' },
        { name: 'User 2', avatar: '👤' },
        { name: 'User 3', avatar: '👤' },
        { name: '+6', avatar: '+6' }
      ],
      lastUpdated: 'Oct 24, 2023',
      updatedBy: 'Security Group A',
      color: 'bg-red-100 border-red-200'
    },
    {
      id: 2,
      name: 'Staff',
      type: 'STANDARD ROLE',
      description: 'Manage applications, verify documents, and update candidate statuses',
      assignedUsers: [
        { name: 'User 1', avatar: '👤' },
        { name: 'User 2', avatar: '👤' },
        { name: 'User 3', avatar: '👤' },
        { name: '+118', avatar: '+118' }
      ],
      lastUpdated: 'Nov 12, 2023',
      updatedBy: 'Security Group A',
      color: 'bg-orange-100 border-orange-200'
    },
    {
      id: 3,
      name: 'Observer',
      type: 'RESTRICTED ROLE',
      description: 'View-only access to dashboards and recruitment reports for auditing',
      assignedUsers: [
        { name: 'User 1', avatar: '👤' },
        { name: '+42', avatar: '+42' }
      ],
      lastUpdated: 'Dec 01, 2023',
      updatedBy: 'Security Group A',
      color: 'bg-blue-100 border-blue-200'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Role Management</h1>
            <p className="text-gray-600">Define institutional hierarchies and control administrative access across the Bihar Recruitment Portal.</p>
          </div>
          <Button 
            onClick={() => navigate('/admin/roles/create')}
            className="bg-orange-600 hover:bg-orange-700"
          >
            ➕ Create Role
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className={`border-l-4 ${stat.color} bg-white`}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  {stat.change && (
                    <span className="text-xs font-medium text-green-600">{stat.change}</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Access Control List */}
        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Access Control List</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ROLE NAME</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">DESCRIPTION</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ASSIGNED USERS</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">LAST UPDATED</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 ${role.color} rounded-lg flex items-center justify-center border-2`}>
                            <span className="font-bold text-lg">
                              {role.name === 'Admin' ? '🛡️' : 
                               role.name === 'Staff' ? '👥' : '👁️'}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{role.name}</div>
                            <Badge className={
                              role.type === 'CRITICAL ROLE' ? 'bg-red-100 text-red-800' :
                              role.type === 'STANDARD ROLE' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {role.type}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-800 max-w-xs">{role.description}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1">
                          {role.assignedUsers.map((user, index) => (
                            <div 
                              key={index} 
                              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium"
                            >
                              {user.avatar}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-800">{role.lastUpdated}</div>
                        <div className="text-xs text-gray-500">by {role.updatedBy}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            👁️
                          </Button>
                          <Button variant="ghost" size="sm">
                            ✏️
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing 3 of 8 active roles
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button className="bg-orange-600 text-white" size="sm">1</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Quarterly Permission Audit */}
        <Card className="bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  📋
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Quarterly Permission Audit</h3>
                  <p className="text-sm text-gray-600">
                    The next security review is scheduled for January 15th, 2024. Ensure all temporary access roles are revoked before the compliance deadline.
                  </p>
                </div>
              </div>
              <Button className="bg-gray-700 hover:bg-gray-800 text-white">
                Schedule Review
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4">
          <div className="flex items-center space-x-4">
            <span>SERVER: BRP-ADMIN-04</span>
            <span>UPTIME: 99.98%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>DATA ENCRYPTED (AES-256)</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Roles