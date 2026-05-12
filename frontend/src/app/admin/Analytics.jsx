import AdminLayout from '../../components/layouts/AdminLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Analytics = () => {
  return (
    <AdminLayout title="Analytics & Reports">
      <ComingSoon 
        title="Analytics Dashboard"
        description="View detailed analytics, reports, and insights about recruitment processes."
        backLink="/admin/dashboard"
        backText="Back to Dashboard"
      />
    </AdminLayout>
  )
}

export default Analytics