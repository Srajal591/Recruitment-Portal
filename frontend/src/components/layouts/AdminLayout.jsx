import { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

const AdminLayout = ({ children, title }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Close mobile sidebar on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      // Mobile: open/close drawer
      setMobileSidebarOpen((prev) => !prev)
    } else {
      // Desktop: collapse/expand sidebar
      setSidebarCollapsed((prev) => !prev)
    }
  }

  const closeMobileSidebar = () => setMobileSidebarOpen(false)

  return (
    <div className="min-h-screen bg-orange-50 flex">
      {/* ── Desktop Sidebar ──────────────────────────────────── */}
      <aside
        className={`
          hidden lg:flex flex-col fixed left-0 top-0 h-full z-30 
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-16' : 'w-64'}
        `}
      >
        <AdminSidebar isCollapsed={sidebarCollapsed} />
      </aside>

      {/* ── Mobile Sidebar Overlay ─────────────────────────────── */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 flex"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={closeMobileSidebar}
          />

          {/* Drawer */}
          <div className="relative flex flex-col w-72 max-w-xs bg-white shadow-2xl z-50 animate-slide-in-left">
            <AdminSidebar
              isCollapsed={false}
              isMobile={true}
              onClose={closeMobileSidebar}
            />
          </div>
        </div>
      )}

      {/* ── Main Content Area ─────────────────────────────────── */}
      <div
        className={`
          flex flex-col flex-1 min-w-0
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        `}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20">
          <AdminHeader
            title={title}
            isCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />
        </div>

        {/* Page Content */}
        <main className="flex-1 min-h-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout