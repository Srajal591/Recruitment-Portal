import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Search,
  Filter,
  Calendar,
  MapPin,
  ChevronRight,
  Lock,
  Phone,
  CircleHelp,
  FileText,
  BadgeAlert,
} from 'lucide-react'

import heroBg from '../../assets/herobg.jpg'

// ─────────────────────────────────────────────────────────────
// MOCK DATA
// API READY STRUCTURE
// ─────────────────────────────────────────────────────────────

const JOBS = [
  {
    id: 1,
    status: 'CLOSING SOON',
    statusColor: 'bg-[#f6cf62]',
    borderColor: 'border-[#d59b00]',
    ref: '2024/ADM/091',

    title: 'Senior Administrative Officer',

    description:
      'Post-graduate in Management with 5+ years experience in public sector administration.',

    date: 'OCT 24, 2024',

    location: 'NEW DELHI',
  },

  {
    id: 2,
    status: 'OPEN',
    statusColor: 'bg-[#78d78a]',
    borderColor: 'border-[#14a44d]',
    ref: '2024/ENG/112',

    title: 'Junior Structural Engineer',

    description:
      'Degree in Civil Engineering from recognized institution. Fresher applications welcome.',

    date: 'NOV 15, 2024',

    location: 'PAN-INDIA',
  },
]

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

const EligibleJobs = () => {
  const navigate = useNavigate()

  // ───────────────────────────────────────────────────────────

  const [filters, setFilters] = useState({
    qualification: 'Post Graduate',
    age: '18 - 25 Years',
    category: 'General',
  })

  // ───────────────────────────────────────────────────────────
  // API READY
  // Replace with backend filtering later
  // ───────────────────────────────────────────────────────────

  const filteredJobs = useMemo(() => {
    return JOBS
  }, [filters])

  // ───────────────────────────────────────────────────────────

  const handleApply = (jobId) => {
    navigate('/auth/verify-otp', {
      state: { jobId },
    })
  }

  const handleViewDetail = (jobId) => {
    navigate(`/jobs/${jobId}`)
  }

  // ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f2eee7]">
      {/* ───────────────── CONTAINER ───────────────── */}

      <div className="max-w-[1380px] mx-auto px-3 sm:px-5 lg:px-8 pt-8 lg:pt-12 pb-20">
        {/* ───────────────── HERO SECTION ───────────────── */}

        <div
          className="relative overflow-hidden rounded-[6px] min-h-[330px] px-6 sm:px-10 lg:px-16 py-10 lg:py-16 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        >
          {/* DARK OVERLAY */}

          <div className="absolute inset-0 bg-black/55" />

          {/* LIGHT OVERLAY */}

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/25" />

          {/* BG SHAPES */}

          <div className="absolute inset-0 opacity-[0.12]">
            <div className="absolute top-0 left-0 w-[280px] h-full border-r border-white/20" />

            <div className="absolute right-[15%] top-0 w-[280px] h-full border-l border-white/20" />

            <div className="absolute left-[25%] top-0 w-[420px] h-[420px] border border-white/10 rotate-45" />
          </div>

          {/* CONTENT */}

          <div className="relative z-10 max-w-[760px]">
            {/* TITLE */}

            <h1 className="text-[32px] sm:text-[46px] lg:text-[56px] leading-[0.92] tracking-[-2px] font-black text-white">
              Institutional Clarity.
              <br />
              Your Future, Defined.
            </h1>

            {/* DESC */}

            <p className="mt-5 text-white/80 text-[13px] sm:text-[15px] leading-7 max-w-[620px]">
              Navigate civil service opportunities with precision.
              Our eligibility engine matches your profile to the
              nation's most critical roles.
            </p>

            {/* FILTER CARD */}

            <div className="mt-9 bg-white rounded-[8px] border border-[#e5ddd5] shadow-[0_20px_40px_rgba(0,0,0,0.25)] overflow-hidden max-w-[980px]">
              {/* HEADER */}

              <div className="px-6 py-5 flex items-center gap-3">
                <Filter className="w-4 h-4 text-[#e97422]" />

                <h3 className="text-[12px] uppercase tracking-[0.12em] font-black text-[#252220]">
                  Smart Eligibility Filter
                </h3>
              </div>

              {/* BODY */}

              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* QUALIFICATION */}

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-[0.18em] text-[#4d4944] mb-2">
                      Qualification
                    </label>

                    <select
                      value={filters.qualification}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          qualification: e.target.value,
                        })
                      }
                      className="w-full h-[48px] bg-[#f3eee7] border border-[#e4dbd1] rounded-[4px] px-4 text-[13px] text-[#2a2724] outline-none"
                    >
                      <option>
                        Post Graduate
                      </option>
                    </select>
                  </div>

                  {/* AGE */}

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-[0.18em] text-[#4d4944] mb-2">
                      Age Range
                    </label>

                    <select
                      value={filters.age}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          age: e.target.value,
                        })
                      }
                      className="w-full h-[48px] bg-[#f3eee7] border border-[#e4dbd1] rounded-[4px] px-4 text-[13px] text-[#2a2724] outline-none"
                    >
                      <option>
                        18 - 25 Years
                      </option>
                    </select>
                  </div>

                  {/* CATEGORY */}

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-[0.18em] text-[#4d4944] mb-2">
                      Category
                    </label>

                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          category: e.target.value,
                        })
                      }
                      className="w-full h-[48px] bg-[#f3eee7] border border-[#e4dbd1] rounded-[4px] px-4 text-[13px] text-[#2a2724] outline-none"
                    >
                      <option>
                        General
                      </option>
                    </select>
                  </div>

                  {/* BUTTON */}

                  <div className="flex items-end">
                    <button className="w-full h-[48px] bg-[#d86417] hover:bg-[#bf5712] text-white rounded-[4px] font-black text-[12px] tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200">
                      <Search className="w-4 h-4" />

                      Check Eligible Jobs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───────────────── JOB SECTION ───────────────── */}

        <div className="mt-12 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
          {/* LEFT */}

          <div>
            {/* HEADER */}

            <div className="flex items-end justify-between border-b border-[#dccfc3] pb-5 mb-7">
              <div>
                <h2 className="text-[30px] sm:text-[36px] leading-none tracking-[-1px] font-black text-[#1e1d1b]">
                  Current Openings
                </h2>

                <p className="mt-3 text-[#746d66] text-[15px]">
                  Found {filteredJobs.length} positions matching your criteria
                </p>
              </div>

              <div className="hidden md:block text-[11px] font-black uppercase tracking-[0.18em] text-[#8f857d]">
                Sort By: Deadline
              </div>
            </div>

            {/* JOBS */}

            <div className="space-y-7">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white rounded-[8px] border-l-[6px] ${job.borderColor} shadow-sm`}
                >
                  <div className="p-7">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* LEFT */}

                      <div className="flex-1">
                        {/* BADGES */}

                        <div className="flex items-center gap-3 mb-5">
                          <span
                            className={`${job.statusColor} text-[#2c2925] text-[10px] uppercase tracking-[0.14em] font-black px-3 py-1 rounded-full`}
                          >
                            {job.status}
                          </span>

                          <span className="text-[12px] text-[#7c746d]">
                            Ref: {job.ref}
                          </span>
                        </div>

                        {/* TITLE */}

                        <h3 className="text-[24px] sm:text-[30px] leading-none tracking-[-1px] font-black text-[#1f1d1b]">
                          {job.title}
                        </h3>

                        {/* DESC */}

                        <p className="mt-5 text-[#706963] text-[15px] leading-8 max-w-[780px]">
                          {job.description}
                        </p>

                        {/* META */}

                        <div className="mt-7 flex flex-wrap items-center gap-6">
                          {/* DATE */}

                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#e46a1d]" />

                            <span className="text-[12px] uppercase tracking-[0.14em] font-black text-[#2a2724]">
                              Last Date:
                            </span>

                            <span className="text-[12px] uppercase tracking-[0.14em] font-black text-[#e46a1d]">
                              {job.date}
                            </span>
                          </div>

                          {/* LOCATION */}

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#e46a1d]" />

                            <span className="text-[12px] uppercase tracking-[0.14em] font-black text-[#2a2724]">
                              {job.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT BUTTONS */}

                      <div className="flex flex-col gap-3 w-full sm:w-[220px]">
                        <button
                          onClick={() =>
                            handleApply(job.id)
                          }
                          className="h-[56px] bg-[#e46a1d] hover:bg-[#cb5e16] text-white rounded-[4px] text-[13px] uppercase tracking-[0.12em] font-black transition-all"
                        >
                          Apply Now
                        </button>

                        <button
                          onClick={() =>
                            handleViewDetail(job.id)
                          }
                          className="h-[56px] bg-[#f2ece4] hover:bg-[#e8dfd6] text-[#8b4b1d] rounded-[4px] text-[13px] uppercase tracking-[0.12em] font-black transition-all"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}

          <div className="space-y-6">
            {/* APPLICANT ACCESS */}

            <div className="relative overflow-hidden bg-[#b65410] rounded-[18px] p-7 shadow-lg">
              {/* CURVES */}

              <div className="absolute -right-10 -bottom-10 w-[140px] h-[140px] border-[10px] border-[#d87938] rounded-full opacity-40" />

              <div className="absolute -right-2 bottom-4 w-[80px] h-[80px] border-[6px] border-[#d87938] rounded-full opacity-40" />

              {/* CONTENT */}

              <div className="relative z-10">
                <h3 className="text-white text-[26px] tracking-[-1px] font-black leading-none">
                  Applicant Access
                </h3>

                {/* LOGIN */}

                <div className="mt-8">
                  <p className="text-[#f4d5bf] text-[13px]">
                    Already registered?
                  </p>

                  <button className="mt-3 w-full h-[54px] bg-white hover:bg-[#fff7f2] rounded-[4px] text-[#b65410] text-[13px] uppercase tracking-[0.14em] font-black flex items-center justify-center gap-2 transition-all">
                    <Lock className="w-4 h-4" />

                    Portal Login
                  </button>
                </div>

                {/* REGISTER */}

                <div className="mt-8 pt-6 border-t border-[#d57d43]">
                  <p className="text-[#f4d5bf] text-[13px]">
                    New to the system?
                  </p>

                  <button className="mt-3 w-full h-[54px] border border-[#e89b67] hover:bg-[#c4611c] text-white rounded-[4px] text-[13px] uppercase tracking-[0.14em] font-black transition-all">
                    Register Profile
                  </button>
                </div>
              </div>
            </div>

            {/* IMPORTANT LINKS */}

            <div className="bg-white rounded-[18px] p-7 shadow-sm">
              <h3 className="text-[24px] leading-none tracking-[-1px] font-black text-[#1f1d1b]">
                Important Links
              </h3>

              <div className="mt-6 space-y-5">
                {[
                  'Reservation Policy',
                  'Age Relaxation Rules',
                  'Document Checklist',
                ].map((item) => (
                  <button
                    key={item}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="text-[#6d6660] text-[15px] group-hover:text-[#d86417] transition-colors">
                      {item}
                    </span>

                    <ChevronRight className="w-4 h-4 text-[#9c938b]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ───────────────── SUPPORT SECTION ───────────────── */}

        <div className="mt-24">
          {/* HEADER */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h2 className="text-[30px] sm:text-[36px] tracking-[-1px] leading-none font-black text-[#1f1d1b] uppercase">
                Support & Guidance
              </h2>

              <p className="mt-4 text-[#756d67] text-[16px]">
                Everything you need to complete your application successfully.
              </p>
            </div>

            {/* BUTTON */}

            <button className="bg-[#b65410] hover:bg-[#a0480b] text-white h-[56px] px-8 rounded-[4px] uppercase tracking-[0.14em] font-black text-[13px] flex items-center justify-center gap-2 transition-all w-full sm:w-auto">
              <Phone className="w-4 h-4" />

              Contact Helpdesk
            </button>
          </div>

          {/* CARDS */}

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FAQ */}

            <div className="bg-white rounded-[8px] p-8 shadow-sm">
              <CircleHelp className="w-7 h-7 text-[#e46a1d]" />

              <h3 className="mt-6 text-[22px] leading-none tracking-[-1px] font-black text-[#1f1d1b]">
                Common FAQs
              </h3>

              <p className="mt-5 text-[#706963] text-[15px] leading-7">
                Find answers to registration, photo upload,
                and payment queries instantly.
              </p>

              <button className="mt-8 text-[#e46a1d] uppercase tracking-[0.14em] text-[12px] font-black">
                Read FAQs
              </button>
            </div>

            {/* USER MANUAL */}

            <div className="bg-white rounded-[8px] p-8 shadow-sm">
              <FileText className="w-7 h-7 text-[#e46a1d]" />

              <h3 className="mt-6 text-[22px] leading-none tracking-[-1px] font-black text-[#1f1d1b]">
                User Manual
              </h3>

              <p className="mt-5 text-[#706963] text-[15px] leading-7">
                A step-by-step guide on navigating the portal
                and tracking applications.
              </p>

              <button className="mt-8 text-[#e46a1d] uppercase tracking-[0.14em] text-[12px] font-black">
                Download PDF
              </button>
            </div>

            {/* GRIEVANCE */}

            <div className="bg-white rounded-[8px] p-8 shadow-sm">
              <BadgeAlert className="w-7 h-7 text-[#e46a1d]" />

              <h3 className="mt-6 text-[22px] leading-none tracking-[-1px] font-black text-[#1f1d1b]">
                Grievance Portal
              </h3>

              <p className="mt-5 text-[#706963] text-[15px] leading-7">
                Lodge complaints or track status of your
                institutional appeals here.
              </p>

              <button className="mt-8 text-[#e46a1d] uppercase tracking-[0.14em] text-[12px] font-black">
                Submit Appeal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EligibleJobs