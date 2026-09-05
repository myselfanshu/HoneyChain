import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTranslation } from '@/contexts/LanguageContext';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const getPageTitle = (pathname: string): string => {
    if (pathname === '/') return t.hero.tagline;
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
        <span className="hidden lg:inline-block text-xs font-mono font-medium text-[var(--text-secondary)] bg-[var(--surface-secondary)] px-3 py-1.5 rounded-full border border-[var(--border)]">
          03 Sep 2026
        </span>

        {/* Global Theme Toggle */}
        <ThemeToggle />

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

        <Link 
          to="/settings"
          className="h-8 w-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold shadow-sm md:hidden text-xs"
          title="Ravi Kumar (Beekeeper)"
        >
          RK
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
