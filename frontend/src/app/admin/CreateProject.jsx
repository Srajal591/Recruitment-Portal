import { useState } from 'react'
import { Calendar, FileText, Settings, Shield, Building } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'

const CreateProject = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    state: 'Bihar',
    department: '',
    description: '',
    startDate: '',
    endDate: '',
    currency: 'INR: Indian Rupee (₹)',
    applicationMode: 'Online Only',
    assignedEmployees: []
  })

  const [selectedEmployees] = useState([
    { id: 1, name: 'Super Admin', role: 'Full Access', color: 'primary' },
    { id: 2, name: 'Reviewer Board', role: 'Review Access', color: 'success' },
    { id: 3, name: 'District Coordinator', role: 'Limited Access', color: 'warning' }
  ])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <AdminLayout title="Create Project">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2">Create Project</h1>
          <p className="text-text-secondary">
            Set up a new recruitment drive or administrative project for the Bihar State Board.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-text-primary">Basic Info</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Project Name"
                  placeholder="e.g. Bihar Police Recruitment 2024 Phase II"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">State</label>
                    <select 
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    >
                      <option value="Bihar">Bihar</option>
                    </select>
                  </div>
                  
                  <Input
                    label="Department / Ministry"
                    placeholder="e.g. Home Affairs"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="4"
                    placeholder="Briefly describe the purpose and scope of this recruitment project..."
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
                  <Settings className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-text-primary">Configuration</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Currency</label>
                    <select 
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    >
                      <option value="INR: Indian Rupee (₹)">INR: Indian Rupee (₹)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Application Mode</label>
                    <select 
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-text-primary">Access Control</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Assign Employees or Roles
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, email or role..."
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedEmployees.map((employee) => (
                    <Badge key={employee.id} variant={employee.color} className="flex items-center space-x-2 px-3 py-1">
                      <span>{employee.name}</span>
                      <button className="ml-2 text-xs">×</button>
                    </Badge>
                  ))}
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
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-text-primary">Project Timeline</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
                
                <Input
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Project dates align with the official gazette notification for Bihar State recruitment.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Initial Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <span className="text-primary">📋</span>
                  <h3 className="font-semibold text-text-primary">Initial Status</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="status" value="draft" defaultChecked className="text-primary" />
                    <div>
                      <div className="font-medium text-text-primary">Draft</div>
                      <div className="text-sm text-text-secondary">Only admins can view</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="status" value="active" className="text-primary" />
                    <div>
                      <div className="font-medium text-text-primary">Active</div>
                      <div className="text-sm text-text-secondary">Live for applications</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="status" value="archived" className="text-primary" />
                    <div>
                      <div className="font-medium text-text-primary">Archived</div>
                      <div className="text-sm text-text-secondary">Historical records</div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* State Compliance */}
            <Card className="bg-secondary text-white">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Building className="w-6 h-6" />
                    <h3 className="font-semibold">STATE COMPLIANCE</h3>
                  </div>
                  <p className="text-sm opacity-90">
                    All projects must adhere to the 2024 Bihar Civil Service Recruitment Guidelines.
                  </p>
                  <div className="text-xs opacity-75">
                    For Bihar State recruitment.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline">Save as Template</Button>
          <div className="flex space-x-3">
            <Button variant="outline">Cancel</Button>
            <Button>Create Project</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CreateProject