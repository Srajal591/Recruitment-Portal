import { Search, Bell, HelpCircle, Menu, Settings, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

const AdminHeader = ({ onToggleSidebar, title = 'Admin Panel', isCollapsed }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left: toggle + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            {/* Mobile: always hamburger; Desktop: panel open/close icon */}
            <span className="lg:hidden">
              <Menu className="w-5 h-5" />
            </span>
            <span className="hidden lg:block">
              {isCollapsed
                ? <PanelLeftOpen className="w-5 h-5" />
                : <PanelLeftClose className="w-5 h-5" />
              }
            </span>
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold text-gray-800 truncate leading-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: search + actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Search — hidden on small screens */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search…"
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent w-56 lg:w-72 bg-gray-50 focus:bg-white transition-all text-sm"
            />
          </div>

          {/* Search icon only on mobile */}
          <button className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Help */}
          <button className="hidden sm:flex p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button className="hidden sm:flex p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* User profile */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gray-200 ml-1">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-gray-800 leading-tight">Admin Central</div>
              <div className="text-[10px] text-orange-600 font-bold uppercase tracking-wide">Super Admin</div>
            </div>
            <div className="relative group">
              <button className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">AC</span>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-gray-100">
                  <div className="font-semibold text-gray-900 text-sm">Admin Central</div>
                  <div className="text-xs text-gray-500">admin@portal.gov.in</div>
                </div>
                <div className="p-2">
                  <Link
                    to="/admin/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span>Profile Settings</span>
                  </Link>
                  <Link
                    to="/auth/login"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader