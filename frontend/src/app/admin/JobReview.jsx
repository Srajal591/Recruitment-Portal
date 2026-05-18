import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import JobStepProgress from './JobStepProgress'
import {
  ArrowLeft, CheckCircle, FileText, GraduationCap,
  CreditCard, Calendar, Edit, Loader2, AlertTriangle
} from 'lucide-react'
import { adminService } from '../../services/admin.service'

const STORAGE_KEY = 'job_draft'

// Build the update payload — strips create-only fields and cleans empty values
// so Zod doesn't reject them on the update call
const buildUpdatePayload = (draft) => {
  const {
    projectId: _pid, title: _t, postCode: _pc, department: _d,
    ...rest
  } = draft

  // Remove keys with undefined, null, or empty string values at top level
  const clean = {}
  for (const [key, value] of Object.entries(rest)) {
    if (value === undefined || value === null || value === '') continue
    // For nested objects, only include if they have at least one meaningful value
    if (typeof value === 'object' && !Array.isArray(value)) {
      const nested = {}
      for (const [k, v] of Object.entries(value)) {
        if (v !== undefined && v !== null && v !== '') nested[k] = v
      }
      if (Object.keys(nested).length > 0) clean[key] = nested
    } else if (Array.isArray(value)) {
      if (value.length > 0) clean[key] = value
    } else {
      clean[key] = value
    }
  }
  return clean
}

const JobReview = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('project')
  const [isPublishing, setIsPublishing] = useState(false)

  // Read accumulated draft from sessionStorage
  const draft = (() => {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') }
    catch { return {} }
  })()

  const missingRequired = !draft.title || !draft.postCode || !draft.department || !draft.projectId || !/^[a-f\d]{24}$/i.test(draft.projectId || '')

  const missingFields = [
    (!draft.projectId || !/^[a-f\d]{24}$/i.test(draft.projectId)) && 'Project — go back to Jobs, select a project, then click Create Job',
    !draft.title && 'Job Title (Step 1)',
    !draft.postCode && 'Post Code (Step 1)',
    !draft.department && 'Department (Step 1)',
  ].filter(Boolean)

  // Step 1: Create job as draft
  const { mutateAsync: createJob } = useMutation({
    mutationFn: adminService.createJob,
  })

  // Step 2: Update job with all details
  const { mutateAsync: updateJob } = useMutation({
    mutationFn: ({ id, data }) => adminService.updateJob(id, data),
  })

  // Step 3: Publish job
  const { mutateAsync: publishJob } = useMutation({
    mutationFn: adminService.publishJob,
  })

  // Validate projectId is a valid MongoDB ObjectId (24 hex chars)
  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id)

  const handleSaveDraft = async () => {
    if (missingRequired) {
      toast.error('Please complete Step 1 (Basic Info) first')
      return
    }
    if (!isValidObjectId(draft.projectId)) {
      toast.error('Invalid project ID. Please go back to Jobs, select a project, and start again.')
      return
    }
    try {
      setIsPublishing(true)
      const createPayload = {
        projectId: draft.projectId,
        title: draft.title,
        postCode: draft.postCode,
        department: draft.department,
      }
      const createRes = await createJob(createPayload)
      const jobId = createRes?.job?._id
      if (!jobId) throw new Error('Job creation failed — no job ID returned')
      const updatePayload = buildUpdatePayload(draft)
      if (Object.keys(updatePayload).length > 0) {
        await updateJob({ id: jobId, data: updatePayload })
      }
      toast.success('Job saved as draft')
      sessionStorage.removeItem(STORAGE_KEY)
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      navigate('/admin/jobs')
    } catch (err) {
      toast.error(err.message || 'Failed to save job')
    } finally {
      setIsPublishing(false)
    }
  }

  const handlePublish = async () => {
    if (missingRequired) {
      toast.error('Please complete Step 1 (Basic Info) first')
      return
    }
    if (!isValidObjectId(draft.projectId)) {
      toast.error('Invalid project ID. Please go back to Jobs, select a project, and start again.')
      return
    }
    if (!draft.applicationDeadline) {
      toast.error('Application deadline is required to publish')
      return
    }
    if (!draft.totalPosts || draft.totalPosts < 1) {
      toast.error('Total posts is required to publish')
      return
    }
    try {
      setIsPublishing(true)
      const createPayload = {
        projectId: draft.projectId,
        title: draft.title,
        postCode: draft.postCode,
        department: draft.department,
      }
      const createRes = await createJob(createPayload)
      const jobId = createRes?.job?._id
      if (!jobId) throw new Error('Job creation failed — no job ID returned')
      const updatePayload = buildUpdatePayload(draft)
      if (Object.keys(updatePayload).length > 0) {
        await updateJob({ id: jobId, data: updatePayload })
      }
      await publishJob(jobId)
      toast.success('Job published successfully!')
      sessionStorage.removeItem(STORAGE_KEY)
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      navigate('/admin/jobs')
    } catch (err) {
      toast.error(err.message || 'Failed to publish job')
    } finally {
      setIsPublishing(false)
    }
  }

  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
      <span className="text-sm font-medium text-gray-500 sm:w-36 flex-shrink-0">{label}:</span>
      <span className="text-sm text-gray-900">{value || '—'}</span>
    </div>
  )

  const editStep = (step) => navigate(`/admin/jobs/create/${step}${projectId ? `?project=${projectId}` : ''}`)

  return (
    <AdminLayout title="Create Job - Review">
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Create Job Posting</h1>
              <p className="text-gray-500 text-sm mt-0.5">Step 6 of 6: Review & Publish</p>
            </div>
            <Badge className="bg-orange-100 text-orange-800">Ready to Publish</Badge>
          </div>

          <JobStepProgress currentStep={6} projectId={projectId} clickable />

          {missingRequired && (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Missing required fields:</p>
                <ul className="text-sm mt-1 list-disc list-inside">
                  {missingFields.map(f => <li key={f}>{f}</li>)}
                </ul>
                <p className="text-sm mt-2">Go back to Step 1 to complete these fields.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-800">Basic Information</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => editStep('basic-info')} className="text-orange-600 hover:bg-orange-50">
                      <Edit className="w-3.5 h-3.5 mr-1" />Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <InfoRow label="Job Title" value={draft.title} />
                  <InfoRow label="Post Code" value={draft.postCode} />
                  <InfoRow label="Department" value={draft.department} />
                  <InfoRow label="Category" value={draft.category} />
                  <InfoRow label="Job Type" value={draft.jobType} />
                  <InfoRow label="Total Posts" value={draft.totalPosts} />
                  <InfoRow label="Work Location" value={draft.workLocation} />
                  {draft.salaryRange?.min && (
                    <InfoRow label="Salary Range" value={`₹${draft.salaryRange.min?.toLocaleString('en-IN')} – ₹${draft.salaryRange.max?.toLocaleString('en-IN')}`} />
                  )}
                </CardContent>
              </Card>

              {/* Eligibility */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-800">Eligibility Criteria</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => editStep('eligibility')} className="text-orange-600 hover:bg-orange-50">
                      <Edit className="w-3.5 h-3.5 mr-1" />Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {draft.ageLimit?.min && <InfoRow label="Age Limit" value={`${draft.ageLimit.min} – ${draft.ageLimit.max} years`} />}
                  {draft.education?.essential?.length > 0 && (
                    <InfoRow label="Essential Qual." value={draft.education.essential.map(e => `${e.degree}${e.specialization ? ` (${e.specialization})` : ''}`).join(', ')} />
                  )}
                  {draft.experience?.required && <InfoRow label="Experience" value={`${draft.experience.years} years (${draft.experience.type})`} />}
                </CardContent>
              </Card>

              {/* Documents */}
              {draft.documentRequirements?.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-gray-800">Required Documents</h3>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => editStep('documents')} className="text-orange-600 hover:bg-orange-50">
                        <Edit className="w-3.5 h-3.5 mr-1" />Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {draft.documentRequirements.map((doc, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {doc.name} {doc.required ? '' : '(Optional)'}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-5">
              {/* Payment */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-800">Application Fees</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => editStep('basic-info')} className="text-orange-600 hover:bg-orange-50">
                      <Edit className="w-3.5 h-3.5 mr-1" />Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>General/OBC</span>
                    <span className="font-medium">₹{draft.applicationFee?.general || 0}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>SC/ST</span>
                    <span className="font-medium">₹{draft.applicationFee?.scSt || 0}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>PWD</span>
                    <span className="font-medium">₹{draft.applicationFee?.pwd || 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Dates */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-800">Important Dates</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5 text-sm">
                  <InfoRow label="Deadline" value={draft.applicationDeadline ? new Date(draft.applicationDeadline).toLocaleDateString('en-IN') : '—'} />
                  <InfoRow label="Exam Date" value={draft.examDate ? new Date(draft.examDate).toLocaleDateString('en-IN') : '—'} />
                </CardContent>
              </Card>

              {/* Publish Actions */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-5 space-y-3">
                  <p className="text-sm text-orange-800 font-medium">
                    Review all information carefully. Published jobs are immediately visible to candidates.
                  </p>
                  <Button onClick={handlePublish} disabled={isPublishing || missingRequired}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    {isPublishing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Publishing...</> : <><CheckCircle className="w-4 h-4 mr-2" />Publish Job</>}
                  </Button>
                  <Button variant="outline" onClick={handleSaveDraft} disabled={isPublishing || missingRequired}
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-100">
                    Save as Draft
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => navigate(`/admin/jobs/create/payment${projectId ? `?project=${projectId}` : ''}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />Back: Payment
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSaveDraft} disabled={isPublishing}>Save Draft</Button>
              <Button onClick={handlePublish} disabled={isPublishing || missingRequired}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8">
                {isPublishing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Publishing...</> : 'Publish Job'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default JobReview
