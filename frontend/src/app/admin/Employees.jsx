import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { adminService } from '../../services/admin.service'

const Employees = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-employees'],
    queryFn: () => adminService.getEmployees({ limit: 20 }),
  })
  const { data: statsData } = useQuery({
    queryKey: ['admin-employee-stats'],
    queryFn: adminService.getEmployeeStats,
  })

  const employees = data?.employees || []
  const stats = [
    { title: 'TOTAL EMPLOYEES', value: statsData?.totalEmployees || data?.pagination?.totalItems || employees.length, color: 'border-l-orange-500' },
    { title: 'ACTIVE', value: statsData?.activeEmployees || employees.filter((e) => e.status === 'Active').length, color: 'border-l-green-500' },
    { title: 'INACTIVE', value: statsData?.inactiveEmployees || employees.filter((e) => e.status !== 'Active').length, color: 'border-l-yellow-500' },
    { title: 'DEPARTMENTS', value: statsData?.departments || new Set(employees.map((e) => e.department).filter(Boolean)).size, color: 'border-l-blue-500' },
  ]

  return (
    <AdminLayout title="Employees">
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
            <p className="text-gray-600">Staff directory from identity service.</p>
          </div>
          <Button onClick={() => navigate('/admin/employees/add')} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Employee
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className={`border-l-4 ${stat.color} bg-white`}>
              <div className="p-6">
                <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{Number(stat.value || 0).toLocaleString('en-IN')}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-white">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Backend employees</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Employee Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && <tr><td colSpan="6" className="py-6 px-4 text-gray-600">Loading employees...</td></tr>}
                  {!isLoading && employees.length === 0 && <tr><td colSpan="6" className="py-6 px-4 text-gray-600">No employees found.</td></tr>}
                  {employees.map((employee) => (
                    <tr key={employee._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{employee.fullName}</div>
                        <div className="text-sm text-gray-500">{employee.officialEmail}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">{employee.employeeId}</td>
                      <td className="py-4 px-4 text-sm text-gray-800">{employee.department}</td>
                      <td className="py-4 px-4 text-sm text-gray-800">{employee.systemRole?.roleName || employee.roleDesignation}</td>
                      <td className="py-4 px-4">
                        <Badge className={employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {employee.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">{employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString('en-IN') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default Employees
