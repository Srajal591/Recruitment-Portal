import CandidateLayout from '../../components/layouts/CandidateLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Applications = () => {
  return (
    <CandidateLayout title="My Applications">
      <ComingSoon 
        title="Application Management"
        description="Track the status of your job applications and manage your submissions."
        backLink="/candidate/dashboard"
        backText="Back to Dashboard"
      />
    </CandidateLayout>
  )
}

export default Applications