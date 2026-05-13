import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

const AdminLayout = ({ children, title }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Fixed Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-30 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} hidden lg:block`}>
        <AdminSidebar isCollapsed={sidebarCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* Add mobile sidebar implementation here */}
      </div>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Fixed Header */}
        <div className="sticky top-0 z-20">
          <AdminHeader 
            title={title}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        </div>
        
        {/* Page Content */}
        <main className="min-h-screen bg-orange-50">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout