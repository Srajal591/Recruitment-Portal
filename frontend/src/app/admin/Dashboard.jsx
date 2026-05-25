import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import {
  AlertTriangle,
  BarChart3,
  Briefcase,
  CheckCircle,
  FileText,
  Plus,
  Users,
  Activity,
  BellRing,
  Clock3,
} from 'lucide-react'

import AdminLayout from '../../components/layouts/AdminLayout'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { dashboardService } from '../../services/dashboard.service'

const Dashboard = () => {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: dashboardService.adminDashboard,
  })

  const overview = data?.overview?.overview || {}
  const applicationsByStatus = data?.overview?.applicationsByStatus || []
  const recentApplications = data?.overview?.recentApplications || []
  const funnel = data?.funnel?.funnel || {}
  const topJobs = data?.topJobs || []

  const rawSupport = data?.support || {}
  const supportStatusStats = rawSupport.statusStats || []

  const countSupportByStatus = (name) =>
    supportStatusStats.find((s) => s._id === name)?.count || 0

  const support = {
    open: countSupportByStatus('Open'),
    pending: countSupportByStatus('In Progress'),
    resolved: countSupportByStatus('Resolved'),
  }

  const submitted =
    applicationsByStatus.find((item) => item._id === 'submitted')?.count || 0

  const stats = [
    {
      title: 'ACTIVE JOBS',
      value: overview.totalJobs || 0,
      icon: Briefcase,
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'APPLICATIONS',
      value: overview.totalApplications || 0,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'CANDIDATES',
      value: overview.totalCandidates || 0,
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'SUBMITTED',
      value: submitted,
      icon: CheckCircle,
      color: 'from-violet-500 to-violet-600',
    },
  ]

  const funnelItems = [
    ['STARTED', funnel.started],
    ['PERSONAL', funnel.personalDetailsCompleted],
    ['EDUCATION', funnel.educationCompleted],
    ['DOCUMENTS', funnel.documentsUploaded],
    ['PAID', funnel.paymentCompleted],
    ['SUBMITTED', funnel.submitted],
  ]

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="min-h-screen bg-[#f7f4ee] px-4 py-4 md:px-5 md:py-4">

        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">

          <div>
            <p className="text-[10px] font-black text-orange-500 tracking-[0.22em] mb-1">
              ADMIN CONTROL CENTER
            </p>

            <h1 className="text-3xl md:text-[42px] font-black tracking-tight text-[#1f2937] leading-none">
              Recruitment Dashboard
            </h1>

            <p className="text-xs text-gray-500 mt-2">
              Real-time recruitment analytics and monitoring system.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-3">

            <Button
              onClick={() => navigate('/admin/jobs/create')}
              className="
                bg-gradient-to-r from-orange-500 to-orange-600
                hover:from-orange-600 hover:to-orange-700
                shadow-lg shadow-orange-200
                rounded-2xl px-4 py-2 text-sm
                border-0 h-10
              "
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Job
            </Button>

            <Button
              asChild
              variant="outline"
              className="
                rounded-2xl bg-white/80
                backdrop-blur-xl border-white/70
                shadow-sm h-10 px-4 text-sm
              "
            >
              <Link to="/admin/applications">
                View Applications
              </Link>
            </Button>
          </div>
        </div>

        {/* LOADING */}
        {isLoading && (
          <Card className="rounded-[22px] border-0 shadow-lg">
            <CardContent className="p-4">
              Loading dashboard...
            </CardContent>
          </Card>
        )}

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">

          {stats.map((stat) => (
            <div
              key={stat.title}
              className="
                relative overflow-hidden
                rounded-[22px]
                bg-white/90 backdrop-blur-xl
                border border-white/60
                shadow-[0_6px_24px_rgba(0,0,0,0.04)]
                hover:shadow-[0_10px_32px_rgba(0,0,0,0.07)]
                transition-all duration-500 ease-out
                hover:-translate-y-[3px]
                p-4
              "
            >

              <div className={`
                absolute top-0 left-0 h-1 w-full
                bg-gradient-to-r ${stat.color}
              `} />

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-[10px] font-black tracking-[0.18em] text-gray-400 mb-2">
                    {stat.title}
                  </p>

                  <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">
                    {stat.value.toLocaleString('en-IN')}
                  </h2>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                    <p className="text-[10px] font-medium text-gray-500">
                      Live updated
                    </p>
                  </div>
                </div>

                <div className="
                  w-11 h-11 rounded-2xl
                  bg-gradient-to-br from-orange-50 to-orange-100
                  flex items-center justify-center
                ">
                  <stat.icon className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* LEFT */}
          <div className="xl:col-span-2 space-y-5">

            {/* FUNNEL */}
            <div className="
              rounded-[22px]
              bg-white/90 backdrop-blur-xl
              border border-white/70
              shadow-[0_6px_24px_rgba(0,0,0,0.04)]
              p-5
            ">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h3 className="text-xl font-black text-[#1f2937]">
                    Candidate Conversion Funnel
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Application stage performance
                  </p>
                </div>

                <div className="
                  w-10 h-10 rounded-2xl
                  bg-orange-50
                  flex items-center justify-center
                ">
                  <BarChart3 className="w-4 h-4 text-orange-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">

                {funnelItems.map(([label, value], index) => (
                  <div
                    key={label}
                    className={`
                      rounded-2xl p-4 text-center transition-all duration-300
                      ${
                        index === funnelItems.length - 1
                          ? 'bg-[#111827] text-white shadow-xl'
                          : 'bg-[#fafafa] border border-gray-100 hover:border-orange-200'
                      }
                    `}
                  >
                    <h3 className="text-2xl font-black">
                      {(value || 0).toLocaleString('en-IN')}
                    </h3>

                    <p className={`
                      text-[10px] mt-2 font-black tracking-[0.12em]
                      ${
                        index === funnelItems.length - 1
                          ? 'text-gray-300'
                          : 'text-gray-500'
                      }
                    `}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* TOP JOBS */}
            <div className="
              rounded-[22px]
              bg-white/90 backdrop-blur-xl
              border border-white/70
              shadow-[0_6px_24px_rgba(0,0,0,0.04)]
              p-5
            ">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h3 className="text-xl font-black text-[#1f2937]">
                    Top Job Performance
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Highest application receiving jobs
                  </p>
                </div>

                <Badge variant="primary">
                  LIVE DATA
                </Badge>
              </div>

              <div className="space-y-3">

                {topJobs.map((job, index) => (
                  <div
                    key={job._id || job.postCode}
                    className="
                      rounded-2xl border border-gray-100
                      p-3 flex items-center justify-between
                      hover:border-orange-200
                      hover:bg-orange-50/30
                      transition-all duration-300
                    "
                  >
                    <div className="flex items-center gap-3">

                      <div className="
                        w-10 h-10 rounded-xl
                        bg-gradient-to-br from-orange-100 to-orange-200
                        flex items-center justify-center
                        font-black text-sm text-orange-700
                      ">
                        #{index + 1}
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-[#1f2937]">
                          {job.jobTitle}
                        </h4>

                        <p className="text-xs text-gray-500 mt-1">
                          {job.department} • {job.postCode}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <h3 className="text-2xl font-black text-[#1f2937]">
                        {job.totalApplications || 0}
                      </h3>

                      <p className="text-[10px] font-bold tracking-[0.12em] text-gray-400">
                        APPLICATIONS
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECENT APPLICATIONS */}
            <div className="
              rounded-[22px]
              bg-white/90 backdrop-blur-xl
              border border-white/70
              shadow-[0_6px_24px_rgba(0,0,0,0.04)]
              p-5
            ">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h3 className="text-xl font-black text-[#1f2937]">
                    Recent Applications
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Latest candidate submissions
                  </p>
                </div>

                <Badge variant="info">
                  REAL-TIME
                </Badge>
              </div>

              <div className="space-y-3">

                {recentApplications.map((application) => (
                  <div
                    key={application._id}
                    className="
                      flex items-start gap-3
                      p-3 rounded-2xl
                      border border-gray-100
                      hover:border-orange-200
                      hover:bg-orange-50/30
                      transition-all duration-300
                    "
                  >
                    <div className="
                      w-10 h-10 rounded-xl
                      bg-gradient-to-br from-orange-100 to-orange-200
                      flex items-center justify-center
                      shrink-0
                    ">
                      <FileText className="w-4 h-4 text-orange-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[#1f2937] truncate">
                        {application.applicationId}
                      </h4>

                      <p className="text-xs text-gray-500 mt-1">
                        {application.jobId?.title || 'Job'}
                      </p>

                      <p className="text-[10px] text-gray-400 mt-1 truncate">
                        {application.candidateId?.email || 'Candidate'}
                      </p>
                    </div>

                    <Badge
                      variant={
                        application.status === 'Approved'
                          ? 'success'
                          : application.status === 'Rejected'
                          ? 'error'
                          : 'warning'
                      }
                    >
                      {application.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-5">

            {/* SUPPORT */}
            <div className="
              rounded-[22px]
              bg-[#111827]
              text-white
              p-5
              shadow-[0_20px_60px_rgba(15,23,42,0.28)]
            ">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h3 className="text-xl font-black">
                    Support Snapshot
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    Ticket monitoring system
                  </p>
                </div>

                <Badge className="bg-orange-500 text-white border-0">
                  ACTIVE
                </Badge>
              </div>

              <div className="space-y-3">

                <div className="
                  rounded-2xl bg-white/5 border border-white/10
                  p-3 flex items-center justify-between
                ">
                  <div>
                    <p className="text-xs text-gray-400">
                      Open Tickets
                    </p>

                    <h3 className="text-2xl font-black mt-1">
                      {support.open || 0}
                    </h3>
                  </div>

                  <div className="
                    w-10 h-10 rounded-xl bg-red-500/20
                    flex items-center justify-center
                  ">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                </div>

                <div className="
                  rounded-2xl bg-white/5 border border-white/10
                  p-3 flex items-center justify-between
                ">
                  <div>
                    <p className="text-xs text-gray-400">
                      Pending
                    </p>

                    <h3 className="text-2xl font-black mt-1">
                      {support.pending || 0}
                    </h3>
                  </div>

                  <div className="
                    w-10 h-10 rounded-xl bg-yellow-500/20
                    flex items-center justify-center
                  ">
                    <Clock3 className="w-4 h-4 text-yellow-400" />
                  </div>
                </div>

                <div className="
                  rounded-2xl bg-white/5 border border-white/10
                  p-3 flex items-center justify-between
                ">
                  <div>
                    <p className="text-xs text-gray-400">
                      Resolved
                    </p>

                    <h3 className="text-2xl font-black mt-1">
                      {support.resolved || 0}
                    </h3>
                  </div>

                  <div className="
                    w-10 h-10 rounded-xl bg-emerald-500/20
                    flex items-center justify-center
                  ">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="
                  w-full mt-5 rounded-2xl
                  bg-white text-black hover:bg-gray-100
                  h-10 text-sm
                "
              >
                <Link to="/admin/support">
                  Open Support Center
                </Link>
              </Button>
            </div>

            {/* ALERTS */}
            <div className="
              rounded-[22px]
              bg-white/90 backdrop-blur-xl
              border border-white/70
              shadow-[0_6px_24px_rgba(0,0,0,0.04)]
              p-5
            ">

              <div className="flex items-center justify-between mb-5">

                <div>
                  <h3 className="text-xl font-black text-[#1f2937]">
                    Critical Alerts
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    System notifications
                  </p>
                </div>

                <Badge variant="error">
                  3 NEW
                </Badge>
              </div>

              <div className="space-y-3">

                <div className="
                  rounded-2xl border border-red-100
                  bg-red-50 p-3
                ">
                  <div className="flex gap-3">
                    <BellRing className="w-4 h-4 text-red-500 mt-1" />

                    <div>
                      <h4 className="font-bold text-sm text-red-700">
                        Payment Gateway Spike
                      </h4>

                      <p className="text-xs text-red-600 mt-1">
                        High transaction latency detected.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="
                  rounded-2xl border border-yellow-100
                  bg-yellow-50 p-3
                ">
                  <div className="flex gap-3">
                    <Activity className="w-4 h-4 text-yellow-600 mt-1" />

                    <div>
                      <h4 className="font-bold text-sm text-yellow-700">
                        Document Buffer Full
                      </h4>

                      <p className="text-xs text-yellow-600 mt-1">
                        Upload queue nearing capacity.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard