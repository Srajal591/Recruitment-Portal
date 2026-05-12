import AdminLayout from '../../components/layouts/AdminLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Jobs = () => {
  return (
    <AdminLayout title="Jobs Management">
      <ComingSoon 
        title="Jobs Management"
        description="Create, manage, and monitor job postings across different government departments."
        backLink="/admin/dashboard"
        backText="Back to Dashboard"
      />
    </AdminLayout>
  )
}

export default Jobs