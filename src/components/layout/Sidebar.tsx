import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Box, FileText, Brain, GitBranch, 
  ShoppingBag, Bell, BarChart3, Settings, X, ArrowRight, LogOut, UserCircle
} from 'lucide-react';

import HoneycombLogo from '@/components/ui/HoneycombLogo';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { reportsApi, ReportsSummary } from '@/api';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user, isGuest, logout, token } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: t.nav.overview, path: '/overview', icon: LayoutDashboard },
    { name: t.nav.smartHives, path: '/smart-hives', icon: Box },
    { name: t.nav.honeyPassport, path: '/honey-passport', icon: FileText },
    { name: t.nav.intelligence, path: '/intelligence', icon: Brain },
    { name: t.nav.traceability, path: '/traceability', icon: GitBranch },
    { name: t.nav.market, path: '/market', icon: ShoppingBag },
    { name: t.nav.alerts, path: '/alerts', icon: Bell },
    { name: t.nav.reports, path: '/reports', icon: BarChart3 },
    { name: t.nav.settings, path: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  // Derived display
  const displayName = user?.name || (isGuest ? 'Guest Explorer' : 'HoneyChain User');
  const displayRole = isGuest ? t.guest.badge : (user?.role ? t.nav.beekeeper : '');
  const initials = isGuest ? 'G' : displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Live summary metrics
  const [summary, setSummary] = React.useState<ReportsSummary | null>(null);

  React.useEffect(() => {
    if (isGuest) return;
    reportsApi.getSummary(token).then(setSummary).catch(() => {});
  }, [isGuest, token]);

  return (
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)] border-r border-[var(--border)] transition-colors duration-300">
      {/* Header / Logo */}
      <div className="flex items-center justify-between p-6">
        <Link to="/home" className="flex items-center gap-3.5 group">
          <HoneycombLogo size={32} />
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg leading-none tracking-wide text-[var(--sidebar-text)]">
              {t.common.brandName}
            </span>
            <span className="font-sans text-[0.62rem] font-bold tracking-[0.25em] text-[var(--accent)] mt-1">
              {t.common.brandSub}
            </span>
          </div>
        </Link>
        <button 
          onClick={onClose}
          className="md:hidden text-[var(--sidebar-text)] p-1 hover:bg-[var(--sidebar-hover-bg)] rounded-md"
        >
          <X size={20} />
        </button>
      </div>

      {/* Guest Mode Banner */}
      {isGuest && (
        <div className="mx-4 mb-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">{t.guest.badge}</p>
          <p className="text-[10px] text-amber-600/80 dark:text-amber-500/70 mt-0.5">{t.guest.restrictionNotice}</p>
          <div className="flex gap-1.5 mt-2">
            <button
              onClick={() => { navigate('/'); onClose(); }}
              className="flex-1 text-[10px] font-semibold text-white bg-[var(--accent)] rounded px-2 py-1 hover:opacity-90 transition-opacity"
            >
              {t.guest.signInPrompt}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active)]'
                  : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)]'
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-5 border-t border-[var(--border)]">
        <Link
          to="/settings"
          className="flex items-center gap-3 mb-4 group rounded-xl p-2 -mx-2 hover:bg-[var(--sidebar-hover-bg)] transition-colors"
          title={`${displayName} — ${displayRole}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm group-hover:ring-2 group-hover:ring-[var(--accent)]/40 transition-all shrink-0 text-sm ${isGuest ? 'bg-[var(--border)] text-[var(--text-secondary)]' : 'bg-[var(--accent)] text-white'}`}>
            {isGuest ? <UserCircle size={20} /> : initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[var(--text-primary)] truncate">{displayName}</p>
            <p className="text-xs text-[var(--text-secondary)] truncate">
              {displayRole} {!isGuest && `· ${t.nav.settings} ↗`}
            </p>
          </div>
        </Link>
        
        {!isGuest && (
          <div className="bg-[var(--sidebar-hover-bg)] p-3 rounded-lg mb-3">
            <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">{t.nav.yourApiary}</p>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="block text-[var(--text-primary)] font-bold">{summary?.totalHives ?? 0}</span>
                <span className="text-xs text-[var(--text-secondary)]">{t.nav.hives}</span>
              </div>
              <div>
                <span className="block text-green-500 font-bold">{summary?.healthyHives ?? 0}</span>
                <span className="text-xs text-[var(--text-secondary)]">{t.nav.healthy}</span>
              </div>
              <div className="col-span-2 mt-1">
                <span className="block text-[var(--accent)] font-bold">{`${Number(summary?.totalHarvestKg || 0).toFixed(1)} kg`}</span>
                <span className="text-xs text-[var(--text-secondary)]">{t.nav.expectedYield}</span>
              </div>
            </div>
            <Link 
              to="/smart-hives" 
              className="flex items-center gap-1 text-xs font-medium text-[var(--sidebar-active)] hover:opacity-80 transition-opacity"
            >
              {t.nav.viewApiary} <ArrowRight size={12} />
            </Link>
          </div>
        )}

        {/* Sign Out button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
        >
          <LogOut size={14} />
          <span>{t.auth.signOut}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
