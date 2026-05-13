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
  FolderOpen,
  X
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard',        path: '/admin/dashboard' },
  { icon: FolderOpen,      label: 'Projects',          path: '/admin/projects' },
  { icon: Briefcase,       label: 'Jobs',              path: '/admin/jobs' },
  { icon: Users,           label: 'Applications',      path: '/admin/applications' },
  { icon: BarChart3,       label: 'Analytics',         path: '/admin/analytics' },
  { icon: Activity,        label: 'Activity Logs',     path: '/admin/activity-logs' },
  { icon: HeadphonesIcon,  label: 'Support',           path: '/admin/support' },
  { icon: UserCheck,       label: 'Employees',         path: '/admin/employees' },
  { icon: Shield,          label: 'Roles & Permissions', path: '/admin/roles' },
  { icon: CreditCard,      label: 'Payment Settings',  path: '/admin/payment-settings' },
]

const AdminSidebar = ({ isCollapsed = false, isMobile = false, onClose }) => {
  const location = useLocation()

  return (
    <div className="bg-white border-r border-orange-100 h-full flex flex-col shadow-sm overflow-hidden">
      {/* Logo */}
      <div className={cn(
        'flex items-center border-b border-orange-100 bg-white flex-shrink-0',
        isCollapsed && !isMobile ? 'p-3 justify-center' : 'p-4'
      )}>
        <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
          <span className="text-white font-bold text-sm">BR</span>
        </div>
        {(!isCollapsed || isMobile) && (
          <div className="ml-3 flex-1 min-w-0">
            <span className="font-bold text-gray-900 text-sm tracking-tight block truncate">Admin Panel</span>
            <span className="text-[10px] text-orange-500 font-semibold uppercase tracking-widest">Recruitment Portal</span>
          </div>
        )}
        {/* Mobile close button */}
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {!isCollapsed || isMobile ? (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pb-2 pt-1">
            Main Navigation
          </p>
        ) : null}

        {menuItems.map((item) => {
          const Icon = item.icon
          // Highlight active: exact match OR sub-path (but not cross-contaminating)
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path + '/'))
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={isMobile ? onClose : undefined}
              title={isCollapsed && !isMobile ? item.label : undefined}
              className={cn(
                'flex items-center rounded-lg transition-all duration-150 group relative',
                isCollapsed && !isMobile
                  ? 'px-2 py-2.5 justify-center'
                  : 'px-3 py-2.5 space-x-3',
                isActive
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-gray-900'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-600'
                )}
              />
              {(!isCollapsed || isMobile) && (
                <span className="font-medium text-sm leading-none">{item.label}</span>
              )}
              {/* Tooltip for collapsed mode */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Quick Access */}
      {(!isCollapsed || isMobile) && (
        <div className="flex-shrink-0 border-t border-orange-100 p-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pb-2">
            Quick Access
          </p>
          <Link
            to="/candidate/dashboard"
            onClick={isMobile ? onClose : undefined}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors text-sm font-medium"
          >
            <UserCheck className="w-4 h-4 flex-shrink-0" />
            <span>Candidate Portal</span>
          </Link>
          <Link
            to="/"
            onClick={isMobile ? onClose : undefined}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors text-sm font-medium"
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            <span>Public Website</span>
          </Link>
        </div>
      )}
    </div>
  )
}

export default AdminSidebar