import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApplicationLayout from '../../components/layouts/ApplicationLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const AdditionalInfo = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    // Government Employment
    isGovtEmployee: false,
    departmentName: '',
    yearsOfService: '',
    
    // Special Categories
    isExServiceman: false,
    isPwD: true,
    disabilityType: 'locomotor',
    disabilityPercentage: '45',
    
    // Special Qualifications
    drivingLicense: 'yes',
    drivingLicenseType: 'LMV (Light Motor Vehicle)',
    computerCertificate: 'dca',
    computerCertificateDetails: 'DCA (Diploma in Computer Applications)',
    
    // Subject Combination
    subjectCombination: 'english-hindi'
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    navigate('/application/address')
  }

  const handlePrevious = () => {
    navigate('/application/education')
  }

  return (
    <ApplicationLayout currentStep={3} title="Additional Details">
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">Additional Details</h2>
            <p className="text-gray-600">Please provide supplementary information for eligibility verification.</p>
            <div className="flex justify-end">
              <span className="text-sm text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Changes Saved
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Government Employment Status */}
            <div className="border-l-4 border-orange-400 pl-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">Government Employment Status</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Are you a Government employee (3+ years)?</p>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('isGovtEmployee', true)}
                      className={`px-8 py-3 rounded-lg border-2 transition-all ${
                        formData.isGovtEmployee 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-300 text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      YES
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('isGovtEmployee', false)}
                      className={`px-8 py-3 rounded-lg border-2 transition-all ${
                        !formData.isGovtEmployee 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-300 text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      NO
                    </button>
                  </div>
                </div>
                
                {formData.isGovtEmployee && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g. Department of Education"
                        value={formData.departmentName}
                        onChange={(e) => handleInputChange('departmentName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Service
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="4"
                        value={formData.yearsOfService}
                        onChange={(e) => handleInputChange('yearsOfService', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Special Category Details */}
            <div className="border-l-4 border-yellow-400 pl-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">Special Category Details</h3>
              </div>
              
              <div className="space-y-6">
                {/* Ex-serviceman */}
                <div>
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-sm font-medium text-gray-700">Ex-serviceman?</span>
                    <p className="text-sm text-gray-600">Served from Indian/Defence Forces</p>
                  </div>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="exServiceman"
                        checked={!formData.isExServiceman}
                        onChange={() => handleInputChange('isExServiceman', false)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">No</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="exServiceman"
                        checked={formData.isExServiceman}
                        onChange={() => handleInputChange('isExServiceman', true)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </div>
                </div>

                {/* Person with Disability */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-sm font-medium text-gray-700">Person with Disability (PwD)?</span>
                    <p className="text-sm text-gray-600">Physical disability certificate required</p>
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="pwd"
                        checked={!formData.isPwD}
                        onChange={() => handleInputChange('isPwD', false)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">No</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="pwd"
                        checked={formData.isPwD}
                        onChange={() => handleInputChange('isPwD', true)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </div>

                  {formData.isPwD && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Disability Type
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          value={formData.disabilityType}
                          onChange={(e) => handleInputChange('disabilityType', e.target.value)}
                        >
                          <option value="locomotor">Locomotor Disability</option>
                          <option value="visual">Visual Impairment</option>
                          <option value="hearing">Hearing Impairment</option>
                          <option value="intellectual">Intellectual Disability</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Percentage of Disability (%)
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="45"
                          value={formData.disabilityPercentage}
                          onChange={(e) => handleInputChange('disabilityPercentage', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Special Qualifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-orange-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <h4 className="font-medium text-gray-800">Special Qualifications</h4>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driving License?
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.drivingLicense}
                      onChange={(e) => handleInputChange('drivingLicense', e.target.value)}
                    >
                      <option value="yes">Yes (LMV Light Motor Vehicle)</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Computer Certificate?
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.computerCertificate}
                      onChange={(e) => handleInputChange('computerCertificate', e.target.value)}
                    >
                      <option value="dca">DCA (Diploma in Computer Applications)</option>
                      <option value="pgdca">PGDCA</option>
                      <option value="other">Other</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-orange-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="font-medium text-gray-800">Subject Combination</h4>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      Choose your preferred subject combination for the written proficiency test as per regional requirements.
                    </p>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Combination
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.subjectCombination}
                      onChange={(e) => handleInputChange('subjectCombination', e.target.value)}
                    >
                      <option value="english-hindi">English + Hindi</option>
                      <option value="hindi-urdu">Hindi + Urdu</option>
                      <option value="english-bengali">English + Bengali</option>
                    </select>
                    
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-blue-700">
                          <strong>NOTE: SELECTED SUBJECT COMBINATION CANNOT BE ALTERED AFTER THE FINAL SUBMISSION AND WILL BE PRINTED ON THE ADMIT CARD</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

export default AdditionalInfo