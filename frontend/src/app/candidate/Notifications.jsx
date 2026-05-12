import CandidateLayout from '../../components/layouts/CandidateLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Notifications = () => {
  return (
    <CandidateLayout title="Notifications">
      <ComingSoon 
        title="Notification Center"
        description="Stay updated with important notifications about your applications and announcements."
        backLink="/candidate/dashboard"
        backText="Back to Dashboard"
      />
    </CandidateLayout>
  )
}

export default Notifications