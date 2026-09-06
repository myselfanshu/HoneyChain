import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, LogOut, UserCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LiveDateDisplay } from '@/components/ui/LiveDateDisplay';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, isGuest, logout } = useAuth();
  const navigate = useNavigate();

  const getPageTitle = (pathname: string): string => {
    if (pathname === '/home' || pathname === '/') return t.hero.tagline;
    if (pathname === '/overview') return t.nav.overview;
    if (pathname.startsWith('/smart-hives')) return t.nav.smartHives;
    if (pathname.startsWith('/honey-passport')) return t.nav.honeyPassport;
    if (pathname.startsWith('/intelligence')) return t.nav.intelligence;
    if (pathname.startsWith('/traceability')) return t.nav.traceability;
    if (pathname.startsWith('/market')) return t.nav.market;
    if (pathname.startsWith('/alerts')) return t.nav.alerts;
    if (pathname.startsWith('/reports')) return t.nav.reports;
    if (pathname.startsWith('/settings')) return t.nav.settings;
    return t.common.brandFullName;
  };

  const title = getPageTitle(location.pathname);
  const initials = isGuest ? 'G' : user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'HC';

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="flex items-center justify-between h-16 px-3 sm:px-4 md:px-8 bg-[var(--background)] border-b border-[var(--border)] transition-colors duration-300 shrink-0 min-w-0">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 mr-2">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 -ml-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--sidebar-hover-bg)] rounded-md shrink-0"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-base sm:text-lg md:text-xl font-serif font-semibold text-[var(--text-primary)] tracking-wide truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
        {/* Guest Mode Pill */}
        {isGuest && (
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-full text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/30 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {t.guest.badge}
          </Link>
        )}

        {/* Current date */}
        <LiveDateDisplay
          className="hidden lg:inline-block text-xs font-mono font-medium text-[var(--text-secondary)] bg-[var(--surface-secondary)] px-3 py-1.5 rounded-full border border-[var(--border)]"
        />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Alerts */}
        {!isGuest && (
          <Link 
            to="/alerts" 
            className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] rounded-full transition-colors"
            aria-label="View alerts"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-[var(--background)]">
              3
            </span>
          </Link>
        )}

        {/* User Avatar / Sign Out */}
        <div className="flex items-center gap-1">
          <Link 
            to="/settings"
            className={`h-8 w-8 rounded-full flex items-center justify-center font-bold shadow-sm text-xs transition-all ${isGuest ? 'bg-[var(--border)] text-[var(--text-secondary)]' : 'bg-[var(--accent)] text-white'}`}
            title={user?.name || (isGuest ? 'Guest Explorer' : 'Profile')}
          >
            {isGuest ? <UserCircle size={16} /> : initials}
          </Link>
          <button
            onClick={handleLogout}
            className="hidden md:flex p-1.5 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
            title={t.auth.signOut}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
