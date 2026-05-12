import CandidateLayout from '../../components/layouts/CandidateLayout'
import ComingSoon from '../../components/common/ComingSoon'

const AdmitCard = () => {
  return (
    <CandidateLayout title="Admit Card">
      <ComingSoon 
        title="Admit Card Download"
        description="Download your admit cards for upcoming examinations and interviews."
        backLink="/candidate/dashboard"
        backText="Back to Dashboard"
      />
    </CandidateLayout>
  )
}

export default AdmitCard