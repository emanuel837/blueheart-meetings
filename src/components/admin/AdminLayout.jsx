import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'דשבורד', icon: LayoutDashboard, to: '/admin/dashboard' },
  { label: 'פגישות', icon: Calendar, to: '/admin/meetings' },
  { label: 'לקוחות', icon: Users, to: '/admin/meetings?tab=clients' },
  { label: 'מומחים', icon: UserCheck, to: '/admin/experts' },
  { label: 'סניפים', icon: MapPin, to: '/admin/branches' },
];

function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(to) {
    const [path, search] = to.split('?');

    if (search) {
      return location.pathname === path && location.search === `?${search}`;
    }

    if (path === '/admin/meetings') {
      return location.pathname === path && !location.search.includes('tab=clients');
    }

    return location.pathname === path;
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  function handleLogout() {
    closeMobile();
    logout();
  }

  return (
    <div className="min-h-screen flex bg-white" dir="rtl">
      {mobileOpen && (
        <button
          type="button"
          aria-label="סגירת תפריט"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-64 flex-col bg-[#233667] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <span className="text-xl font-bold tracking-tight">לב הכחול</span>
          <button
            type="button"
            aria-label="סגירת תפריט"
            className="rounded-lg p-1 hover:bg-white/10 lg:hidden"
            onClick={closeMobile}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMobile}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive(to)
                  ? 'bg-[#2d4a8a] text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            התנתקות
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col min-w-0">
        <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            aria-label="פתיחת תפריט"
            className="rounded-lg p-2 text-[#233667] hover:bg-gray-100"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-bold text-[#233667]">לב הכחול</span>
        </header>

        <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
