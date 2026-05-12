import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApplicationLayout from '../../components/layouts/ApplicationLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const Education = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    // 10th Education
    tenthBoard: '',
    tenthSchool: '',
    tenthRollNumber: '',
    tenthYear: '',
    tenthPercentage: '',
    
    // 12th Education
    twelfthBoard: '',
    twelfthStream: '',
    twelfthSchool: '',
    twelfthRollNumber: '',
    twelfthYear: '',
    twelfthPercentage: '',
    
    // Graduation
    graduationDegree: '',
    graduationUniversity: '',
    graduationYear: '',
    graduationPercentage: '',
    hasPostGraduation: false
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    navigate('/application/additional-info')
  }

  const handlePrevious = () => {
    navigate('/application/personal-details')
  }

  return (
    <ApplicationLayout currentStep={2} title="Education">
      <div className="space-y-6">
        {/* 10th Education */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">10th Education (Secondary)</h2>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BOARD / COUNCIL
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. BSEB Patna"
                  value={formData.tenthBoard}
                  onChange={(e) => handleInputChange('tenthBoard', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SCHOOL / INSTITUTE NAME
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your school's full name"
                  value={formData.tenthSchool}
                  onChange={(e) => handleInputChange('tenthSchool', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ROLL NUMBER
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. 240012"
                  value={formData.tenthRollNumber}
                  onChange={(e) => handleInputChange('tenthRollNumber', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YEAR OF PASSING
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.tenthYear}
                  onChange={(e) => handleInputChange('tenthYear', e.target.value)}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 20 }, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PERCENTAGE / CGPA
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. 85.5"
                  value={formData.tenthPercentage}
                  onChange={(e) => handleInputChange('tenthPercentage', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 12th Education */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">12th Education (Senior Secondary)</h2>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BOARD / COUNCIL
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. CBSE / BSEB"
                  value={formData.twelfthBoard}
                  onChange={(e) => handleInputChange('twelfthBoard', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  STREAM
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.twelfthStream}
                  onChange={(e) => handleInputChange('twelfthStream', e.target.value)}
                >
                  <option value="">Select Stream</option>
                  <option value="science">Science</option>
                  <option value="commerce">Commerce</option>
                  <option value="arts">Arts</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SCHOOL / INSTITUTE NAME
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter school name"
                  value={formData.twelfthSchool}
                  onChange={(e) => handleInputChange('twelfthSchool', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ROLL NUMBER
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. 1102932"
                  value={formData.twelfthRollNumber}
                  onChange={(e) => handleInputChange('twelfthRollNumber', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YEAR OF PASSING
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="YYYY"
                  value={formData.twelfthYear}
                  onChange={(e) => handleInputChange('twelfthYear', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PERCENTAGE (%)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. 92.0"
                  value={formData.twelfthPercentage}
                  onChange={(e) => handleInputChange('twelfthPercentage', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graduation Details */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Graduation Details</h2>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DEGREE NAME
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.graduationDegree}
                  onChange={(e) => handleInputChange('graduationDegree', e.target.value)}
                >
                  <option value="">Select Degree</option>
                  <option value="ba">B.A.</option>
                  <option value="bsc">B.Sc.</option>
                  <option value="bcom">B.Com.</option>
                  <option value="btech">B.Tech.</option>
                  <option value="be">B.E.</option>
                  <option value="bba">B.B.A.</option>
                  <option value="bca">B.C.A.</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UNIVERSITY / BOARD
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. Patna University"
                  value={formData.graduationUniversity}
                  onChange={(e) => handleInputChange('graduationUniversity', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YEAR OF PASSING
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="YYYY"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PERCENTAGE / CGPA
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter final aggregate"
                  value={formData.graduationPercentage}
                  onChange={(e) => handleInputChange('graduationPercentage', e.target.value)}
                />
              </div>
            </div>

            {/* Post Graduation Question */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Post Graduation</span>
                <p className="text-sm text-gray-600">Do you have a postgraduate degree?</p>
              </div>
              <div className="flex space-x-4 mt-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('hasPostGraduation', true)}
                  className={`px-6 py-2 rounded-lg ${
                    formData.hasPostGraduation 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('hasPostGraduation', false)}
                  className={`px-6 py-2 rounded-lg ${
                    !formData.hasPostGraduation 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm">Changes saved as draft 14:02</span>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              className="px-6"
            >
              ← Back
            </Button>
            <Button variant="outline" className="px-6">
              Save
            </Button>
            <Button 
              onClick={handleNext}
              className="px-6 bg-orange-600 hover:bg-orange-700"
            >
              Save & Continue →
            </Button>
          </div>
        </div>
      </div>
    </ApplicationLayout>
  )
}

export default Education