import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

const AdminLayout = ({ children, title }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-orange-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 hidden lg:block`}>
        <AdminSidebar isCollapsed={sidebarCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* Add mobile sidebar implementation here */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminHeader 
          title={title}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main className="flex-1 overflow-auto bg-orange-50">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout