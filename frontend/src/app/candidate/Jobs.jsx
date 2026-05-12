import CandidateLayout from '../../components/layouts/CandidateLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Jobs = () => {
  return (
    <CandidateLayout title="Available Jobs">
      <ComingSoon 
        title="Job Opportunities"
        description="Browse and apply for government job positions that match your qualifications."
        backLink="/candidate/dashboard"
        backText="Back to Dashboard"
      />
    </CandidateLayout>
  )
}

export default Jobs