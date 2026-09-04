import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface TopBarProps {
  onMenuClick: () => void;
}

const getPageTitle = (pathname: string): string => {
  if (pathname === '/') return 'Every Drop Has a Story';
  if (pathname === '/overview') return 'Overview';
  if (pathname.startsWith('/smart-hives')) return 'Smart Hives';
  if (pathname.startsWith('/honey-passport')) return 'Honey Passport';
  if (pathname.startsWith('/intelligence')) return 'AI Intelligence';
  if (pathname.startsWith('/traceability')) return 'Traceability';
  if (pathname.startsWith('/market')) return 'Honey Marketplace';
  if (pathname.startsWith('/alerts')) return 'Alerts';
  if (pathname.startsWith('/reports')) return 'Reports & Analytics';
  if (pathname.startsWith('/settings')) return 'Settings';
  return 'Honey Chain';
};

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-8 bg-[var(--background)] border-b border-[var(--border)] transition-colors duration-300 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--sidebar-hover-bg)] rounded-md"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-serif font-semibold text-[var(--text-primary)] tracking-wide">{title}</h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-5">
        <span className="hidden sm:inline-block text-xs font-mono font-medium text-[var(--text-secondary)] bg-[var(--surface-secondary)] px-3 py-1.5 rounded-full border border-[var(--border)]">
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
