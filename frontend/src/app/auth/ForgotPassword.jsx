import ComingSoon from '../../components/common/ComingSoon'

const ForgotPassword = () => {
  return (
    <ComingSoon 
      title="Forgot Password"
      description="Reset your password to regain access to your account."
      backLink="/auth/login"
      backText="Back to Login"
    />
  )
}

export default ForgotPassword