import CandidateLayout from '../../components/layouts/CandidateLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Support = () => {
  return (
    <CandidateLayout title="Support Center">
      <ComingSoon 
        title="Help & Support"
        description="Get assistance with your applications, technical issues, and general queries."
        backLink="/candidate/dashboard"
        backText="Back to Dashboard"
      />
    </CandidateLayout>
  )
}

export default Support