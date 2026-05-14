import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Calendar, ChevronDown, ChevronUp, Download, FileText,
  Building2, Clock, IndianRupee, CheckCircle2, Circle,
  Users, ArrowLeft, MapPin, Briefcase,
} from 'lucide-react'
import PublicLayout from '../../components/layouts/PublicLayout'

// ── Static job data (keyed by id) ──────────────────────────────────────────
const JOB_DATA = {
  1: {
    title: 'Senior Administrative Officer',
    department: 'Bihar Public Service Commission',
    status: 'OPEN',
    lastDate: 'Oct 25, 2024',
    fee: '₹600',
    shortEligibility: 'Post Graduate with 5+ years experience',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=160&h=120&fit=crop',
    eligibility: {
      age: { min: 25, maxMale: 42, maxFemale: 45 },
      education: 'Candidate must possess a Post Graduate Degree from a recognized University in India with at least 65% marks. Professional experience of minimum 5 years in an administrative role with Government or Semi-Government institutions is mandatory.',
    },
    dates: {
      registrationStart: 'September 25, 2024',
      lastDate: 'October 25, 2024',
      examDate: 'November 18, 2024',
      admitCard: 'November 10, 2024',
    },
    documents: ['Valid ID Proof', 'PG Degree Certificate', 'Experience Certificate', 'Caste Certificate'],
    selection: [
      { phase: 'Phase 1: Preliminary Exam', desc: 'Objective type containing General Studies and Administrative Aptitude. Minimum 40% qualifying marks required.' },
      { phase: 'Phase 2: Mains Examination', desc: 'Descriptive papers focused on Public Administration, Governance, and Language Proficiency (Hindi/English).' },
      { phase: 'Phase 3: Personal Interview', desc: 'Evaluation of leadership, problem-solving skills, and administrative knowledge by a specialist panel.' },
    ],
    downloads: [
      { name: 'Official Notification', icon: FileText },
      { name: 'Syllabus Guide', icon: FileText },
    ],
  },
  2: {
    title: 'Junior Engineer (Mechanical)',
    department: 'Public Works Department',
    status: 'OPEN',
    lastDate: 'Dec 15, 2024',
    fee: '₹500',
    shortEligibility: 'B.Tech in Mechanical Engineering',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=160&h=120&fit=crop',
    eligibility: {
      age: { min: 21, maxMale: 37, maxFemale: 40 },
      education: 'Candidate must hold a B.Tech / B.E. degree in Mechanical Engineering from a recognized university with minimum 60% marks.',
    },
    dates: {
      registrationStart: 'November 1, 2024',
      lastDate: 'December 15, 2024',
      examDate: 'January 20, 2025',
      admitCard: 'January 10, 2025',
    },
    documents: ['Valid ID Proof', 'B.Tech Certificate', 'Marksheets', 'Category Certificate'],
    selection: [
      { phase: 'Phase 1: Written Exam', desc: 'Objective questions covering Engineering Mathematics, Mechanics and Thermodynamics.' },
      { phase: 'Phase 2: Technical Interview', desc: 'Assessment of domain knowledge and practical aptitude by a technical panel.' },
    ],
    downloads: [
      { name: 'Official Notification', icon: FileText },
      { name: 'Syllabus Guide', icon: FileText },
    ],
  },
}

const DEFAULT_JOB = JOB_DATA[1]

const DOC_ICONS = ['🪪', '📜', '📋', '📑', '🗂️']

const AccordionSection = ({ icon, title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <h2 className="font-bold text-gray-800 text-base">{title}</h2>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

const JobDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const job = JOB_DATA[id] || DEFAULT_JOB

  const [checker, setChecker] = useState({ age: '', qualification: '', category: '' })
  const [eligResult, setEligResult] = useState(null)

  const checkEligibility = () => {
    const age = parseInt(checker.age)
    const eligible =
      checker.qualification &&
      checker.category &&
      age >= job.eligibility.age.min &&
      age <= job.eligibility.age.maxMale
    setEligResult(eligible ? 'eligible' : 'not-eligible')
  }

  const handleApply = () => navigate('/auth/verify-otp', { state: { jobId: id } })

  return (
    <PublicLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* ── Job Header Banner (orange hero) ── */}
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/10 rounded-full" />
          <div className="absolute -bottom-16 -left-10 w-64 h-64 bg-white/5 rounded-full" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Back link */}
            <Link
              to="/eligible-jobs"
              className="inline-flex items-center gap-1.5 text-orange-100 hover:text-white text-sm font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Eligible Jobs
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex-1">
                {/* Status badge */}
                <div className="inline-flex items-center gap-1.5 bg-green-400/20 text-white border border-green-300/40 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                  {job.status}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 text-orange-100 text-sm mb-5">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  <span>{job.department}</span>
                </div>

                {/* Quick info pills */}
                <div className="flex flex-wrap gap-3">
                  <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5">
                    <div className="text-[10px] font-semibold text-orange-200 uppercase tracking-wide mb-0.5">Last Date</div>
                    <div className="flex items-center gap-1 text-sm font-bold text-white">
                      <Calendar className="w-3.5 h-3.5" /> {job.lastDate}
                    </div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5">
                    <div className="text-[10px] font-semibold text-orange-200 uppercase tracking-wide mb-0.5">Application Fee</div>
                    <div className="flex items-center gap-1 text-sm font-bold text-white">
                      <IndianRupee className="w-3.5 h-3.5" /> {job.fee.replace('₹', '')}
                    </div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5">
                    <div className="text-[10px] font-semibold text-orange-200 uppercase tracking-wide mb-0.5">Eligibility</div>
                    <div className="text-sm font-bold text-white">{job.shortEligibility}</div>
                  </div>
                </div>
              </div>

              {/* Job image */}
              <div className="flex-shrink-0">
                <img
                  src={job.image}
                  alt={job.department}
                  className="w-full sm:w-44 h-32 object-cover rounded-2xl border-2 border-white/30 shadow-xl"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/160x120?text=Job' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Main content + Sidebar ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT: Accordions */}
            <div className="lg:col-span-2 space-y-4">

              {/* Eligibility Details */}
              <AccordionSection icon="🎓" title="Eligibility Details" defaultOpen>
                <div className="space-y-5 pt-1">
                  <div>
                    <h3 className="text-sm font-bold text-orange-600 mb-2 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Age Limits
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-700 pl-4">
                      <li>• Minimum Age: {job.eligibility.age.min} Years</li>
                      <li>• Maximum Age (Male): {job.eligibility.age.maxMale} Years</li>
                      <li>• Maximum Age (Female): {job.eligibility.age.maxFemale} Years</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-orange-600 mb-2">Educational Qualifications</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{job.eligibility.education}</p>
                  </div>
                </div>
              </AccordionSection>

              {/* Important Dates */}
              <AccordionSection icon="📅" title="Important Dates" defaultOpen>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {[
                    { label: 'REGISTRATION STARTS', value: job.dates.registrationStart, color: 'text-green-600', icon: '🟢' },
                    { label: 'LAST DATE TO APPLY', value: job.dates.lastDate, color: 'text-red-600', icon: '🔴' },
                    { label: 'EXAM DATE', value: job.dates.examDate, color: 'text-blue-600', icon: '📝' },
                    { label: 'ADMIT CARD RELEASE', value: job.dates.admitCard, color: 'text-orange-600', icon: '🎫' },
                  ].map((d) => (
                    <div key={d.label} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <span className="text-lg flex-shrink-0">{d.icon}</span>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{d.label}</div>
                        <div className={`font-bold text-sm ${d.color}`}>{d.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionSection>

              {/* Required Documents */}
              <AccordionSection icon="📄" title="Required Documents" defaultOpen>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                  {job.documents.map((doc, i) => (
                    <div key={i} className="flex flex-col items-center text-center bg-orange-50 border border-orange-100 rounded-xl p-4 gap-2">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                        {DOC_ICONS[i] || '📄'}
                      </div>
                      <span className="text-xs font-semibold text-gray-700 leading-snug">{doc}</span>
                    </div>
                  ))}
                </div>
              </AccordionSection>

              {/* Selection Process */}
              <AccordionSection icon="🏆" title="Selection Process" defaultOpen>
                <div className="space-y-4 pt-1">
                  {job.selection.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        {i < job.selection.length - 1 && (
                          <div className="w-0.5 bg-orange-200 flex-1 my-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <h3 className="font-bold text-gray-800 text-sm mb-1">{step.phase}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionSection>
            </div>

            {/* RIGHT: Sidebar */}
            <div className="space-y-4">

              {/* Eligibility Checker */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🎯</span>
                  <h2 className="font-bold text-gray-800">Eligibility Checker</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Your Age</label>
                    <input
                      type="number"
                      placeholder="e.g. 28"
                      value={checker.age}
                      onChange={(e) => setChecker({ ...checker, age: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Highest Qualification</label>
                    <select
                      value={checker.qualification}
                      onChange={(e) => setChecker({ ...checker, qualification: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      <option value="">Select Qualification</option>
                      <option value="10th">10th Pass</option>
                      <option value="12th">12th Pass</option>
                      <option value="graduation">Graduation</option>
                      <option value="post-graduation">Post Graduate (MA/MSc/MCom)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
                    <select
                      value={checker.category}
                      onChange={(e) => setChecker({ ...checker, category: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      <option value="">General / Unreserved</option>
                      <option value="obc">OBC</option>
                      <option value="sc">SC</option>
                      <option value="st">ST</option>
                      <option value="ews">EWS</option>
                    </select>
                  </div>

                  {/* Result */}
                  {eligResult && (
                    <div
                      className={`rounded-lg px-3 py-2.5 flex items-center gap-2 text-sm font-semibold ${
                        eligResult === 'eligible'
                          ? 'bg-green-50 border border-green-200 text-green-700'
                          : 'bg-red-50 border border-red-200 text-red-700'
                      }`}
                    >
                      {eligResult === 'eligible' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          You are eligible
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 flex-shrink-0" />
                          Not eligible for this post
                        </>
                      )}
                    </div>
                  )}

                  <button
                    onClick={checkEligibility}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    Check Eligibility
                  </button>
                  <button
                    onClick={handleApply}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-3 rounded-lg transition-colors shadow-sm"
                  >
                    Apply Now
                  </button>
                </div>

                <p className="text-[10px] text-gray-400 mt-3 text-center leading-relaxed">
                  Ensure all details match your official documents before submitting.
                </p>
              </div>

              {/* Official Downloads */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4">Official Downloads</h2>
                <div className="space-y-2">
                  {job.downloads.map((dl, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <dl.icon className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">
                          {dl.name}
                        </span>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

export default JobDetails