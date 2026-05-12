import CandidateLayout from '../../components/layouts/CandidateLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Profile = () => {
  return (
    <CandidateLayout title="My Profile">
      <ComingSoon 
        title="Profile Management"
        description="Manage your personal information, education details, and professional experience."
        backLink="/candidate/dashboard"
        backText="Back to Dashboard"
      />
    </CandidateLayout>
  )
}

export default Profile