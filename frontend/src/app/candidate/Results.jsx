import CandidateLayout from '../../components/layouts/CandidateLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Results = () => {
  return (
    <CandidateLayout title="Examination Results">
      <ComingSoon 
        title="Results & Rankings"
        description="Check your examination results, rankings, and selection status."
        backLink="/candidate/dashboard"
        backText="Back to Dashboard"
      />
    </CandidateLayout>
  )
}

export default Results