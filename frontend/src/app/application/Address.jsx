import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApplicationLayout from '../../components/layouts/ApplicationLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const Address = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    // Permanent Address
    permanentAddressLine1: '',
    permanentAddressLine2: '',
    permanentState: 'Bihar',
    permanentDistrict: '',
    permanentPoliceStation: '',
    permanentPincode: '',
    
    // Correspondence Address
    correspondenceAddressLine1: '',
    correspondenceAddressLine2: '',
    correspondenceState: '',
    correspondenceDistrict: '',
    correspondencePoliceStation: '',
    correspondencePincode: '',
    
    // Same as permanent address
    sameAsPermanent: false
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSameAsPermanent = (checked) => {
    setFormData(prev => ({
      ...prev,
      sameAsPermanent: checked,
      ...(checked ? {
        correspondenceAddressLine1: prev.permanentAddressLine1,
        correspondenceAddressLine2: prev.permanentAddressLine2,
        correspondenceState: prev.permanentState,
        correspondenceDistrict: prev.permanentDistrict,
        correspondencePoliceStation: prev.permanentPoliceStation,
        correspondencePincode: prev.permanentPincode
      } : {})
    }))
  }

  const handleNext = () => {
    navigate('/application/documents')
  }

  const handlePrevious = () => {
    navigate('/application/additional-info')
  }

  return (
    <ApplicationLayout currentStep={4} title="Address">
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">Address</h2>
            <p className="text-gray-600">Please provide Your Permanent and Communication Address for Verification.</p>
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
            {/* Permanent Address */}
            <div className="border-l-4 border-orange-400 pl-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">Permanent Address</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="House No, Building Name, Street"
                    value={formData.permanentAddressLine1}
                    onChange={(e) => handleInputChange('permanentAddressLine1', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Landmark, Locality"
                    value={formData.permanentAddressLine2}
                    onChange={(e) => handleInputChange('permanentAddressLine2', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.permanentState}
                      onChange={(e) => handleInputChange('permanentState', e.target.value)}
                    >
                      <option value="Bihar">Bihar</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District / City *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.permanentDistrict}
                      onChange={(e) => handleInputChange('permanentDistrict', e.target.value)}
                    >
                      <option value="">Select District</option>
                      <option value="Patna">Patna</option>
                      <option value="Gaya">Gaya</option>
                      <option value="Muzaffarpur">Muzaffarpur</option>
                      <option value="Bhagalpur">Bhagalpur</option>
                      <option value="Darbhanga">Darbhanga</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Police Station *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Name of Police Station"
                      value={formData.permanentPoliceStation}
                      onChange={(e) => handleInputChange('permanentPoliceStation', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{6}"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="6 digit code"
                      value={formData.permanentPincode}
                      onChange={(e) => handleInputChange('permanentPincode', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Correspondence Address */}
            <div className="border-l-4 border-blue-400 pl-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Correspondence Address</h3>
                </div>
                
                <label className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-700">
                  <input
                    type="checkbox"
                    checked={formData.sameAsPermanent}
                    onChange={(e) => handleSameAsPermanent(e.target.checked)}
                    className="text-white focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium">Same as Permanent Address</span>
                </label>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    disabled={formData.sameAsPermanent}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      formData.sameAsPermanent ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                    placeholder="H.No 45, Rajendra Nagar"
                    value={formData.correspondenceAddressLine1}
                    onChange={(e) => handleInputChange('correspondenceAddressLine1', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    disabled={formData.sameAsPermanent}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      formData.sameAsPermanent ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                    placeholder="Near City Market"
                    value={formData.correspondenceAddressLine2}
                    onChange={(e) => handleInputChange('correspondenceAddressLine2', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <select
                      disabled={formData.sameAsPermanent}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        formData.sameAsPermanent ? 'bg-gray-100 text-gray-500' : ''
                      }`}
                      value={formData.correspondenceState}
                      onChange={(e) => handleInputChange('correspondenceState', e.target.value)}
                    >
                      <option value="">Bihar</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District / City
                    </label>
                    <select
                      disabled={formData.sameAsPermanent}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        formData.sameAsPermanent ? 'bg-gray-100 text-gray-500' : ''
                      }`}
                      value={formData.correspondenceDistrict}
                      onChange={(e) => handleInputChange('correspondenceDistrict', e.target.value)}
                    >
                      <option value="">Patna</option>
                      <option value="Gaya">Gaya</option>
                      <option value="Muzaffarpur">Muzaffarpur</option>
                    </select>
                  </div>
                </div>
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

export default Address