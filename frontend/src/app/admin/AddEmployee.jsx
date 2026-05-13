import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Settings, X } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const AddEmployee = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    
    // Employment Details
    department: '',
    roleDesignation: '',
    employeeId: 'BR-2024-8942',
    dateOfJoining: '',
    
    // Security & Access
    officialEmail: '',
    temporaryPassword: '',
    systemRole: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    console.log('Creating employee:', formData)
    // API call to create employee
    navigate('/admin/employees')
  }

  const systemRoles = [
    {
      id: 'admin',
      title: 'Admin',
      description: 'Full system access, user management, and audit logs',
      icon: '🛡️',
      selected: formData.systemRole === 'admin'
    },
    {
      id: 'reviewer',
      title: 'Reviewer',
      description: 'Application review, profile assessments, and interview portal',
      icon: '✅',
      selected: formData.systemRole === 'reviewer'
    },
    {
      id: 'support',
      title: 'Support',
      description: 'Helpdesk access, ticket resolution, and applicant assistance',
      icon: '🎧',
      selected: formData.systemRole === 'support'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Add a New Employee</h1>
            <p className="text-gray-600">Create New Profile</p>
            <p className="text-sm text-gray-500">Register a new employee to the central recruitment administration system.</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-600">SYSTEM ONLINE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <Card className="bg-white">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    👤
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Personal Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      FULL NAME
                    </label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter legal full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DATE OF BIRTH
                    </label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      placeholder="mm/dd/yyyy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GENDER
                    </label>
                    <div className="flex space-x-4">
                      {['Male', 'Female', 'Other'].map((gender) => (
                        <label key={gender} className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CONTACT NUMBER
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                        +91
                      </span>
                      <Input
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        placeholder="98765 43210"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Employment Details */}
            <Card className="bg-white">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    💼
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Employment Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DEPARTMENT
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Department</option>
                      <option value="Public Works">Public Works</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Finance">Finance</option>
                      <option value="IT">Information Technology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ROLE / DESIGNATION
                    </label>
                    <Input
                      value={formData.roleDesignation}
                      onChange={(e) => handleInputChange('roleDesignation', e.target.value)}
                      placeholder="e.g. Senior Reviewer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      EMPLOYEE ID
                    </label>
                    <div className="flex">
                      <Input
                        value={formData.employeeId}
                        onChange={(e) => handleInputChange('employeeId', e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" className="ml-2 text-xs">
                        AUTO-GENERATED
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DATE OF JOINING
                    </label>
                    <Input
                      type="date"
                      value={formData.dateOfJoining}
                      onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                      placeholder="mm/dd/yyyy"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Security & Access */}
            <Card className="bg-white">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Security & Access</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OFFICIAL EMAIL
                    </label>
                    <Input
                      type="email"
                      value={formData.officialEmail}
                      onChange={(e) => handleInputChange('officialEmail', e.target.value)}
                      placeholder="employee.name@bihar.gov.in"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TEMPORARY PASSWORD
                    </label>
                    <div className="flex">
                      <Input
                        type="password"
                        value={formData.temporaryPassword}
                        onChange={(e) => handleInputChange('temporaryPassword', e.target.value)}
                        placeholder="••••••••"
                        className="flex-1"
                      />
                      <Button variant="outline" className="ml-2">
                        👁️
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    SYSTEM ROLE
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {systemRoles.map((role) => (
                      <div
                        key={role.id}
                        onClick={() => handleInputChange('systemRole', role.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          role.selected 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{role.icon}</div>
                          <div className="font-semibold text-gray-800 mb-1">{role.title}</div>
                          <div className="text-xs text-gray-600">{role.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                    <div className="font-medium">
                      Role "{formData.systemRole || 'Not Selected'}" currently has partial administrative access.
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-300 flex items-center space-x-2">
                      <span>✅</span>
                      <span>Applications</span>
                    </div>
                    <div className="text-xs text-gray-400">Full access (Create, View, Edit, Download)</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-300 flex items-center space-x-2">
                      <span>⚠️</span>
                      <span>Analytics & Employees</span>
                    </div>
                    <div className="text-xs text-gray-400">View-only and Download capability enabled</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-300 flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Payments & Support</span>
                    </div>
                    <div className="text-xs text-gray-400">No permissions currently assigned</div>
                  </div>

                  <div className="pt-4 border-t border-gray-600">
                    <div className="text-sm text-gray-300">Total Permissions:</div>
                    <div className="text-2xl font-bold text-orange-400">12 Active</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Completeness */}
            <Card className="bg-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">PROFILE COMPLETENESS</h3>
                  <span className="text-2xl font-bold text-orange-600">65%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full" style={{ width: '65%' }}></div>
                </div>
                
                <div className="text-sm text-gray-600">
                  Complete all required fields to enable full system access and role assignment.
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleSubmit}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Create Employee
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
              >
                💾 Save & Add Another
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin/employees')}
                className="w-full text-gray-600"
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

export default AddEmployee