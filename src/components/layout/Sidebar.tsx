import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Box, FileText, Brain, GitBranch, 
  ShoppingBag, Bell, BarChart3, Settings, X, ArrowRight
} from 'lucide-react';

import HoneycombLogo from '@/components/ui/HoneycombLogo';
import { useTranslation } from '@/contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

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

  return (
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)] border-r border-[var(--border)] transition-colors duration-300">
      {/* Header / Logo */}
      <div className="flex items-center justify-between p-6">
        <Link to="/" className="flex items-center gap-3.5 group">
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
          title="Go to Settings"
        >
          <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold shadow-sm group-hover:ring-2 group-hover:ring-[var(--accent)]/40 transition-all shrink-0">
            RK
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[var(--text-primary)] truncate">Ravi Kumar</p>
            <p className="text-xs text-[var(--text-secondary)] truncate">{t.nav.beekeeper} · {t.nav.settings} ↗</p>
          </div>
        </Link>
        
        <div className="bg-[var(--sidebar-hover-bg)] p-3 rounded-lg">
          <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">{t.nav.yourApiary}</p>
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>
              <span className="block text-[var(--text-primary)] font-bold">24</span>
              <span className="text-xs text-[var(--text-secondary)]">{t.nav.hives}</span>
            </div>
            <div>
              <span className="block text-green-500 font-bold">21</span>
              <span className="text-xs text-[var(--text-secondary)]">{t.nav.healthy}</span>
            </div>
            <div className="col-span-2 mt-1">
              <span className="block text-[var(--accent)] font-bold">186.4 kg</span>
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
      </div>
    </div>
  );
};

export default Sidebar;
