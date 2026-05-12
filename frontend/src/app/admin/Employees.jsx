import AdminLayout from '../../components/layouts/AdminLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Employees = () => {
  return (
    <AdminLayout title="Employee Management">
      <ComingSoon 
        title="Employee Directory"
        description="Manage staff members, their roles, and access permissions across the system."
        backLink="/admin/dashboard"
        backText="Back to Dashboard"
      />
    </AdminLayout>
  )
}

export default Employees