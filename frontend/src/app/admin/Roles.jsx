import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Shield, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const Roles = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () => adminService.getRoles(),
  })

  const { mutate: deleteRole } = useMutation({
    mutationFn: adminService.deleteRole,
    onSuccess: () => {
      toast.success('Role deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] })
    },
    onError: (err) => toast.error(err.message || 'Failed to delete role'),
  })

  const handleDelete = (role) => {
    if (role.isSystemRole) {
      toast.error('System roles cannot be deleted')
      return
    }
    if (window.confirm(`Delete role "${role.roleName}"? This cannot be undone.`)) {
      deleteRole(role._id)
    }
  }

  const roles = data?.roles || []

  if (error) {
    return (
      <AdminLayout title="Roles">
        <div className="p-6 text-red-600">Error loading roles: {error.message}</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Roles">
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Role Management</h1>
            <p className="text-gray-600">Manage access control roles and permissions.</p>
          </div>
          <Button onClick={() => navigate('/admin/roles/create')} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-orange-500 bg-white">
            <div className="p-6"><p className="text-xs font-medium text-gray-500 mb-1">TOTAL ROLES</p><p className="text-3xl font-bold text-gray-800">{roles.length}</p></div>
          </Card>
          <Card className="border-l-4 border-l-blue-500 bg-white">
            <div className="p-6"><p className="text-xs font-medium text-gray-500 mb-1">SYSTEM ROLES</p><p className="text-3xl font-bold text-gray-800">{roles.filter((r) => r.isSystemRole).length}</p></div>
          </Card>
          <Card className="border-l-4 border-l-green-500 bg-white">
            <div className="p-6"><p className="text-xs font-medium text-gray-500 mb-1">CUSTOM ROLES</p><p className="text-3xl font-bold text-gray-800">{roles.filter((r) => !r.isSystemRole).length}</p></div>
          </Card>
        </div>

        <Card className="bg-white">
          <div className="p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Role Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Permissions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Updated</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <tr><td colSpan="6" className="py-6 px-4 text-gray-600">Loading roles...</td></tr>}
                {!isLoading && roles.length === 0 && <tr><td colSpan="6" className="py-6 px-4 text-gray-600">No roles found.</td></tr>}
                {roles.map((role) => {
                  const permCount = role.permissions
                    ? Object.values(role.permissions).flatMap(Object.values).filter(Boolean).length
                    : 0
                  return (
                    <tr key={role._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="font-semibold text-gray-800">{role.roleName}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 max-w-xs truncate">{role.roleDescription || '—'}</td>
                      <td className="py-4 px-4">
                        <Badge className={role.isSystemRole ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}>
                          {role.isSystemRole ? 'System' : 'Custom'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-700">{permCount} active</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {role.updatedAt ? new Date(role.updatedAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/roles/${role._id}/edit`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Role"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(role)}
                            disabled={role.isSystemRole}
                            className={`p-2 rounded-lg transition-colors ${
                              role.isSystemRole
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                            title={role.isSystemRole ? 'System roles cannot be deleted' : 'Delete Role'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default Roles
