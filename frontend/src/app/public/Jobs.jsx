import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Briefcase, Calendar, MapPin, Search } from 'lucide-react'
import PublicLayout from '../../components/layouts/PublicLayout'
import Button from '../../components/ui/Button'
import { jobService } from '../../services/job.service'

const Jobs = () => {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['public-jobs', search],
    queryFn: () => jobService.getPublicJobs({ search, limit: 12 }),
  })

  const jobs = data?.jobs || []

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#f5efe9] px-4 py-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#1f1d1b]">Active Job Listings</h1>
              <p className="text-[#6d6761] mt-2">Browse published opportunities from the recruitment backend.</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jobs, departments..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#e0d7cd] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {isLoading && <div className="bg-white border border-[#e0d7cd] rounded-lg p-6">Loading jobs...</div>}

          {!isLoading && jobs.length === 0 && (
            <div className="bg-white border border-[#e0d7cd] rounded-lg p-6 text-[#6d6761]">
              No active jobs found.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white border border-[#e0d7cd] rounded-lg p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-black text-xl text-[#1f1d1b]">{job.title}</h2>
                    <p className="mt-1 text-sm text-[#6d6761]">{job.department}</p>
                  </div>
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                    {job.daysLeft ?? 0} days
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-[#4b4744]">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-orange-500" />
                    {job.totalPosts || 0} vacancies
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    {job.workLocation || job.projectId?.state || 'Location not specified'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    Apply by {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('en-IN') : 'Not announced'}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/jobs/${job._id}`}>Details</Link>
                  </Button>
                  <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700">
                    <Link to="/auth/candidate-login" state={{ jobId: job._id }}>Apply</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default Jobs
