import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Box, FileText, Settings } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

const MobileNav: React.FC = () => {
  const { t } = useTranslation();

  const mobileNavItems = [
    { name: t.nav.overview, path: '/overview', icon: LayoutDashboard },
    { name: t.nav.smartHives, path: '/smart-hives', icon: Box },
    { name: t.nav.honeyPassport, path: '/honey-passport', icon: FileText },
    { name: t.nav.settings, path: '/settings', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--sidebar-bg)] border-t border-[var(--border)] z-30 px-2 flex justify-around items-center">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive
                ? 'text-[var(--sidebar-active)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`
          }
        >
          <item.icon size={20} />
          <span className="text-[10px] font-medium truncate max-w-[70px] text-center">{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNav;
