import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Briefcase, FileText, HelpCircle,
  Home, LogOut, User,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { authService, getStoredUser } from '../../services/auth.service'
import { candidateService } from '../../services/candidate.service'
import LogoutModal from '../ui/LogoutModal'

const navItems = [
  { to: '/candidate/dashboard',     label: 'Dashboard',     icon: Home       },
  { to: '/candidate/jobs',          label: 'Jobs',          icon: Briefcase  },
  { to: '/candidate/applications',  label: 'Applications',  icon: FileText   },
  { to: '/candidate/profile',       label: 'Profile',       icon: User       },
  { to: '/candidate/notifications', label: 'Notifications', icon: Bell, badge: true },
  { to: '/candidate/support',       label: 'Support',       icon: HelpCircle },
]

// Page transition variants
const pageVariants = {
  initial:  { opacity: 0, y: 16 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

// Sidebar nav item stagger
const sidebarVariants = {
  animate: { transition: { staggerChildren: 0.05 } },
}
const navItemVariants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

const CandidateLayout = ({ children, title = 'Candidate Portal' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getStoredUser()
  const [showLogout, setShowLogout] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mainRef = useRef(null)

  const { data: notifData } = useQuery({
    queryKey: ['candidate-notifications-count'],
    queryFn: () => candidateService.getNotifications({ limit: 1 }),
    refetchInterval: 30000,
    staleTime: 15000,
  })
  const unreadCount = notifData?.unreadCount || 0

  // Header shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    await authService.logout()
    navigate('/auth/candidate-login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-orange-50">

      {/* ── Top Header ── */}
      <header className={`sticky top-0 z-30 bg-white border-b border-orange-200 px-4 py-3.5 transition-shadow duration-200 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-sm"
            >
              <span className="text-white font-bold">RP</span>
            </motion.div>
            <div>
              <div className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">Recruitment Portal</div>
              <div className="text-xs text-gray-500">Candidate Portal</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/candidate/notifications"
                className="relative p-2 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>

            <span className="hidden sm:inline text-sm text-gray-600 font-medium">
              {user?.fullName || user?.email || 'Candidate'}
            </span>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowLogout(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5 px-4 sm:px-6 py-5">

        {/* ── Sidebar ── */}
        <aside className="h-fit sticky top-[69px]">
          {/* Header strip */}
          <div className="bg-[#0f172a] rounded-t-xl px-4 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white font-bold text-xs">RP</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Candidate Portal</p>
              <p className="text-orange-400 text-[10px] font-semibold uppercase tracking-widest">Bihar Recruitment</p>
            </div>
          </div>

          {/* Nav */}
          <motion.nav
            variants={sidebarVariants}
            initial="initial"
            animate="animate"
            className="bg-[#1e293b] rounded-b-xl p-2 space-y-0.5"
          >
            {navItems.map((item) => (
              <motion.div key={item.to} variants={navItemVariants}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-sm shadow-orange-900/30'
                        : 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="relative flex-shrink-0">
                        <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        {item.badge && unreadCount > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </div>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && unreadCount > 0 && (
                        <span className="bg-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}

            {/* Divider */}
            <div className="border-t border-white/10 my-1" />

            {/* Sign out */}
            <motion.button
              variants={navItemVariants}
              whileHover={{ x: 2 }}
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Sign Out</span>
            </motion.button>
          </motion.nav>
        </aside>

        {/* ── Page Content with animation ── */}
        <main className="min-w-0" ref={mainRef}>
          <h1 className="sr-only">{title}</h1>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Logout Modal ── */}
      <LogoutModal
        isOpen={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
        isPending={loggingOut}
      />
    </div>
  )
}

export default CandidateLayout
