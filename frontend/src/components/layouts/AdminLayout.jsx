// ===============================================
// AdminLayout.jsx
// ===============================================

import { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

const AdminLayout = ({ children, title }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

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
      setMobileSidebarOpen((prev) => !prev)
    } else {
      setSidebarCollapsed((prev) => !prev)
    }
  }

  const closeMobileSidebar = () => setMobileSidebarOpen(false)

  return (
    <div className="min-h-screen bg-[#f7f4ee] flex text-[#1f2937]">

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`
          hidden lg:flex flex-col fixed left-0 top-0 h-full z-30
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[78px]' : 'w-[260px]'}
        `}
      >
        <AdminSidebar isCollapsed={sidebarCollapsed} />
      </aside>

      {/* MOBILE SIDEBAR */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 flex"
          aria-modal="true"
          role="dialog"
        >
          {/* BACKDROP */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMobileSidebar}
          />

          {/* DRAWER */}
          <div className="relative flex flex-col w-[260px] max-w-xs bg-white shadow-2xl z-50 animate-slide-in-left">
            <AdminSidebar
              isCollapsed={false}
              isMobile={true}
              onClose={closeMobileSidebar}
            />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div
        className={`
          flex flex-col flex-1 min-w-0
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:ml-[78px]' : 'lg:ml-[260px]'}
        `}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-20 backdrop-blur-md">
          <AdminHeader
            title={title}
            isCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 min-h-0 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout