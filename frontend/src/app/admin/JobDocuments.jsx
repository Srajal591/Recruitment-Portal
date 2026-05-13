import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { 
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  FileText,
  Upload,
  Image,
  File,
  Settings,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const JobDocuments = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('projectId')
  
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Resume/CV',
      required: true,
      formats: ['PDF', 'DOC', 'DOCX'],
      maxSize: '5MB',
      description: 'Upload your latest resume or curriculum vitae'
    },
    {
      id: 2,
      name: 'Educational Certificates',
      required: true,
      formats: ['PDF', 'JPG', 'PNG'],
      maxSize: '10MB',
      description: 'Upload all educational qualification certificates'
    },
    {
      id: 3,
      name: 'Experience Letters',
      required: false,
      formats: ['PDF', 'DOC', 'DOCX'],
      maxSize: '5MB',
      description: 'Upload experience/service letters from previous employers'
    },
    {
      id: 4,
      name: 'Identity Proof',
      required: true,
      formats: ['PDF', 'JPG', 'PNG'],
      maxSize: '2MB',
      description: 'Upload government issued identity proof (Aadhar, PAN, etc.)'
    }
  ])

  const [newDocument, setNewDocument] = useState({
    name: '',
    required: false,
    formats: [],
    maxSize: '5MB',
    description: ''
  })

  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddDocument = () => {
    if (newDocument.name.trim()) {
      setDocuments([...documents, {
        id: Date.now(),
        ...newDocument
      }])
      setNewDocument({
        name: '',
        required: false,
        formats: [],
        maxSize: '5MB',
        description: ''
      })
      setShowAddForm(false)
    }
  }

  const handleRemoveDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  const handleNext = () => {
    navigate('/admin/jobs/create/payment')
  }

  const handlePrevious = () => {
    navigate('/admin/jobs/create/form-builder')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Required Documents</h1>
            <p className="text-gray-600">Configure documents that candidates need to upload</p>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Document Requirements</h3>
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Document</span>
              </Button>
            </div>

            {/* Add Document Form */}
            {showAddForm && (
              <Card className="p-4 border-2 border-dashed border-gray-300">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Name
                    </label>
                    <input
                      type="text"
                      value={newDocument.name}
                      onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter document name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newDocument.description}
                      onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter document description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Allowed Formats
                      </label>
                      <select
                        multiple
                        value={newDocument.formats}
                        onChange={(e) => setNewDocument({
                          ...newDocument, 
                          formats: Array.from(e.target.selectedOptions, option => option.value)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="PDF">PDF</option>
                        <option value="DOC">DOC</option>
                        <option value="DOCX">DOCX</option>
                        <option value="JPG">JPG</option>
                        <option value="PNG">PNG</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max File Size
                      </label>
                      <select
                        value={newDocument.maxSize}
                        onChange={(e) => setNewDocument({...newDocument, maxSize: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="1MB">1MB</option>
                        <option value="2MB">2MB</option>
                        <option value="5MB">5MB</option>
                        <option value="10MB">10MB</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Required
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newDocument.required}
                          onChange={(e) => setNewDocument({...newDocument, required: e.target.checked})}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">Required document</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddDocument}>
                      Add Document
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Documents List */}
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{doc.name}</h4>
                          {doc.required && (
                            <Badge variant="danger" size="sm">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Formats: {doc.formats.join(', ')}</span>
                          <span>Max Size: {doc.maxSize}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          <Button
            onClick={handleNext}
            className="flex items-center space-x-2"
          >
            <span>Next: Payment</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}

export default JobDocuments