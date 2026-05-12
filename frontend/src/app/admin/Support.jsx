import AdminLayout from '../../components/layouts/AdminLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Support = () => {
  return (
    <AdminLayout title="Support Management">
      <ComingSoon 
        title="Support Center"
        description="Manage support tickets, help requests, and provide assistance to candidates."
        backLink="/admin/dashboard"
        backText="Back to Dashboard"
      />
    </AdminLayout>
  )
}

export default Support