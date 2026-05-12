import AdminLayout from '../../components/layouts/AdminLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Applications = () => {
  return (
    <AdminLayout title="Applications Management">
      <ComingSoon 
        title="Applications Management"
        description="Review, process, and manage candidate applications for various positions."
        backLink="/admin/dashboard"
        backText="Back to Dashboard"
      />
    </AdminLayout>
  )
}

export default Applications