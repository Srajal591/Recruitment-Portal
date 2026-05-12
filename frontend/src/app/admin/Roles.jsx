import AdminLayout from '../../components/layouts/AdminLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Roles = () => {
  return (
    <AdminLayout title="Roles & Permissions">
      <ComingSoon 
        title="Role Management"
        description="Define and manage user roles, permissions, and access control across the platform."
        backLink="/admin/dashboard"
        backText="Back to Dashboard"
      />
    </AdminLayout>
  )
}

export default Roles