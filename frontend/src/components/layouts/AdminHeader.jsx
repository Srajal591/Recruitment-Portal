import { Search, Bell, HelpCircle, Menu, Settings, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const AdminHeader = ({ onToggleSidebar, title = "Admin Panel" }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects, candidates, or jobs..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-80 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Help */}
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-800">Admin Central</div>
              <div className="text-xs text-primary font-medium">SUPER ADMINISTRATOR</div>
            </div>
            <div className="relative group">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-white font-medium text-sm">AC</span>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-gray-100">
                  <div className="font-medium text-gray-800">Admin Central</div>
                  <div className="text-sm text-gray-500">admin@bihar.gov.in</div>
                </div>
                <div className="p-2">
                  <Link to="/admin/profile" className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                    <span>Profile Settings</span>
                  </Link>
                  <Link to="/auth/login" className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
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