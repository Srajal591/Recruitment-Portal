import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  HeadphonesIcon, 
  BarChart3, 
  Activity, 
  UserCheck, 
  Shield, 
  CreditCard,
  FolderOpen
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'

const AdminSidebar = ({ isCollapsed = false }) => {
  const location = useLocation()

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      icon: FolderOpen,
      label: 'Projects',
      path: '/admin/projects',
    },
    {
      icon: Briefcase,
      label: 'Jobs',
      path: '/admin/jobs',
    },
    {
      icon: Users,
      label: 'Applications',
      path: '/admin/applications',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/admin/analytics',
    },
    {
      icon: HeadphonesIcon,
      label: 'Support',
      path: '/admin/support',
    },
    {
      icon: UserCheck,
      label: 'Employees',
      path: '/admin/employees',
    },
    {
      icon: Shield,
      label: 'Roles & Permissions',
      path: '/admin/roles',
    },
    {
      icon: CreditCard,
      label: 'Payment Settings',
      path: '/admin/payment-settings',
    },
  ]

  return (
    <div className={cn(
      'bg-white border-r border-gray-200 h-full transition-all duration-300 shadow-sm',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">BR</span>
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-gray-800">Admin Panel</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={cn(
                'w-5 h-5 flex-shrink-0 transition-colors',
                isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
              )} />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          )
        })}
        
        {/* Quick Access */}
        {!isCollapsed && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-500 mb-2 px-3">QUICK ACCESS</div>
            <Link
              to="/candidate/dashboard"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="text-sm">Candidate Portal</span>
            </Link>
            <Link
              to="/"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm">Public Website</span>
            </Link>
          </div>
        )}
      </nav>
    </div>
  )
}

export default AdminSidebar