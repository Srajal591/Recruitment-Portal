import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  ArrowRight, Briefcase, Calendar, Filter, MapPin,
  Phone, Search, Users, Building2, IndianRupee,
  BookOpen, LifeBuoy, Zap, Menu, X, ChevronRight,
  ExternalLink, Bell, CheckCircle,
} from 'lucide-react'
import heroBg from '../../assets/herobg.jpg'

const jobs = [
  {
    id: 1,
    title: 'Senior Administrative Officer',
    department: 'Bihar Public Service Commission',
    category: 'BPSC',
    vacancies: 32,
    lastDate: 'Oct 25, 2024',
    fee: '₹600',
    eligibility: 'Post Graduate with 5+ years experience',
    status: 'ACTIVE',
    type: 'Government',
    location: 'Patna, Bihar',
  },
  {
    id: 2,
    title: 'Junior Structural Engineer',
    department: 'Bihar State Housing Board',
    category: 'BSHB',
    vacancies: 18,
    lastDate: 'Nov 10, 2024',
    fee: '₹500',
    eligibility: 'B.Tech Civil / Structural Engineering',
    status: 'ACTIVE',
    type: 'Technical',
    location: 'Multiple Districts',
  },
  {
    id: 3,
    title: 'District Education Officer',
    department: 'Department of Education, Bihar',
    category: 'BPSC',
    vacancies: 12,
    lastDate: 'Nov 20, 2024',
    fee: '₹750',
    eligibility: 'Post Graduate + B.Ed with 3+ years experience',
    status: 'ACTIVE',
    type: 'Education',
    location: 'District HQ',
  },
]

const supportCards = [
  {
    icon: BookOpen,
    title: 'Exam Prep',
    desc: 'Access free study materials and mock tests for all listed exams.',
  },
  {
    icon: LifeBuoy,
    title: 'User Manual',
    desc: 'Step-by-step guidance for a seamless application experience.',
  },
  {
    icon: Zap,
    title: 'Emergency Profile',
    desc: 'Optimize your profile to increase your chances of selection.',
  },
]

const importantLinks = [
  'Application Guidelines',
  'Fee Payment Portal',
  'Admit Card Download',
  'Results Archive',
]

const EligibleJobs = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = location.state || {}

  const [filters, setFilters] = useState({
    qualification: queryParams.qualification || '',
    age: queryParams.age || '',
    category: queryParams.category || '',
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'How to Apply', path: '/how-to-apply' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact Us', path: '/contact' },
  ]

  const handleApply = (jobId) => navigate('/auth/verify-otp', { state: { jobId } })
  const handleViewDetail = (jobId) => navigate(`/jobs/${jobId}`)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Header ── */}
      <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">RP</span>
              </div>
              <div>
                <div className="font-bold text-gray-800 text-sm leading-tight">Recruitment Portal</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Government of India</div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-gray-600 hover:text-orange-600 transition-colors font-medium">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <Link to="/auth/login" className="hidden md:inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                Login/Register
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-3">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} className="px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
                <Link to="/auth/login" className="mt-2 mx-3 py-2 bg-orange-600 text-white text-center text-sm font-medium rounded-lg">
                  Login/Register
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* ── Hero + Filter ── */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-14 md:py-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left text */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-orange-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                <Zap className="w-3.5 h-3.5" /> Eligibility Matched
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                Institutional Clarity.<br />
                <span className="text-orange-400">Your Future, Defined.</span>
              </h1>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-md">
                Based on your eligibility profile, we've curated the best-matched government
                job openings require your attention to succeed in this focused selection.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-center">
                  <div className="text-2xl font-bold text-orange-300">{jobs.length}</div>
                  <div className="text-xs text-white/70 mt-0.5">Matching Jobs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-center">
                  <div className="text-2xl font-bold text-orange-300">62</div>
                  <div className="text-xs text-white/70 mt-0.5">Total Vacancies</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-center">
                  <div className="text-2xl font-bold text-orange-300">3</div>
                  <div className="text-xs text-white/70 mt-0.5">Departments</div>
                </div>
              </div>
            </div>

            {/* Right filter card */}
            <div className="lg:ml-auto w-full max-w-md">
              <div className="bg-white shadow-2xl border border-orange-200 rounded-2xl overflow-hidden">
                <div className="bg-orange-600 px-6 py-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-white" />
                  <h3 className="font-bold text-white text-base tracking-wide uppercase">Smart Eligibility Filter</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Qualification
                    </label>
                    <select
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      value={filters.qualification}
                      onChange={(e) => setFilters({ ...filters, qualification: e.target.value })}
                    >
                      <option value="">Select Highest Qualification</option>
                      <option value="10th">10th Pass</option>
                      <option value="12th">12th Pass</option>
                      <option value="graduation">Graduation</option>
                      <option value="post-graduation">Post Graduation</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Age</label>
                      <select
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        value={filters.age}
                        onChange={(e) => setFilters({ ...filters, age: e.target.value })}
                      >
                        <option value="">Age Range</option>
                        <option value="18-21">18–21</option>
                        <option value="21-25">21–25</option>
                        <option value="25-30">25–30</option>
                        <option value="30-35">30–35</option>
                        <option value="35-40">35–40</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
                      <select
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      >
                        <option value="">Category</option>
                        <option value="general">General</option>
                        <option value="obc">OBC</option>
                        <option value="sc">SC</option>
                        <option value="st">ST</option>
                        <option value="ews">EWS</option>
                      </select>
                    </div>
                  </div>

                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm">
                    <Search className="w-4 h-4" /> Check Eligible Jobs
                  </button>

                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 text-xs font-semibold">You are eligible for {jobs.length} jobs</p>
                      <p className="text-green-600 text-xs mt-0.5">Based on your eligibility profile above</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Current Openings ── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Job List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Current Openings</h2>
                  <p className="text-gray-500 text-sm mt-1">{jobs.length} jobs matched your eligibility profile</p>
                </div>
                <Link to="/jobs" className="inline-flex items-center gap-1.5 text-orange-600 hover:text-orange-700 text-sm font-medium border border-orange-300 hover:border-orange-500 px-4 py-2 rounded-lg transition-colors">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Top row */}
                    <div className="p-5 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide">
                              {job.category}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              {job.status}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">{job.type}</span>
                          </div>
                          <h3 className="font-bold text-gray-800 text-lg leading-snug mb-1">{job.title}</h3>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-orange-400" />
                              <span>{job.department}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-orange-400" />
                              <span>{job.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-orange-100">
                          <Briefcase className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="px-5 pb-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 rounded-xl py-2.5 px-3 text-center border border-gray-100">
                          <Users className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                          <div className="text-sm font-bold text-gray-800">{job.vacancies}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">Vacancies</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl py-2.5 px-3 text-center border border-gray-100">
                          <Calendar className="w-4 h-4 text-red-400 mx-auto mb-1" />
                          <div className="text-xs font-bold text-red-600">{job.lastDate}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">Last Date</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl py-2.5 px-3 text-center border border-gray-100">
                          <IndianRupee className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                          <div className="text-sm font-bold text-gray-800">{job.fee}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">Fee</div>
                        </div>
                      </div>
                    </div>

                    {/* Eligibility + Actions */}
                    <div className="px-5 pb-5 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                        <p className="text-xs text-orange-800">
                          <span className="font-semibold text-orange-600">Eligibility: </span>
                          {job.eligibility}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApply(job.id)}
                          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap"
                        >
                          Apply Now
                        </button>
                        <button
                          onClick={() => handleViewDetail(job.id)}
                          className="px-5 py-2.5 border border-orange-300 text-orange-700 hover:bg-orange-50 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                        >
                          View Detail
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              {/* Applicant Survey */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-orange-600 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-white" />
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">Applicant Survey</h3>
                  </div>
                  <p className="text-orange-100 text-xs mt-1">Help us improve your experience</p>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Rate your experience with our portal and help us serve you better.
                  </p>
                  <div className="space-y-2">
                    {['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'].map((opt) => (
                      <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="survey" className="accent-orange-600 w-4 h-4" />
                        <span className="text-sm text-gray-700 group-hover:text-orange-700 transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors mt-2">
                    Submit Feedback
                  </button>
                </div>
              </div>

              {/* Important Links */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-orange-600" />
                  Important Links
                </h3>
                <div className="space-y-2">
                  {importantLinks.map((link) => (
                    <button
                      key={link}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-100 group"
                    >
                      <span>{link}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-5 text-white">
                <h3 className="font-bold text-sm uppercase tracking-wide mb-4 text-orange-100">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Active Jobs', value: '3' },
                    { label: 'Total Vacancies', value: '62' },
                    { label: 'Departments', value: '3' },
                    { label: 'Days Left', value: '12' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/15 rounded-xl p-3 text-center">
                      <div className="text-xl font-extrabold">{stat.value}</div>
                      <div className="text-xs text-orange-100 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Support & Guidance ── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Support &amp; Guidance</h2>
              <p className="text-gray-500 text-sm mt-1">Comprehensive assistance throughout your recruitment journey</p>
            </div>
            <button className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors self-start sm:self-auto shadow-sm">
              <Phone className="w-4 h-4" /> Get Help Now
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {supportCards.map((card, i) => (
              <div key={i} className="bg-orange-50 border border-orange-100 rounded-2xl p-6 hover:shadow-md transition-all hover:border-orange-200 group">
                <div className="w-12 h-12 bg-orange-100 group-hover:bg-orange-600 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <card.icon className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                <button className="mt-4 text-orange-600 text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Learn More <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Helpline banner */}
          <div className="bg-gradient-to-r from-orange-700 to-orange-500 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-4 text-white">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Technical Support Helpline</h3>
                <p className="text-orange-100 text-sm">Our support team is available Mon–Sat, 9 AM – 6 PM</p>
              </div>
            </div>
            <div className="text-center sm:text-right text-white">
              <div className="text-3xl font-extrabold tracking-wide">1800-123-4567</div>
              <div className="text-orange-100 text-xs font-medium uppercase tracking-wider mt-1">Free Helpline</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">RP</span>
              </div>
              <span className="font-medium text-white">Recruitment Portal</span>
              <span>•</span>
              <span>Government of India</span>
            </div>
            <p>© 2024 Bihar State Recruitment Board. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default EligibleJobs
