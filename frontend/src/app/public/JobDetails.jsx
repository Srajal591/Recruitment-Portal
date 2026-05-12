import PublicLayout from '../../components/layouts/PublicLayout'
import ComingSoon from '../../components/common/ComingSoon'

const JobDetails = () => {
  return (
    <PublicLayout>
      <ComingSoon 
        title="Job Details"
        description="View detailed information about specific job positions including requirements, benefits, and application process."
        backLink="/jobs"
        backText="Back to Jobs"
      />
    </PublicLayout>
  )
}

export default JobDetails