import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApplicationLayout from '../../components/layouts/ApplicationLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const Review = () => {
  const navigate = useNavigate()
  const [declaration, setDeclaration] = useState('')

  const handleNext = () => {
    navigate('/application/post-selection')
  }

  const handlePrevious = () => {
    navigate('/application/documents')
  }

  const personalDetails = {
    fullName: 'Amit Kumar',
    dateOfBirth: '15-06-1995',
    category: 'General-UR',
    fatherName: 'Rajan Kumar',
    motherName: 'Sunita Devi',
    maritalStatus: 'Unmarried',
    religion: 'Hindu',
    identificationMark: 'A mole on the right side of the neck'
  }

  const educationDetails = [
    { level: '10th Class', board: 'BSEB', year: '2011', result: 'First Division' },
    { level: '12th Class', board: 'BSEB', year: '2013', result: 'First Division' },
    { level: 'Graduation', board: 'B.E. Civil', year: '2017', result: '8.2 CGPA' }
  ]

  const additionalInfo = {
    biharDomicile: 'Yes',
    govtEmployee: 'No',
    pwdStatus: 'No'
  }

  const address = {
    permanent: 'Flat 101, Rajendra Nagar, Patna, Bihar- 800016',
    correspondence: '16 of 18 files verified'
  }

  const documents = [
    { name: 'Passport Photo', status: 'Received' },
    { name: '10th Certificate', status: 'Received' },
    { name: 'Graduation Certificate', status: 'Received' },
    { name: 'Category Certificate', status: 'Received' },
    { name: 'Computer Certificate', status: 'Received' },
    { name: 'Domicile of Bihar Certificate', status: 'Received' }
  ]

  return (
    <ApplicationLayout currentStep={6} title="Review your Application">
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">Review your Application</h2>
            <p className="text-gray-600">Please verify all information before final submission. Changes cannot be made after the final step.</p>
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
            {/* Personal Details */}
            <div className="border-l-4 border-orange-400 pl-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Personal Details</h3>
                </div>
                <Button variant="outline" size="sm" className="text-orange-600 border-orange-200">
                  Edit
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">FULL NAME</span>
                  <p className="text-gray-900">{personalDetails.fullName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">DATE OF BIRTH</span>
                  <p className="text-gray-900">{personalDetails.dateOfBirth}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">CATEGORY</span>
                  <p className="text-gray-900">{personalDetails.category}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">FATHER'S NAME</span>
                  <p className="text-gray-900">{personalDetails.fatherName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">MOTHER'S NAME</span>
                  <p className="text-gray-900">{personalDetails.motherName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">MARITAL STATUS</span>
                  <p className="text-gray-900">{personalDetails.maritalStatus}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">RELIGION</span>
                  <p className="text-gray-900">{personalDetails.religion}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">IDENTIFICATION MARK</span>
                  <p className="text-gray-900">{personalDetails.identificationMark}</p>
                </div>
              </div>
            </div>

            {/* Educational Qualifications */}
            <div className="border-l-4 border-blue-400 pl-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Educational Qualifications</h3>
                </div>
                <Button variant="outline" size="sm" className="text-orange-600 border-orange-200">
                  Edit
                </Button>
              </div>
              
              <div className="space-y-3">
                {educationDetails.map((edu, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">LEVEL</span>
                      <p className="text-gray-900">{edu.level}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">BOARD/UNIVERSITY</span>
                      <p className="text-gray-900">{edu.board}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">YEAR</span>
                      <p className="text-gray-900">{edu.year}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">RESULT</span>
                      <p className="text-gray-900">{edu.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-l-4 border-green-400 pl-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Additional Information</h3>
                </div>
                <Button variant="outline" size="sm" className="text-orange-600 border-orange-200">
                  Edit
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">BIHAR DOMICILE</span>
                  <p className="text-gray-900">{additionalInfo.biharDomicile}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">GOVT EMPLOYEE</span>
                  <p className="text-gray-900">{additionalInfo.govtEmployee}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">PWD STATUS</span>
                  <p className="text-gray-900">{additionalInfo.pwdStatus}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-purple-400 pl-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Address</h3>
                  </div>
                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-200">
                    Edit
                  </Button>
                </div>
                <div className="text-sm">
                  <p className="text-gray-900">{address.permanent}</p>
                </div>
              </div>

              <div className="border-l-4 border-teal-400 pl-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Documents Status</h3>
                  </div>
                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-200">
                    Edit
                  </Button>
                </div>
                <div className="text-sm">
                  <p className="text-green-600 font-medium">{address.correspondence}</p>
                </div>
              </div>
            </div>

            {/* Uploaded Documents List */}
            <div className="border-l-4 border-indigo-400 pl-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-indigo-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Uploaded Documents List</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-800">{doc.name}</span>
                    <span className="text-sm text-green-600 font-medium">{doc.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Declaration */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Final Declaration</h3>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="4"
                placeholder="I hereby declare that all the information provided in this application form is true, complete, and correct to the best of my knowledge and belief. I understand that in the event of any information being found false or incorrect or any ineligibility being detected before or after the examination, my candidature is liable to be cancelled/rejected."
                value={declaration}
                onChange={(e) => setDeclaration(e.target.value)}
              />
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
              Next & Continue →
            </Button>
          </div>
        </div>
      </div>
    </ApplicationLayout>
  )
}

export default Review