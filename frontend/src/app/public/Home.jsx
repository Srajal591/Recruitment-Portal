import { useState } from 'react'

import {
  Search,
  ArrowRight,
  Users,
  ShieldCheck,
  LogIn,
  CircleHelp,
  Phone,
  ChevronDown,
  Calendar,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import PublicLayout from '../../components/layouts/PublicLayout'
import heroBg from '../../assets/herobg.jpg'

const Home = () => {
  const navigate = useNavigate()

  const [eligibilityForm, setEligibilityForm] =
    useState({
      qualification: '',
      age: '',
      category: '',
    })

  const handleEligibilityCheck = () => {
    navigate('/eligible-jobs', {
      state: eligibilityForm,
    })
  }

  const featuredJobs = [
    {
      id: 1,
      title: 'Assistant Section Officer (ASO)',
      department: 'Bihar State Secretariat',
      category: 'ACTIVE',
      vacancies: 45,
      lastDate: 'Nov 30, 2024',
      applyFee: '₹750',
    },

    {
      id: 2,
      title: 'Junior Engineer (Mechanical)',
      department: 'Public Works Department',
      category: 'CLOSING SOON',
      vacancies: 120,
      lastDate: 'Dec 15, 2024',
      applyFee: '₹500',
    },
  ]

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#f3efe8]">
        {/* HERO */}

        <section
          className="relative bg-cover bg-center overflow-hidden h-[88vh]"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        >
          {/* OVERLAY */}

          <div className="absolute inset-0 bg-black/55" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

          {/* CONTENT */}

          <div className="relative max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-14 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-center h-[78vh]">
              {/* LEFT */}

              <div className="max-w-[560px]">
                <h1 className="text-[28px] sm:text-[42px] lg:text-[52px] leading-[0.95] tracking-[-1.5px] font-black text-white">
                  Your Career in Public Service
                  <br />
                  Starts Here.
                </h1>

                <p className="mt-5 text-[13px] sm:text-[15px] leading-7 text-white/80 max-w-[500px]">
                  Transparent, accessible, and reliable
                  government job opportunities for every
                  qualified citizen. Find your role today.
                </p>

                <div className="mt-7 inline-flex items-center gap-2 text-orange-300 text-[12px] font-bold">
                  <ShieldCheck className="w-4 h-4" />

                  Official Government Employment Gateway
                </div>
              </div>

              {/* FILTER CARD */}

              <div className="bg-[#f8f5f0] rounded-[6px] border border-[#d8d0c6] shadow-[0_25px_50px_rgba(0,0,0,0.35)] overflow-hidden">
                <div className="px-6 pt-6">
                  <h3 className="text-[20px] tracking-[-0.5px] font-black text-[#1f1d1b]">
                    Smart Eligibility Filter
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  {/* QUALIFICATION */}

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.12em] font-black text-[#3f3b37] mb-2">
                      Qualification
                    </label>

                    <select
                      value={
                        eligibilityForm.qualification
                      }
                      onChange={(e) =>
                        setEligibilityForm({
                          ...eligibilityForm,
                          qualification:
                            e.target.value,
                        })
                      }
                      className="w-full h-[48px] rounded-[4px] border border-[#d7cfc6] bg-white px-4 text-[13px] text-[#272421] outline-none"
                    >
                      <option>
                        Select Highest Qualification
                      </option>

                      <option>
                        10th Pass
                      </option>

                      <option>
                        12th Pass
                      </option>

                      <option>
                        Graduation
                      </option>

                      <option>
                        Post Graduation
                      </option>
                    </select>
                  </div>

                  {/* GRID */}

                  <div className="grid grid-cols-2 gap-4">
                    {/* AGE */}

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.12em] font-black text-[#3f3b37] mb-2">
                        Age
                      </label>

                      <select
                        value={eligibilityForm.age}
                        onChange={(e) =>
                          setEligibilityForm({
                            ...eligibilityForm,
                            age: e.target.value,
                          })
                        }
                        className="w-full h-[48px] rounded-[4px] border border-[#d7cfc6] bg-white px-4 text-[13px] text-[#272421] outline-none"
                      >
                        <option>
                          Enter Age
                        </option>

                        <option>
                          18-25
                        </option>

                        <option>
                          25-30
                        </option>
                      </select>
                    </div>

                    {/* CATEGORY */}

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.12em] font-black text-[#3f3b37] mb-2">
                        Category
                      </label>

                      <select
                        value={
                          eligibilityForm.category
                        }
                        onChange={(e) =>
                          setEligibilityForm({
                            ...eligibilityForm,
                            category:
                              e.target.value,
                          })
                        }
                        className="w-full h-[48px] rounded-[4px] border border-[#d7cfc6] bg-white px-4 text-[13px] text-[#272421] outline-none"
                      >
                        <option>
                          General
                        </option>

                        <option>OBC</option>

                        <option>SC</option>

                        <option>ST</option>
                      </select>
                    </div>
                  </div>

                  {/* BUTTON */}

                  <button
                    onClick={
                      handleEligibilityCheck
                    }
                    className="w-full h-[52px] bg-[#e46a1d] hover:bg-[#cb5d16] text-white rounded-[4px] text-[12px] uppercase tracking-[0.12em] font-black transition-all flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />

                    Check Eligible Jobs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEWS BAR */}

        <div className="bg-[#111111] border-y border-[#2a2a2a]">
          <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 py-2.5 text-white text-[11px] uppercase tracking-[0.08em]">
              <span className="bg-[#e46a1d] px-3 py-1 rounded text-white font-black w-fit">
                Latest Updates
              </span>

              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <span>
                  Admit Card for Assistant Manager
                  Exam 2024 now available
                </span>

                <span>
                  Junior Engineer application extended
                  till 30th October
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <section className="py-12">
          <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: Users,
                  color: 'text-[#4f6ef7]',
                  bg: 'bg-[#eef2ff]',
                  title: 'New User?',
                  desc:
                    'Create your profile and apply to multiple openings.',
                  action: 'Register Now',
                },

                {
                  icon: LogIn,
                  color: 'text-[#19a452]',
                  bg: 'bg-[#ecfff2]',
                  title: 'Already Applied?',
                  desc:
                    'Check status, download admit cards, and results.',
                  action: 'Login Here',
                },

                {
                  icon: CircleHelp,
                  color: 'text-[#9257ff]',
                  bg: 'bg-[#f3ecff]',
                  title: 'Need Help?',
                  desc:
                    'Get recruitment assistance and support resources.',
                  action: 'Get Help',
                },
              ].map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[8px] border border-[#e0d7cd] p-7 text-center"
                >
                  <div
                    className={`w-14 h-14 rounded-full ${card.bg} flex items-center justify-center mx-auto`}
                  >
                    <card.icon
                      className={`w-7 h-7 ${card.color}`}
                    />
                  </div>

                  <h3 className="mt-5 text-[20px] tracking-[-0.5px] font-black text-[#1f1d1b]">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-[#6d6761] text-[14px] leading-7">
                    {card.desc}
                  </p>

                  <button className="mt-5 text-[#e46a1d] text-[12px] uppercase tracking-[0.12em] font-black">
                    {card.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED JOBS */}

        <section className="pb-14">
          <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* HEADER */}

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[28px] font-black tracking-[-1px] text-[#1f1d1b]">
                  Featured Opportunities
                </h2>

                <p className="mt-2 text-[#6d6761] text-[14px]">
                  Handpicked active recruitment notices
                </p>
              </div>

              <button className="hidden sm:flex items-center gap-2 text-[#e46a1d] text-[12px] uppercase tracking-[0.12em] font-black">
                View All Openings

                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* CARDS */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-[8px] border border-[#e0d7cd] p-6"
                >
                  {/* TOP */}

                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.12em] font-black ${
                        job.category === 'ACTIVE'
                          ? 'bg-[#e8fff0] text-[#13984b]'
                          : 'bg-[#fff4df] text-[#c28500]'
                      }`}
                    >
                      {job.category}
                    </span>

                    <span className="text-[11px] text-[#857d77]">
                      Ref. No: BPSC2024
                    </span>
                  </div>

                  {/* TITLE */}

                  <h3 className="text-[22px] tracking-[-0.5px] font-black text-[#1f1d1b]">
                    {job.title}
                  </h3>

                  <p className="mt-2 text-[#6d6761] text-[14px]">
                    {job.department}
                  </p>

                  {/* STATS */}

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.12em] text-[#8a8179] font-black">
                        Vacancies
                      </div>

                      <div className="mt-2 text-[#1f1d1b] font-black text-[14px]">
                        {job.vacancies}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-[0.12em] text-[#8a8179] font-black">
                        Fee
                      </div>

                      <div className="mt-2 text-[#1f1d1b] font-black text-[14px]">
                        {job.applyFee}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-[0.12em] text-[#8a8179] font-black">
                        Last Date
                      </div>

                      <div className="mt-2 text-[#d85f14] font-black text-[14px]">
                        {job.lastDate}
                      </div>
                    </div>
                  </div>

                  {/* BUTTONS */}

                  <div className="flex gap-4 mt-7">
                    <button
                      onClick={() =>
                        navigate(`/jobs/${job.id}`)
                      }
                      className="flex-1 h-[46px] border border-[#e0d7cd] hover:bg-[#f6f1ea] text-[#1f1d1b] rounded-[4px] uppercase tracking-[0.12em] text-[11px] font-black transition-all"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          '/auth/verify-otp',
                          {
                            state: {
                              jobId: job.id,
                            },
                          }
                        )
                      }
                      className="flex-1 h-[46px] bg-[#e46a1d] hover:bg-[#cb5d16] text-white rounded-[4px] uppercase tracking-[0.12em] text-[11px] font-black transition-all"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HELPLINE */}

        <section className="pb-14">
          <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#e46a1d] rounded-[8px] px-7 py-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 text-white">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
                  <Phone className="w-7 h-7" />
                </div>

                <div>
                  <p className="uppercase tracking-[0.12em] text-[10px] font-black text-orange-100">
                    Technical Support Helpline
                  </p>

                  <p className="mt-2 text-orange-100 text-[14px]">
                    Monday to Friday, 9:00 AM to 6:00 PM
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="uppercase tracking-[0.12em] text-[10px] font-black text-orange-100">
                  Toll Free Number
                </p>

                <h3 className="mt-2 text-[34px] tracking-[-1px] font-black">
                  1800-123-4567
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}

        <section className="pb-20">
          <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[8px] border border-[#e0d7cd] overflow-hidden">
              {/* HEADER */}

              <div className="px-7 py-6 border-b border-[#ebe2d8]">
                <h2 className="text-[26px] tracking-[-1px] font-black text-[#1f1d1b]">
                  Frequently Asked Questions
                </h2>
              </div>

              {/* ITEMS */}

              {[
                'How do I verify my eligibility for multiple posts?',
                'Can I edit my application after submission?',
                'What documents are mandatory for registration?',
              ].map((item, index) => (
                <button
                  key={index}
                  className="w-full px-7 py-5 border-b border-[#ebe2d8] last:border-0 flex items-center justify-between hover:bg-[#faf7f2] transition-all text-left"
                >
                  <span className="text-[#2a2724] text-[14px]">
                    {item}
                  </span>

                  <ChevronDown className="w-5 h-5 text-[#8a8179]" />
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}

export default Home