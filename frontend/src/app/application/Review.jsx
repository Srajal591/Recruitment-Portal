import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Loader2, CheckCircle } from 'lucide-react'
import ApplicationLayout from '../../components/layouts/ApplicationLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { candidateService } from '../../services/candidate.service'

const APP_KEY = 'app_draft'
const getAppId = () => { try { return JSON.parse(sessionStorage.getItem(APP_KEY) || '{}').applicationId } catch { return null } }

const DECLARATION_TEXT = 'I hereby declare that all the information provided in this application form is true, complete, and correct to the best of my knowledge and belief. I understand that in the event of any information being found false or incorrect or any ineligibility being detected before or after the examination, my candidature is liable to be cancelled/rejected.'

const Row = ({ label, value }) => value ? (
  <div>
    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
    <p className="text-gray-900 text-sm mt-0.5">{value}</p>
  </div>
) : null

const Review = () => {
  const navigate = useNavigate()
  const applicationId = getAppId()
  const [declaration, setDeclaration] = useState(DECLARATION_TEXT)
  const [accepted, setAccepted] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['application-review', applicationId],
    queryFn: () => candidateService.getApplication(applicationId),
    enabled: Boolean(applicationId),
  })

  const app = data?.application || data

  const { mutate: submitApp, isPending } = useMutation({
    mutationFn: () => candidateService.submitApplication(applicationId, declaration),
    onSuccess: (result) => {
      toast.success('Application submitted successfully!')
      sessionStorage.removeItem(APP_KEY)
      navigate('/application/post-selection', {
        state: { applicationId, totalFee: app?.totalFee || 0 }
      })
    },
    onError: (err) => toast.error(err.message || 'Failed to submit application'),
  })

  const handleNext = () => {
    if (!applicationId) { toast.error('Application not found'); navigate('/jobs'); return }
    if (!accepted) { toast.error('Please accept the declaration to continue'); return }
    submitApp()
  }

  if (!applicationId) return (
    <ApplicationLayout currentStep={6} title="Review">
      <div className="p-6 text-center text-gray-500">
        No application found. <button onClick={() => navigate('/jobs')} className="text-orange-600 underline">Browse jobs</button>
      </div>
    </ApplicationLayout>
  )

  const personal = app?.personalDetails || {}
  const education = app?.education || {}
  const additional = app?.additionalInfo || {}
  const address = app?.address || {}
  const documents = app?.documents || []

  return (
    <ApplicationLayout currentStep={6} title="Review your Application">
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">Review your Application</h2>
            <p className="text-gray-600">Please verify all information before final submission. Changes cannot be made after this step.</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {isLoading && <div className="flex items-center gap-2 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" />Loading application data...</div>}

            {/* Personal Details */}
            {Object.keys(personal).length > 0 && (
              <div className="border-l-4 border-orange-400 pl-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Personal Details</h3>
                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-200"
                    onClick={() => navigate('/application/personal-details')}>Edit</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Row label="Full Name" value={personal.fullName} />
                  <Row label="Date of Birth" value={personal.dateOfBirth ? new Date(personal.dateOfBirth).toLocaleDateString('en-IN') : null} />
                  <Row label="Gender" value={personal.gender} />
                  <Row label="Category" value={personal.category?.toUpperCase()} />
                  <Row label="Father's Name" value={personal.fatherName} />
                  <Row label="Mother's Name" value={personal.motherName} />
                  <Row label="Marital Status" value={personal.maritalStatus} />
                  <Row label="Religion" value={personal.religion} />
                  <Row label="Bihar Domicile" value={personal.isDomicileOfBihar != null ? (personal.isDomicileOfBihar ? 'Yes' : 'No') : null} />
                  <Row label="Mobile" value={personal.registeredMobile} />
                </div>
              </div>
            )}

            {/* Education */}
            {(education.tenth || education.twelfth || education.graduation) && (
              <div className="border-l-4 border-blue-400 pl-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Educational Qualifications</h3>
                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-200"
                    onClick={() => navigate('/application/education')}>Edit</Button>
                </div>
                <div className="space-y-3">
                  {education.tenth && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                      <Row label="Level" value="10th Class" />
                      <Row label="Board" value={education.tenth.board} />
                      <Row label="Year" value={education.tenth.year} />
                      <Row label="Percentage" value={education.tenth.percentage ? `${education.tenth.percentage}%` : null} />
                    </div>
                  )}
                  {education.twelfth && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                      <Row label="Level" value="12th Class" />
                      <Row label="Board" value={education.twelfth.board} />
                      <Row label="Year" value={education.twelfth.year} />
                      <Row label="Percentage" value={education.twelfth.percentage ? `${education.twelfth.percentage}%` : null} />
                    </div>
                  )}
                  {education.graduation && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                      <Row label="Level" value="Graduation" />
                      <Row label="Degree" value={education.graduation.degree} />
                      <Row label="Year" value={education.graduation.year} />
                      <Row label="Percentage" value={education.graduation.percentage ? `${education.graduation.percentage}%` : null} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Address */}
            {address.permanent && (
              <div className="border-l-4 border-purple-400 pl-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Address</h3>
                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-200"
                    onClick={() => navigate('/application/address')}>Edit</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Permanent</p>
                    <p className="text-gray-900">{[address.permanent.addressLine1, address.permanent.district, address.permanent.state, address.permanent.pincode].filter(Boolean).join(', ')}</p>
                  </div>
                  {!address.sameAsPermanent && address.correspondence && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Correspondence</p>
                      <p className="text-gray-900">{[address.correspondence.addressLine1, address.correspondence.district, address.correspondence.state, address.correspondence.pincode].filter(Boolean).join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents */}
            {documents.length > 0 && (
              <div className="border-l-4 border-green-400 pl-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Uploaded Documents ({documents.filter(d => d.status === 'uploaded').length}/{documents.length})</h3>
                  <Button variant="outline" size="sm" className="text-orange-600 border-orange-200"
                    onClick={() => navigate('/application/documents')}>Edit</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {documents.map((doc) => (
                    <div key={doc._id} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-800 capitalize">{doc.type.replace(/_/g, ' ')}</span>
                      <span className={`ml-auto text-xs font-medium ${doc.status === 'uploaded' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Declaration */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Final Declaration</h3>
              <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                rows="4" value={declaration} onChange={(e) => setDeclaration(e.target.value)} />
              <label className="flex items-start gap-3 mt-4 cursor-pointer">
                <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                <span className="text-sm text-gray-700">
                  I have read and accept the above declaration. I confirm all information provided is accurate.
                </span>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/application/documents')}>← Back</Button>
          <Button onClick={handleNext} disabled={isPending || !accepted || !applicationId} className="px-6 bg-orange-600 hover:bg-orange-700">
            {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : 'Submit & Continue to Post Selection →'}
          </Button>
        </div>
      </div>
    </ApplicationLayout>
  )
}

export default Review
