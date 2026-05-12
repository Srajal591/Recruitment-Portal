import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApplicationLayout from '../../components/layouts/ApplicationLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const Documents = () => {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([
    {
      id: 'passport',
      name: 'Passport Photo',
      description: 'JPEG/JPG, Max 100KB x 4.5KB',
      status: 'uploaded',
      required: true
    },
    {
      id: 'signature',
      name: 'Signature',
      description: 'Scanned, Any dark background',
      status: 'pending',
      required: true
    },
    {
      id: 'tenth',
      name: '10th Certificate',
      description: 'PDF/JPG, Max 500KB',
      status: 'select',
      required: true
    },
    {
      id: 'twelfth',
      name: '12th Certificate',
      description: 'PDF/JPG, Max 500KB',
      status: 'select',
      required: true
    },
    {
      id: 'graduation',
      name: 'Graduation Certificate',
      description: 'PDF/JPG, Max 500KB',
      status: 'error',
      required: true,
      error: 'Error: File size too large'
    },
    {
      id: 'category',
      name: 'Category Certificate',
      description: 'PDF/JPG, Max 500KB, Certificate/Affidavit',
      status: 'select',
      required: true
    },
    {
      id: 'aadhar',
      name: 'Aadhar Card (ID Proof)',
      description: 'PDF/JPG, Max 500KB',
      status: 'select',
      required: true
    },
    {
      id: 'driving',
      name: 'Driving License',
      description: 'PDF/JPG, Max 500KB',
      status: 'select',
      required: false
    },
    {
      id: 'computer',
      name: 'Computer Certificate',
      description: 'PDF/JPG, Max 500KB',
      status: 'select',
      required: false
    },
    {
      id: 'domicile',
      name: 'Bihar Domicile Certificate',
      description: 'PDF/JPG, Max 500KB',
      status: 'select',
      required: false
    }
  ])

  const handleNext = () => {
    navigate('/application/review')
  }

  const handlePrevious = () => {
    navigate('/application/address')
  }

  const getStatusButton = (doc) => {
    switch (doc.status) {
      case 'uploaded':
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="text-blue-600 border-blue-200">
              View
            </Button>
            <Button size="sm" variant="outline" className="text-orange-600 border-orange-200">
              Replace
            </Button>
          </div>
        )
      case 'pending':
        return (
          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
            Cancel
          </Button>
        )
      case 'error':
        return (
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            Retry Upload
          </Button>
        )
      default:
        return (
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
            Select File
          </Button>
        )
    }
  }

  const getStatusIcon = (doc) => {
    switch (doc.status) {
      case 'uploaded':
        return (
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'pending':
        return (
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )
    }
  }

  return (
    <ApplicationLayout currentStep={5} title="Document Upload">
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">Document Upload</h2>
            <p className="text-gray-600">Please upload the required documents.</p>
            <div className="flex justify-end">
              <span className="text-sm text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Changes Saved
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Mandatory Documents Checklist */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">Mandatory Documents Checklist</h3>
              </div>

              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(doc)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-800">{doc.name}</h4>
                          {doc.required && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{doc.description}</p>
                        {doc.status === 'pending' && (
                          <div className="text-xs text-yellow-600 mt-1">Uploading... 40%</div>
                        )}
                        {doc.status === 'error' && (
                          <div className="text-xs text-red-600 mt-1">{doc.error}</div>
                        )}
                        {doc.status === 'uploaded' && (
                          <div className="text-xs text-green-600 mt-1">Uploaded</div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {getStatusButton(doc)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-orange-800 mb-1">Important Note</h4>
                  <p className="text-sm text-orange-700">
                    Ensure all documents are clearly legible. Scanned copies should be in high resolution. Failure to provide valid documents will result in immediate rejection of your application.
                  </p>
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

export default Documents