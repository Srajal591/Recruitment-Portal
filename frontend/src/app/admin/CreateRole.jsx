import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const CreateRole = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    roleName: '',
    roleDescription: ''
  })

  const [permissions, setPermissions] = useState({
    jobs: { create: false, view: false, edit: false, delete: false, download: false },
    applications: { create: false, view: false, edit: false, delete: false, download: false },
    analytics: { create: false, view: false, edit: false, delete: false, download: false },
    employees: { create: false, view: false, edit: false, delete: false, download: false },
    paymentSettings: { create: false, view: false, edit: false, delete: false, download: false }
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePermissionChange = (module, action, checked) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: checked
      }
    }))
  }

  const handleSelectAll = (module) => {
    const allSelected = Object.values(permissions[module]).every(val => val)
    const newValue = !allSelected
    
    setPermissions(prev => ({
      ...prev,
      [module]: {
        create: newValue,
        view: newValue,
        edit: newValue,
        delete: newValue,
        download: newValue
      }
    }))
  }

  const getActivePermissions = () => {
    let count = 0
    Object.values(permissions).forEach(module => {
      Object.values(module).forEach(permission => {
        if (permission) count++
      })
    })
    return count
  }

  const getAccessLevel = () => {
    const total = getActivePermissions()
    if (total >= 15) return { level: 'Senior Auditor', color: 'text-red-600' }
    if (total >= 10) return { level: 'Partial Admin', color: 'text-orange-600' }
    if (total >= 5) return { level: 'Standard User', color: 'text-blue-600' }
    return { level: 'Limited Access', color: 'text-gray-600' }
  }

  const modules = [
    {
      id: 'jobs',
      name: 'Jobs',
      icon: '💼',
      description: 'Job posting management and recruitment workflows'
    },
    {
      id: 'applications',
      name: 'Applications',
      icon: '📋',
      description: 'Candidate application processing and status updates'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: '📊',
      description: 'Performance metrics and recruitment insights'
    },
    {
      id: 'employees',
      name: 'Employees',
      icon: '👥',
      description: 'Staff management and organizational structure'
    },
    {
      id: 'paymentSettings',
      name: 'Payment Settings',
      icon: '💳',
      description: 'Financial configurations and payment gateways'
    }
  ]

  const actions = [
    { id: 'create', name: 'CREATE', color: 'text-green-600' },
    { id: 'view', name: 'VIEW', color: 'text-blue-600' },
    { id: 'edit', name: 'EDIT', color: 'text-yellow-600' },
    { id: 'delete', name: 'DELETE', color: 'text-red-600' },
    { id: 'download', name: 'DOWNLOAD', color: 'text-purple-600' }
  ]

  const handleSave = () => {
    console.log('Creating role:', { formData, permissions })
    navigate('/admin/roles')
  }

  const accessLevel = getAccessLevel()

  return (
    <AdminLayout>
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create New Role</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-white">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    📝
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role Name
                    </label>
                    <Input
                      value={formData.roleName}
                      onChange={(e) => handleInputChange('roleName', e.target.value)}
                      placeholder="e.g., Senior Auditor"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role Description
                    </label>
                    <textarea
                      value={formData.roleDescription}
                      onChange={(e) => handleInputChange('roleDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Define the core responsibilities and scope of this role..."
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Permission Matrix */}
            <Card className="bg-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      🔐
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Permission Matrix</h3>
                  </div>
                  <Button variant="ghost" className="text-orange-600">
                    Full Access
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">MODULE</th>
                        {actions.map((action) => (
                          <th key={action.id} className="text-center py-3 px-4 font-medium text-gray-500 text-sm">
                            {action.name}
                          </th>
                        ))}
                        <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">
                          SELECT ALL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map((module) => (
                        <tr key={module.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                {module.icon}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{module.name}</div>
                                <div className="text-xs text-gray-500">{module.description}</div>
                              </div>
                            </div>
                          </td>
                          {actions.map((action) => (
                            <td key={action.id} className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={permissions[module.id][action.id]}
                                onChange={(e) => handlePermissionChange(module.id, action.id, e.target.checked)}
                                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                              />
                            </td>
                          ))}
                          <td className="py-4 px-4 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSelectAll(module.id)}
                              className="text-orange-600"
                            >
                              ☑️
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  💡 Changes are auto-saved as drafts
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Auto-generated Summary */}
            <Card className="bg-gray-800 text-white">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
                    ⚡
                  </div>
                  <h3 className="font-semibold">Auto-generated Summary</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-300">ACCESS LEVEL</div>
                    <div className={`font-medium ${accessLevel.color}`}>
                      Role "{formData.roleName || 'Untitled'}" currently has {accessLevel.level.toLowerCase()} access.
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-300 flex items-center space-x-2">
                      <span>✅</span>
                      <span>Applications</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {permissions.applications.view ? 'Full access' : 'No permissions currently assigned'}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-300 flex items-center space-x-2">
                      <span>⚠️</span>
                      <span>Analytics & Employees</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {permissions.analytics.view || permissions.employees.view ? 'View-only and Download capability enabled' : 'No permissions currently assigned'}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-300 flex items-center space-x-2">
                      <span>🔒</span>
                      <span>Payments & Support</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {permissions.paymentSettings.view ? 'Limited access granted' : 'No permissions currently assigned'}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-600">
                    <div className="text-sm text-gray-300">Total Permissions:</div>
                    <div className="text-2xl font-bold text-orange-400">{getActivePermissions()} Active</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Completeness */}
            <Card className="bg-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">PROFILE COMPLETENESS</h3>
                  <span className="text-2xl font-bold text-orange-600">
                    {formData.roleName && formData.roleDescription ? '85%' : '45%'}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full" 
                    style={{ width: formData.roleName && formData.roleDescription ? '85%' : '45%' }}
                  ></div>
                </div>
                
                <div className="text-sm text-gray-600">
                  {formData.roleName && formData.roleDescription 
                    ? 'Role configuration is nearly complete. Review permissions and save.'
                    : 'Complete role name and description to proceed with permission assignment.'
                  }
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleSave}
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={!formData.roleName || !formData.roleDescription}
              >
                💾 Save Role
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/roles')}
                className="w-full"
              >
                ❌ Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CreateRole