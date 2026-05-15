import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Building2,
  Clock,
  IndianRupee,
  CheckCircle2,
  Circle,
  ArrowLeft,
  GraduationCap,
  BadgeCheck,
  Trophy,
  FileBadge,
  PlayCircle,
  AlertCircle,
  ClipboardList,
  UserCheck,
} from 'lucide-react'

import PublicLayout from '../../components/layouts/PublicLayout'

// ─────────────────────────────────────────────────────────────
// JOB DATA
// ─────────────────────────────────────────────────────────────

const JOB_DATA = {
  1: {
    title: 'Senior Administrative Officer',
    department: 'Bihar Public Service Commission',
    status: 'OPEN',
    lastDate: 'Oct 25, 2024',
    fee: '₹600',
    shortEligibility: 'Post Graduate with 5+ years experience',

    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',

    eligibility: {
      age: {
        min: 25,
        maxMale: 42,
        maxFemale: 45,
      },

      education:
        'Candidate must possess a Post Graduate Degree from a recognized University in India with at least 65% marks. Professional experience of minimum 5 years in an administrative role within Government or Semi-Government institutions is mandatory.',
    },

    dates: {
      registrationStart: 'September 25, 2024',
      lastDate: 'October 25, 2024',
      examDate: 'November 18, 2024',
      admitCard: 'November 10, 2024',
    },

    documents: [
      'Valid ID Proof',
      'PG Degree Certificate',
      'Experience Certificate',
      'Caste Certificate',
    ],

    selection: [
      {
        phase: 'Phase 1: Preliminary Exam',

        desc:
          'Objective type screening test covering General Studies and Administrative Aptitude.',
      },

      {
        phase: 'Phase 2: Mains Examination',

        desc:
          'Descriptive papers focused on Public Administration and Governance.',
      },

      {
        phase: 'Phase 3: Personal Interview',

        desc:
          'Leadership, communication and administrative knowledge evaluation.',
      },
    ],

    downloads: [
      {
        name: 'Official Notification',
        icon: FileText,
      },

      {
        name: 'Syllabus Guide',
        icon: FileText,
      },
    ],
  },
}

const DEFAULT_JOB = JOB_DATA[1]

const DOCUMENT_ICONS = [
  FileBadge,
  GraduationCap,
  ClipboardList,
  UserCheck,
]

// ─────────────────────────────────────────────────────────────
// ACCORDION
// ─────────────────────────────────────────────────────────────

const AccordionSection = ({
  icon,
  title,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-[24px] border border-[#eadfd7] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      {/* HEADER */}

      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-center justify-between bg-[#f8efea]"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#f3d8c8] flex items-center justify-center shadow-sm">
            {icon}
          </div>

          <h2 className="font-bold text-[#3b2e2a] text-[15px]">
            {title}
          </h2>
        </div>

        {open ? (
          <ChevronUp className="w-5 h-5 text-[#8f817b]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#8f817b]" />
        )}
      </button>

      {/* BODY */}

      {open && (
        <div className="px-6 pb-6 pt-5">
          {children}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

const JobDetails = () => {
  const { id } = useParams()

  const navigate = useNavigate()

  const job = JOB_DATA[id] || DEFAULT_JOB

  const [checker, setChecker] = useState({
    age: '',
    qualification: '',
    category: '',
  })

  const [eligResult, setEligResult] = useState(null)

  // ───────────────────────────────────────────────────────────

  const checkEligibility = () => {
    const age = parseInt(checker.age)

    const eligible =
      checker.qualification &&
      checker.category &&
      age >= job.eligibility.age.min &&
      age <= job.eligibility.age.maxMale

    setEligResult(
      eligible ? 'eligible' : 'not-eligible'
    )
  }

  // ───────────────────────────────────────────────────────────

  const handleApply = () => {
    navigate('/auth/verify-otp', {
      state: { jobId: id },
    })
  }

  // ───────────────────────────────────────────────────────────

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#f5efe9]">
        {/* ───────────────── HEADER ───────────────── */}

        <div className="px-5 lg:px-10 xl:px-14 pt-8">
          <div className="bg-white border border-[#eadfd7] rounded-[30px] p-7 shadow-[0_6px_24px_rgba(0,0,0,0.04)] relative overflow-hidden">
            {/* LEFT ORANGE BORDER */}

            <div className="absolute left-0 top-8 bottom-8 w-[5px] rounded-r-full bg-[#f97316]" />

            {/* BACK BUTTON */}

            <Link
              to="/eligible-jobs"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#8c7a72] hover:text-orange-600 mb-5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />

              Back to Eligible Jobs
            </Link>

            {/* CONTENT */}

            <div className="flex flex-col lg:flex-row gap-6 justify-between">
              {/* LEFT */}

              <div className="flex-1">
                {/* STATUS */}

                <div className="inline-flex items-center gap-2 bg-[#ecfdf3] text-[#16a34a] border border-[#bbf7d0] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide mb-4">
                  <span className="w-2 h-2 bg-[#22c55e] rounded-full" />

                  {job.status}
                </div>

                {/* TITLE */}

                <h1 className="text-[34px] leading-tight font-extrabold text-[#2d2a27] mb-3">
                  {job.title}
                </h1>

                {/* DEPARTMENT */}

                <div className="flex items-center gap-2 text-[#6b625d] text-sm mb-6">
                  <Building2 className="w-4 h-4" />

                  <span>{job.department}</span>
                </div>

                {/* INFO CARDS */}

                <div className="flex flex-wrap gap-4">
                  {/* LAST DATE */}

                  <div className="bg-[#faf7f4] border border-[#ede3dc] rounded-2xl px-5 py-4 min-w-[180px]">
                    <div className="text-[10px] uppercase font-bold tracking-wide text-[#9d8f88] mb-1">
                      Last Date
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-[#2e2e2e]">
                      <Calendar className="w-4 h-4 text-orange-500" />

                      {job.lastDate}
                    </div>
                  </div>

                  {/* FEE */}

                  <div className="bg-[#faf7f4] border border-[#ede3dc] rounded-2xl px-5 py-4 min-w-[180px]">
                    <div className="text-[10px] uppercase font-bold tracking-wide text-[#9d8f88] mb-1">
                      Application Fee
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-[#2e2e2e]">
                      <IndianRupee className="w-4 h-4 text-orange-500" />

                      {job.fee.replace('₹', '')}
                    </div>
                  </div>

                  {/* ELIGIBILITY */}

                  <div className="bg-[#faf7f4] border border-[#ede3dc] rounded-2xl px-5 py-4 min-w-[240px]">
                    <div className="text-[10px] uppercase font-bold tracking-wide text-[#9d8f88] mb-1">
                      Short Eligibility
                    </div>

                    <div className="text-sm font-bold text-[#2e2e2e] leading-relaxed">
                      {job.shortEligibility}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT IMAGE */}

              <div className="flex-shrink-0">
                <div className="bg-[#f5f1ee] p-2 rounded-[24px] border border-[#e7ddd7]">
                  <img
                    src={job.image}
                    alt={job.title}
                    className="w-full lg:w-[180px] h-[150px] object-cover rounded-[18px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───────────────── MAIN CONTENT ───────────────── */}

        <div className="px-5 lg:px-10 xl:px-14 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
            {/* LEFT */}

            <div className="space-y-5">
              {/* ELIGIBILITY DETAILS */}

              <AccordionSection
                icon={
                  <GraduationCap className="w-4 h-4 text-orange-500" />
                }
                title="Eligibility Details"
                defaultOpen
              >
                <div className="space-y-6">
                  {/* AGE */}

                  <div>
                    <h3 className="text-sm font-bold text-orange-600 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />

                      Age Limits
                    </h3>

                    <ul className="space-y-2 text-sm text-[#5c5753]">
                      <li>
                        • Minimum Age:{' '}
                        {job.eligibility.age.min} Years
                      </li>

                      <li>
                        • Maximum Age (Male):{' '}
                        {job.eligibility.age.maxMale} Years
                      </li>

                      <li>
                        • Maximum Age (Female):{' '}
                        {job.eligibility.age.maxFemale} Years
                      </li>
                    </ul>
                  </div>

                  {/* EDUCATION */}

                  <div>
                    <h3 className="text-sm font-bold text-orange-600 mb-3">
                      Educational Qualifications
                    </h3>

                    <p className="text-sm leading-7 text-[#5c5753]">
                      {job.eligibility.education}
                    </p>
                  </div>
                </div>
              </AccordionSection>

              {/* IMPORTANT DATES */}

              <AccordionSection
                icon={
                  <Calendar className="w-4 h-4 text-orange-500" />
                }
                title="Important Dates"
                defaultOpen
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: 'REGISTRATION STARTS',
                      value:
                        job.dates.registrationStart,
                      color: 'text-green-600',
                      icon: PlayCircle,
                    },

                    {
                      label: 'LAST DATE TO APPLY',
                      value: job.dates.lastDate,
                      color: 'text-red-500',
                      icon: AlertCircle,
                    },

                    {
                      label: 'EXAM DATE',
                      value: job.dates.examDate,
                      color: 'text-blue-600',
                      icon: ClipboardList,
                    },

                    {
                      label: 'ADMIT CARD RELEASE',
                      value: job.dates.admitCard,
                      color: 'text-orange-600',
                      icon: BadgeCheck,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-[#faf7f4] border border-[#ede3dc] rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white border border-[#eadfd7] flex items-center justify-center shadow-sm">
                        <item.icon
                          className={`w-5 h-5 ${item.color}`}
                        />
                      </div>

                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wide text-[#a89a93] mb-2">
                          {item.label}
                        </div>

                        <div
                          className={`font-bold text-sm ${item.color}`}
                        >
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionSection>

              {/* REQUIRED DOCUMENTS */}

              <AccordionSection
                icon={
                  <FileBadge className="w-4 h-4 text-orange-500" />
                }
                title="Required Documents"
                defaultOpen
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {job.documents.map((doc, i) => {
                    const Icon = DOCUMENT_ICONS[i]

                    return (
                      <div
                        key={i}
                        className="bg-[#faf7f4] border border-[#ede3dc] rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-md transition-all duration-300"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-[#ffe8d8] flex items-center justify-center mb-3">
                          <Icon className="w-7 h-7 text-orange-500" />
                        </div>

                        <p className="text-sm font-semibold text-[#4b4744] leading-6">
                          {doc}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </AccordionSection>

              {/* SELECTION PROCESS */}

              <AccordionSection
                icon={
                  <Trophy className="w-4 h-4 text-orange-500" />
                }
                title="Selection Process"
                defaultOpen
              >
                <div className="space-y-6">
                  {job.selection.map((step, i) => (
                    <div
                      key={i}
                      className="flex gap-4"
                    >
                      {/* STEP NUMBER */}

                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
                          {i + 1}
                        </div>

                        {i <
                          job.selection.length -
                            1 && (
                          <div className="w-[2px] flex-1 bg-orange-200 mt-2 rounded-full" />
                        )}
                      </div>

                      {/* CONTENT */}

                      <div className="pb-3">
                        <h3 className="font-bold text-[#2f2b28] mb-2">
                          {step.phase}
                        </h3>

                        <p className="text-sm leading-7 text-[#5c5753]">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionSection>
            </div>

            {/* RIGHT SIDEBAR */}

            <div className="space-y-5">
              {/* ELIGIBILITY CHECKER */}

              <div className="bg-white border border-[#eadfd7] rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                {/* HEADER */}

                <div className="bg-[#f97316] px-5 py-4">
                  <h2 className="font-bold text-white text-[15px]">
                    Eligibility Checker
                  </h2>
                </div>

                {/* BODY */}

                <div className="p-5">
                  <div className="space-y-4">
                    {/* AGE */}

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wide text-[#8c7f79] mb-2">
                        Your Age
                      </label>

                      <input
                        type="number"
                        value={checker.age}
                        onChange={(e) =>
                          setChecker({
                            ...checker,
                            age: e.target.value,
                          })
                        }
                        className="w-full h-[46px] rounded-xl border border-[#ddd2ca] bg-[#fffdfb] px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    {/* QUALIFICATION */}

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wide text-[#8c7f79] mb-2">
                        Highest Qualification
                      </label>

                      <select
                        value={checker.qualification}
                        onChange={(e) =>
                          setChecker({
                            ...checker,
                            qualification:
                              e.target.value,
                          })
                        }
                        className="w-full h-[46px] rounded-xl border border-[#ddd2ca] bg-[#fffdfb] px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">
                          Post Graduate
                        </option>

                        <option value="graduation">
                          Graduation
                        </option>

                        <option value="12th">
                          12th
                        </option>
                      </select>
                    </div>

                    {/* CATEGORY */}

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wide text-[#8c7f79] mb-2">
                        Category
                      </label>

                      <select
                        value={checker.category}
                        onChange={(e) =>
                          setChecker({
                            ...checker,
                            category:
                              e.target.value,
                          })
                        }
                        className="w-full h-[46px] rounded-xl border border-[#ddd2ca] bg-[#fffdfb] px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">
                          General / Unreserved
                        </option>

                        <option value="obc">
                          OBC
                        </option>

                        <option value="sc">
                          SC
                        </option>

                        <option value="st">
                          ST
                        </option>

                        <option value="ews">
                          EWS
                        </option>
                      </select>
                    </div>

                    {/* RESULT */}

                    {eligResult && (
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold flex items-center gap-2 ${
                          eligResult ===
                          'eligible'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {eligResult ===
                        'eligible' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />

                            You are eligible
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4" />

                            Not eligible
                          </>
                        )}
                      </div>
                    )}

                    {/* BUTTON */}

                    <button
                      onClick={checkEligibility}
                      className="w-full h-[46px] rounded-xl bg-[#2d2a27] hover:bg-black text-white text-sm font-semibold transition-all"
                    >
                      Check Eligibility
                    </button>

                    {/* APPLY */}

                    <button
                      onClick={handleApply}
                      className="w-full h-[50px] rounded-xl bg-[#f97316] hover:bg-orange-600 text-white text-sm font-bold shadow-lg shadow-orange-200 transition-all"
                    >
                      Apply Now
                    </button>
                  </div>

                  <p className="text-[10px] text-[#9d918b] leading-5 mt-4 text-center">
                    Ensure all details match your
                    official documents before
                    submission.
                  </p>
                </div>
              </div>

              {/* DOWNLOADS */}

              <div className="bg-white border border-[#eadfd7] rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <h2 className="font-bold text-[#2d2a27] mb-5">
                  Official Downloads
                </h2>

                <div className="space-y-3">
                  {job.downloads.map((dl, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center justify-between rounded-2xl border border-[#ece2db] bg-[#faf7f4] hover:bg-orange-50 hover:border-orange-200 px-4 py-4 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <dl.icon className="w-4 h-4 text-orange-500" />

                        <span className="text-sm font-semibold text-[#4b4744]">
                          {dl.name}
                        </span>
                      </div>

                      <Download className="w-4 h-4 text-[#8e817b]" />
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