import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const DEPARTMENTS = [
  'Administration', 'Public Works', 'Healthcare', 'Education',
  'Finance', 'Information Technology', 'Home Affairs', 'Revenue',
  'Agriculture', 'Transport', 'Law & Justice', 'Other',
]

const STATUS_OPTIONS = ['Active', 'Inactive', 'On Leave']

const EditEmployee = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    department: '',
    roleDesignation: '',
    employeeId: '',
    dateOfJoining: '',
    officialEmail: '',
    password: '',
    systemRole: '',
    status: 'Active',
  })

  // Fetch employee data
  const { data: employeeData, isLoading: employeeLoading } = useQuery({
    queryKey: ['admin-employee', id],
    queryFn: () => adminService.getEmployee(id),
  })

  // Fetch roles for the dropdown
  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () => adminService.getRoles(),
  })
  const roles = rolesData?.data?.roles || rolesData?.roles || []

  // Populate form when employee data loads
  useEffect(() => {
    if (employeeData?.employee) {
      const emp = employeeData.employee
      setFormData({
        fullName: emp.fullName || '',
        dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '',
        gender: emp.gender || '',
        contactNumber: emp.contactNumber || '',
        department: emp.department || '',
        roleDesignation: emp.roleDesignation || '',
        employeeId: emp.employeeId || '',
        dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.split('T')[0] : '',
        officialEmail: emp.officialEmail || '',
        password: '',
        systemRole: emp.systemRole?._id || '',
        status: emp.status || 'Active',
      })
    }
  }, [employeeData])

  const { mutate: updateEmployee, isPending } = useMutation({
    mutationFn: ({ id, data }) => adminService.updateEmployee(id, data),
    onSuccess: () => {
      toast.success('Employee updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-employees'] })
      queryClient.invalidateQueries({ queryKey: ['admin-employee', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-employee-stats'] })
      navigate('/admin/employees')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update employee')
    },
  })

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }, [errors])

  const validate = useCallback(() => {
    const e = {}
    if (!formData.fullName.trim()) e.fullName = 'Full name is required'
    if (!formData.contactNumber) e.contactNumber = 'Contact number is required'
    else if (!/^[6-9]\d{9}$/.test(formData.contactNumber)) e.contactNumber = 'Enter valid 10-digit mobile number'
    if (!formData.department) e.department = 'Department is required'
    if (!formData.roleDesignation.trim()) e.roleDesignation = 'Role designation is required'
    if (!formData.dateOfJoining) e.dateOfJoining = 'Date of joining is required'
    if (!formData.systemRole) e.systemRole = 'System role is required'
    if (formData.password && formData.password.length < 8) e.password = 'Minimum 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }, [formData])

  const handleSubmit = useCallback(() => {
    if (!validate()) return
    const payload = {
      fullName: formData.fullName.trim(),
      contactNumber: formData.contactNumber,
      department: formData.department,
      roleDesignation: formData.roleDesignation.trim(),
      dateOfJoining: formData.dateOfJoining,
      systemRole: formData.systemRole,
      status: formData.status,
      ...(formData.dateOfBirth && { dateOfBirth: formData.dateOfBirth }),
      ...(formData.gender && { gender: formData.gender }),
      ...(formData.password && { password: formData.password }),
    }
    updateEmployee({ id, data: payload })
  }, [formData, validate, updateEmployee, id])

  const Field = ({ label, required, error, children }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors[field] ? 'border-red-400' : 'border-gray-300'}`

  if (employeeLoading) {
    return (
      <AdminLayout title="Edit Employee">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Employee">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/employees')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Employee</h1>
            <p className="text-gray-600 text-sm">Update employee information.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Details */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-800">Personal Details</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Full Name" required error={errors.fullName}>
                <input type="text" placeholder="Enter legal full name" className={inputClass('fullName')}
                  value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Date of Birth" error={errors.dateOfBirth}>
                  <input type="date" className={inputClass('dateOfBirth')}
                    value={formData.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} />
                </Field>
                <Field label="Gender" error={errors.gender}>
                  <select className={inputClass('gender')}
                    value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
              </div>

              <Field label="Contact Number" required error={errors.contactNumber}>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">+91</span>
                  <input type="tel" placeholder="9876543210" maxLength={10}
                    className={`flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.contactNumber ? 'border-red-400' : 'border-gray-300'}`}
                    value={formData.contactNumber} onChange={(e) => handleChange('contactNumber', e.target.value.replace(/\D/g, ''))} />
                </div>
              </Field>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-800">Employment Details</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Department" required error={errors.department}>
                <select className={inputClass('department')}
                  value={formData.department} onChange={(e) => handleChange('department', e.target.value)}>
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>

              <Field label="Role / Designation" required error={errors.roleDesignation}>
                <input type="text" placeholder="e.g. Senior Reviewer"
                  className={inputClass('roleDesignation')}
                  value={formData.roleDesignation} onChange={(e) => handleChange('roleDesignation', e.target.value)} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Employee ID" required>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    value={formData.employeeId} disabled />
                </Field>
                <Field label="Date of Joining" required error={errors.dateOfJoining}>
                  <input type="date" className={inputClass('dateOfJoining')}
                    value={formData.dateOfJoining} onChange={(e) => handleChange('dateOfJoining', e.target.value)} />
                </Field>
              </div>

              <Field label="Status" required error={errors.status}>
                <select className={inputClass('status')}
                  value={formData.status} onChange={(e) => handleChange('status', e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </CardContent>
          </Card>

          {/* Security & Access */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h3 className="font-semibold text-gray-800">Security & Access</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Official Email" required>
                  <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    value={formData.officialEmail} disabled />
                </Field>

                <Field label="New Password (Optional)" error={errors.password}>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} placeholder="Leave blank to keep current"
                      className={inputClass('password')}
                      value={formData.password} onChange={(e) => handleChange('password', e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>

                <Field label="System Role" required error={errors.systemRole}>
                  <select className={inputClass('systemRole')}
                    value={formData.systemRole} onChange={(e) => handleChange('systemRole', e.target.value)}
                    disabled={rolesLoading}>
                    <option value="">{rolesLoading ? 'Loading roles...' : 'Select Role'}</option>
                    {roles.map(role => (
                      <option key={role._id} value={role._id}>{role.roleName}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => navigate('/admin/employees')}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending} className="bg-orange-600 hover:bg-orange-700 text-white px-8">
            {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : 'Update Employee'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}

export default EditEmployee
