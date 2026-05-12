import CandidateLayout from '../../components/layouts/CandidateLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Documents = () => {
  return (
    <CandidateLayout title="Document Management">
      <ComingSoon 
        title="Document Upload"
        description="Upload and manage your certificates, identity proofs, and other required documents."
        backLink="/candidate/dashboard"
        backText="Back to Dashboard"
      />
    </CandidateLayout>
  )
}

export default Documents