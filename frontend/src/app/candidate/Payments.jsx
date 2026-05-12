import CandidateLayout from '../../components/layouts/CandidateLayout'
import ComingSoon from '../../components/common/ComingSoon'

const Payments = () => {
  return (
    <CandidateLayout title="Payment History">
      <ComingSoon 
        title="Payment Management"
        description="View your payment history, pending fees, and manage payment methods."
        backLink="/candidate/dashboard"
        backText="Back to Dashboard"
      />
    </CandidateLayout>
  )
}

export default Payments