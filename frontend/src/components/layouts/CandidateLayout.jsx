import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Briefcase,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  User,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Button from "../ui/Button";
import { authService, getStoredUser } from "../../services/auth.service";
import { candidateService } from "../../services/candidate.service";

const navItems = [
  { to: "/candidate/dashboard", label: "Dashboard", icon: Home },
  { to: "/candidate/jobs", label: "Jobs", icon: Briefcase },
  { to: "/candidate/applications", label: "Applications", icon: FileText },
  { to: "/candidate/profile", label: "Profile", icon: User },
  {
    to: "/candidate/notifications",
    label: "Notifications",
    icon: Bell,
    badge: true,
  },
  { to: "/candidate/support", label: "Support", icon: HelpCircle },
];

const CandidateLayout = ({ children, title = "Candidate Portal" }) => {
  const navigate = useNavigate();
  const user = getStoredUser();

  // Fetch unread count for badge
  const { data: notifData } = useQuery({
    queryKey: ["candidate-notifications-count"],
    queryFn: () => candidateService.getNotifications({ limit: 1 }),
    refetchInterval: 30000,
    staleTime: 15000,
  });
  const unreadCount = notifData?.unreadCount || 0;

  const handleLogout = async () => {
    await authService.logout();
    navigate("/auth/candidate-login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-white border-b border-orange-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">RP</span>
            </div>
            <div>
              <div className="font-bold text-gray-800">Recruitment Portal</div>
              <div className="text-sm text-gray-600">Candidate Portal</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {/* Notification bell in header */}
            <Link
              to="/candidate/notifications"
              className="relative p-2 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <span className="hidden sm:inline text-sm text-gray-600">
              {user?.fullName || user?.email || "Candidate"}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 p-4 sm:p-6">
        <aside className="bg-white border border-orange-100 rounded-lg p-3 h-fit">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-700 hover:bg-orange-50"
                  }`
                }
              >
                <div className="relative">
                  <item.icon className="w-4 h-4" />
                  {item.badge && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-orange-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
                {item.badge && unreadCount > 0 && (
                  <span className="ml-auto bg-orange-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <h1 className="sr-only">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;
