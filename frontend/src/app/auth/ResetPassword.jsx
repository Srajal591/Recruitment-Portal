import ComingSoon from '../../components/common/ComingSoon'

const ResetPassword = () => {
  return (
    <ComingSoon 
      title="Reset Password"
      description="Enter your new password to complete the password reset process."
      backLink="/auth/login"
      backText="Back to Login"
    />
  )
}

export default ResetPassword