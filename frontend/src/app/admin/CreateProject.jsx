import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { 
  FileText, 
  Calendar, 
  Settings, 
  Shield, 
  X,
  Search,
  Plus
} from 'lucide-react'

const CreateProject = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    projectName: '',
    state: 'Bihar',
    department: '',
    description: '',
    startDate: '',
    endDate: '',
    currency: 'INR: Indian Rupee (₹)',
    applicationMode: 'Online Only',
    assignedRoles: ['Super Admin', 'Reviewer Board', 'District Coordinator'],
    initialStatus: 'draft'
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateProject = () => {
    // Simulate project creation
    navigate('/admin/projects/1')
  }

  const removeRole = (roleToRemove) => {
    setFormData(prev => ({
      ...prev,
      assignedRoles: prev.assignedRoles.filter(role => role !== roleToRemove)
    }))
  }

  return (
    <AdminLayout title="Create Project">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create Project</h1>
          <p className="text-gray-600">Set up a new recruitment drive or administrative project for the Bihar State Board.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-800">Basic Info</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bihar Police Recruitment 2024 Phase II"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    >
                      <option value="Bihar">Bihar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department / Ministry
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Home Affairs"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Briefly describe the purpose and scope of this recruitment project..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-800">Configuration</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    >
                      <option value="INR: Indian Rupee (₹)">INR: Indian Rupee (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Mode
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.applicationMode}
                      onChange={(e) => handleInputChange('applicationMode', e.target.value)}
                    >
                      <option value="Online Only">Online Only</option>
                      <option value="Offline Only">Offline Only</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-800">Access Control</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Employees or Roles
                  </label>
                  <div className="flex items-center space-x-2 mb-3">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email or role..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.assignedRoles.map((role, index) => (
                      <Badge key={index} className="bg-orange-100 text-orange-800 flex items-center space-x-1">
                        <span>{role}</span>
                        <button onClick={() => removeRole(role)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Timeline */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-800">Project Timeline</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Ensure dates align with the official gazette notification for Bihar State recruitment.
                </p>
              </CardContent>
            </Card>

            {/* Initial Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-800">Initial Status</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status" 
                      value="draft"
                      checked={formData.initialStatus === 'draft'}
                      onChange={(e) => handleInputChange('initialStatus', e.target.value)}
                      className="w-4 h-4 text-orange-600"
                    />
                    <div>
                      <div className="font-medium text-gray-800">Draft</div>
                      <div className="text-xs text-gray-500">Only admins can view</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status" 
                      value="active"
                      checked={formData.initialStatus === 'active'}
                      onChange={(e) => handleInputChange('initialStatus', e.target.value)}
                      className="w-4 h-4 text-orange-600"
                    />
                    <div>
                      <div className="font-medium text-gray-800">Active</div>
                      <div className="text-xs text-gray-500">Live for applications</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status" 
                      value="archived"
                      checked={formData.initialStatus === 'archived'}
                      onChange={(e) => handleInputChange('initialStatus', e.target.value)}
                      className="w-4 h-4 text-orange-600"
                    />
                    <div>
                      <div className="font-medium text-gray-800">Archived</div>
                      <div className="text-xs text-gray-500">Historical record</div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* State Compliance */}
            <Card className="bg-gray-800 text-white">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-white">STATE COMPLIANCE</h3>
                  <p className="text-sm text-gray-300">
                    All projects must adhere to the 2024 Bihar Civil Service Recruitment Guidelines.
                  </p>
                  <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Government Building Image</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">© 2024 Bihar State Recruitment Board. All Rights Reserved.</p>
          <div className="flex space-x-4">
            <Button 
              onClick={handleCreateProject}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
            <Button variant="outline" className="px-6">
              Save as Template
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CreateProject