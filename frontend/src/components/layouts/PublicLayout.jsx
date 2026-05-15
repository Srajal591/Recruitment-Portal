// ============================
// FILE: PublicLayout.jsx
// ============================

import { Link, useLocation } from 'react-router-dom'

import {
  Menu,
  X,
  Bell,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'

import { useState } from 'react'

const PublicLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false)

  const location = useLocation()

  const navItems = [
    {
      label: 'Home',
      path: '/',
    },

    {
      label: 'About Us',
      path: '/about',
    },

    {
      label: 'How to Apply',
      path: '/how-to-apply',
    },

    {
      label: 'FAQ',
      path: '/faq',
    },

    {
      label: 'Contact Us',
      path: '/contact',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f3efe8] overflow-hidden">
      {/* TOP HEADER */}

      <div className="bg-[#1d1d1d] text-white border-b border-white/10">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[38px] flex items-center justify-between text-[11px]">
            {/* LEFT */}

            <div className="hidden md:flex items-center gap-6 text-white/75">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />

                <span>
                  1800-123-4567
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />

                <span>
                  support@recruitment.gov.in
                </span>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-2 text-orange-300 font-semibold">
              <Bell className="w-3.5 h-3.5" />

              Latest Notifications Available
            </div>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}

      <header className="sticky top-0 z-50 bg-[#f6f1ea]/95 backdrop-blur-md border-b border-[#ddd4ca]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[72px] flex items-center justify-between">
            {/* LOGO */}

            <Link
              to="/"
              className="flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-[6px] bg-[#e46a1d] flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">
                  RP
                </span>
              </div>

              <div>
                <h2 className="text-[18px] leading-none tracking-[-0.5px] font-black text-[#1f1d1b]">
                  Recruitment Portal
                </h2>

                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] font-bold text-[#857b74]">
                  Government of India
                </p>
              </div>
            </Link>

            {/* DESKTOP NAV */}

            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => {
                const active =
                  location.pathname ===
                  item.path

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative text-[12px] uppercase tracking-[0.14em] font-black transition-all ${
                      active
                        ? 'text-[#e46a1d]'
                        : 'text-[#5f5752] hover:text-[#e46a1d]'
                    }`}
                  >
                    {item.label}

                    {active && (
                      <div className="absolute left-0 right-0 -bottom-[28px] h-[3px] bg-[#e46a1d]" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* RIGHT */}

            <div className="flex items-center gap-4">
              <Link
                to="/auth/login"
                className="hidden sm:flex h-[42px] px-6 bg-[#e46a1d] hover:bg-[#cb5d16] text-white rounded-[4px] items-center justify-center text-[11px] uppercase tracking-[0.12em] font-black transition-all shadow-lg shadow-orange-200"
              >
                Login
              </Link>

              {/* MOBILE */}

              <button
                onClick={() =>
                  setIsMobileMenuOpen(
                    !isMobileMenuOpen
                  )
                }
                className="lg:hidden w-11 h-11 rounded-[4px] border border-[#ddd4ca] flex items-center justify-center text-[#1f1d1b]"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE NAV */}

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#ddd4ca] bg-[#f6f1ea]">
            <div className="px-4 py-5 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className="block px-4 py-3 rounded-[4px] text-[12px] uppercase tracking-[0.12em] font-black text-[#3f3a36] hover:bg-[#ece5dc]"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                to="/auth/login"
                className="mt-4 flex h-[46px] bg-[#e46a1d] text-white rounded-[4px] items-center justify-center text-[12px] uppercase tracking-[0.12em] font-black"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* MAIN */}

      <main>{children}</main>

      {/* FOOTER */}

      <footer className="bg-[#1b1b1b] text-white mt-20">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* BRAND */}

            <div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-[6px] bg-[#e46a1d] flex items-center justify-center">
                  <span className="text-white font-black text-sm">
                    RP
                  </span>
                </div>

                <div>
                  <h3 className="text-[18px] font-black">
                    Recruitment Portal
                  </h3>

                  <p className="text-[10px] uppercase tracking-[0.12em] text-white/50 mt-1">
                    Government of India
                  </p>
                </div>
              </div>

              <p className="mt-6 text-white/65 text-[14px] leading-7">
                Official government recruitment
                platform for transparent, accessible,
                and trusted hiring.
              </p>
            </div>

            {/* QUICK LINKS */}

            <div>
              <h3 className="text-[13px] uppercase tracking-[0.14em] font-black text-white">
                Quick Links
              </h3>

              <div className="mt-6 space-y-4">
                {[
                  'Latest Jobs',
                  'Results',
                  'Admit Cards',
                  'Notifications',
                ].map((item) => (
                  <button
                    key={item}
                    className="block text-white/65 hover:text-orange-300 transition-colors text-[14px]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* SUPPORT */}

            <div>
              <h3 className="text-[13px] uppercase tracking-[0.14em] font-black text-white">
                Support
              </h3>

              <div className="mt-6 space-y-4">
                {[
                  'FAQ',
                  'Contact Us',
                  'Help Center',
                  'Technical Support',
                ].map((item) => (
                  <button
                    key={item}
                    className="block text-white/65 hover:text-orange-300 transition-colors text-[14px]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTACT */}

            <div>
              <h3 className="text-[13px] uppercase tracking-[0.14em] font-black text-white">
                Contact Info
              </h3>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3 text-white/70">
                  <Phone className="w-5 h-5 mt-0.5 text-orange-400" />

                  <span className="text-[14px]">
                    1800-123-4567
                  </span>
                </div>

                <div className="flex items-start gap-3 text-white/70">
                  <Mail className="w-5 h-5 mt-0.5 text-orange-400" />

                  <span className="text-[14px]">
                    support@recruitment.gov.in
                  </span>
                </div>

                <div className="flex items-start gap-3 text-white/70">
                  <MapPin className="w-5 h-5 mt-0.5 text-orange-400" />

                  <span className="text-[14px]">
                    New Delhi, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM */}

          <div className="mt-14 pt-8 border-t border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <p className="text-white/50 text-[13px]">
              © 2024 Bihar State Recruitment
              Board. All Rights Reserved.
            </p>

            <div className="flex items-center gap-6 text-white/40 text-[12px]">
              <button className="hover:text-orange-300 transition-colors">
                Privacy Policy
              </button>

              <button className="hover:text-orange-300 transition-colors">
                Terms & Conditions
              </button>

              <button className="hover:text-orange-300 transition-colors">
                Accessibility
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout