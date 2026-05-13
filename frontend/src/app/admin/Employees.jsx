import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const Employees = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    department: 'All Departments',
    role: 'All Roles',
    status: 'Status: All'
  })

  const stats = [
    {
      title: 'TOTAL EMPLOYEES',
      value: '1,284',
      change: '+12%',
      color: 'border-l-orange-500'
    },
    {
      title: 'ACTIVE NOW',
      value: '942',
      icon: '🟢',
      color: 'border-l-green-500'
    },
    {
      title: 'DEPARTMENTS',
      value: '18',
      icon: '🏢',
      color: 'border-l-blue-500'
    },
    {
      title: 'PENDING VERIFICATIONS',
      value: '43',
      status: 'URGENT',
      color: 'border-l-yellow-500'
    }
  ]

  const employees = [
    {
      id: 'BR-2823-9912',
      name: 'Aman Singh',
      email: 'aman.singh@bihar.gov.in',
      department: 'Public Works',
      role: 'Senior Engineer',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800',
      dateJoined: '12 Oct 2023',
      avatar: '👤'
    },
    {
      id: 'BR-2822-4421',
      name: 'Priya Kumari',
      email: 'priya.kumari@bihar.gov.in',
      department: 'Healthcare',
      role: 'Medical Officer',
      status: 'On Leave',
      statusColor: 'bg-yellow-100 text-yellow-800',
      dateJoined: '05 Jan 2022',
      avatar: '👤'
    },
    {
      id: 'BR-2821-0012',
      name: 'Rajesh Gupta',
      email: 'rajesh.gupta@bihar.gov.in',
      department: 'Education',
      role: 'Academic Dean',
      status: 'Inactive',
      statusColor: 'bg-red-100 text-red-800',
      dateJoined: '20 Nov 2021',
      avatar: '👤'
    },
    {
      id: 'BR-2824-1102',
      name: 'Vikram Sahay',
      email: 'vikram.sahay@bihar.gov.in',
      department: 'Finance',
      role: 'Accounts Officer',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800',
      dateJoined: '14 Mar 2024',
      avatar: 'VS'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 bg-orange-50 min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
            <p className="text-gray-600">Staff Directory</p>
            <p className="text-sm text-gray-500">Manage and monitor institutional workforce across departments.</p>
          </div>
          <Button 
            onClick={() => navigate('/admin/employees/add')}
            className="bg-orange-600 hover:bg-orange-700"
          >
            ➕ Add New Employee
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className={`border-l-4 ${stat.color} bg-white`}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    {stat.status && (
                      <Badge className="bg-yellow-100 text-yellow-800 mt-2 text-xs">
                        {stat.status}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    {stat.icon && <span className="text-xl">{stat.icon}</span>}
                    {stat.change && (
                      <span className="text-xs font-medium text-green-600">{stat.change}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">🔍 Filters:</span>
                <select 
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>All Departments</option>
                  <option>Public Works</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Finance</option>
                </select>
                <select 
                  value={filters.role}
                  onChange={(e) => setFilters({...filters, role: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>All Roles</option>
                  <option>Senior Engineer</option>
                  <option>Medical Officer</option>
                  <option>Academic Dean</option>
                  <option>Accounts Officer</option>
                </select>
                <select 
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>Status: All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>On Leave</option>
                </select>
              </div>
              <Button variant="ghost" className="text-orange-600">
                Clear All
              </Button>
            </div>
          </div>
        </Card>

        {/* Employees Table */}
        <Card className="bg-white">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">EMPLOYEE NAME</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">DEPARTMENT</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ROLE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">STATUS</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">DATE JOINED</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-medium text-sm">
                            {employee.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">{employee.id}</td>
                      <td className="py-4 px-4 text-sm text-gray-800">{employee.department}</td>
                      <td className="py-4 px-4 text-sm text-gray-800">{employee.role}</td>
                      <td className="py-4 px-4">
                        <Badge className={employee.statusColor}>
                          {employee.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-800">{employee.dateJoined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing 1-10 of 1,284 employees
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button className="bg-orange-600 text-white" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <span className="text-gray-500">...</span>
                <Button variant="outline" size="sm">129</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default Employees