import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import JobStepProgress from './JobStepProgress'
import { ArrowRight, ArrowLeft, FileText, Calendar, Users, DollarSign } from 'lucide-react'

const STORAGE_KEY = 'job_draft'

const JobBasicInfo = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('project')

  const [formData, setFormData] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
      return {
        jobTitle: saved.title || '',
        postCode: saved.postCode || '',
        department: saved.department || '',
        category: saved.category || 'General',
        totalPosts: saved.totalPosts || '',
        reservedPosts: saved.reservedPosts || { sc: '', st: '', obc: '', ews: '', pwd: '' },
        salaryRange: saved.salaryRange || { min: '', max: '' },
        jobType: saved.jobType || 'Permanent',
        workLocation: saved.workLocation || '',
        applicationFee: saved.applicationFee || { general: '', scSt: '', pwd: '' },
        applicationDeadline: saved.applicationDeadline ? saved.applicationDeadline.split('T')[0] : '',
        examDate: saved.examDate ? saved.examDate.split('T')[0] : '',
        description: saved.description || '',
      }
    } catch { return {
      jobTitle: '', postCode: '', department: '', category: 'General',
      totalPosts: '', reservedPosts: { sc: '', st: '', obc: '', ews: '', pwd: '' },
      salaryRange: { min: '', max: '' }, jobType: 'Permanent', workLocation: '',
      applicationFee: { general: '', scSt: '', pwd: '' },
      applicationDeadline: '', examDate: '', description: '',
    }}
  })
  const [errors, setErrors] = useState({})

  const set = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!formData.jobTitle.trim()) e.jobTitle = 'Job title is required'
    if (!formData.postCode.trim()) e.postCode = 'Post code is required'
    if (!formData.department.trim()) e.department = 'Department is required'
    if (!formData.totalPosts || Number(formData.totalPosts) < 1) e.totalPosts = 'At least 1 post required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (!validate()) return
    // Save to sessionStorage
    const existing = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...existing,
      projectId,
      title: formData.jobTitle.trim(),
      postCode: formData.postCode.trim(),
      department: formData.department.trim(),
      category: formData.category,
      totalPosts: Number(formData.totalPosts),
      reservedPosts: {
        sc: Number(formData.reservedPosts.sc) || 0,
        st: Number(formData.reservedPosts.st) || 0,
        obc: Number(formData.reservedPosts.obc) || 0,
        ews: Number(formData.reservedPosts.ews) || 0,
        pwd: Number(formData.reservedPosts.pwd) || 0,
      },
      salaryRange: {
        min: Number(formData.salaryRange.min) || 0,
        max: Number(formData.salaryRange.max) || 0,
      },
      jobType: formData.jobType,
      workLocation: formData.workLocation,
      applicationFee: {
        general: Number(formData.applicationFee.general) || 0,
        scSt: Number(formData.applicationFee.scSt) || 0,
        pwd: Number(formData.applicationFee.pwd) || 0,
      },
      applicationDeadline: formData.applicationDeadline || undefined,
      examDate: formData.examDate || undefined,
      description: formData.description,
    }))
    navigate(`/admin/jobs/create/eligibility${projectId ? `?project=${projectId}` : ''}`)
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors[field] ? 'border-red-400' : 'border-gray-300'}`

  return (
    <AdminLayout title="Create Job - Basic Info">
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Create Job Posting</h1>
            <p className="text-gray-500 text-sm mt-0.5">Step 1 of 6: Basic Information</p>
          </div>

          <JobStepProgress currentStep={1} projectId={projectId} clickable />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-800">Job Details</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="e.g. Assistant Professor - Physics" className={inputClass('jobTitle')}
                        value={formData.jobTitle} onChange={(e) => set('jobTitle', e.target.value)} />
                      {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Post Code <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="e.g. AP-PHY-001" className={inputClass('postCode')}
                        value={formData.postCode} onChange={(e) => set('postCode', e.target.value)} />
                      {errors.postCode && <p className="text-red-500 text-xs mt-1">{errors.postCode}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="e.g. Department of Physics" className={inputClass('department')}
                        value={formData.department} onChange={(e) => set('department', e.target.value)} />
                      {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.category} onChange={(e) => set('category', e.target.value)}>
                        <option value="General">General</option>
                        <option value="Technical">Technical</option>
                        <option value="Administrative">Administrative</option>
                        <option value="Teaching">Teaching</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                    <textarea rows="4" placeholder="Describe the role, responsibilities, and requirements..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.description} onChange={(e) => set('description', e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-800">Post Details</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Posts <span className="text-red-500">*</span></label>
                      <input type="number" min="1" placeholder="e.g. 50" className={inputClass('totalPosts')}
                        value={formData.totalPosts} onChange={(e) => set('totalPosts', e.target.value)} />
                      {errors.totalPosts && <p className="text-red-500 text-xs mt-1">{errors.totalPosts}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.jobType} onChange={(e) => set('jobType', e.target.value)}>
                        <option value="Permanent">Permanent</option>
                        <option value="Contract">Contract</option>
                        <option value="Temporary">Temporary</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reserved Posts</label>
                    <div className="grid grid-cols-5 gap-3">
                      {['sc','st','obc','ews','pwd'].map(cat => (
                        <div key={cat}>
                          <label className="block text-xs text-gray-500 mb-1 uppercase">{cat}</label>
                          <input type="number" min="0" placeholder="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={formData.reservedPosts[cat]}
                            onChange={(e) => set(`reservedPosts.${cat}`, e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-800">Salary & Location</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary (₹)</label>
                      <input type="number" min="0" placeholder="e.g. 56100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.salaryRange.min} onChange={(e) => set('salaryRange.min', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary (₹)</label>
                      <input type="number" min="0" placeholder="e.g. 177500"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.salaryRange.max} onChange={(e) => set('salaryRange.max', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
                      <input type="text" placeholder="e.g. Patna, Bihar"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.workLocation} onChange={(e) => set('workLocation', e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-800">Application Fees</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[['general','General/OBC (₹)'],['scSt','SC/ST (₹)'],['pwd','PWD (₹)']].map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input type="number" min="0" placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.applicationFee[key]} onChange={(e) => set(`applicationFee.${key}`, e.target.value)} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-800">Important Dates</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                    <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.applicationDeadline} onChange={(e) => set('applicationDeadline', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tentative Exam Date</label>
                    <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={formData.examDate} onChange={(e) => set('examDate', e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={() => navigate('/admin/jobs')}>
              <ArrowLeft className="w-4 h-4 mr-2" />Back to Jobs
            </Button>
            <Button onClick={handleNext} className="bg-orange-600 hover:bg-orange-700 text-white px-8">
              Next: Eligibility<ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default JobBasicInfo
