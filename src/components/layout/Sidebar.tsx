import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Box, FileText, Brain, GitBranch, 
  ShoppingBag, Bell, BarChart3, Settings, X, ArrowRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: 'Overview', path: '/overview', icon: LayoutDashboard },
  { name: 'Smart Hives', path: '/smart-hives', icon: Box },
  { name: 'Honey Passport', path: '/honey-passport', icon: FileText },
  { name: 'Intelligence', path: '/intelligence', icon: Brain },
  { name: 'Traceability', path: '/traceability', icon: GitBranch },
  { name: 'Market', path: '/market', icon: ShoppingBag },
  { name: 'Alerts', path: '/alerts', icon: Bell },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)] border-r border-[var(--border)] transition-colors duration-300">
      {/* Header / Logo */}
      <div className="flex items-center justify-between p-6">
        <Link to="/" className="flex items-center gap-3 group">
          {/* Honeycomb Logo SVG */}
          <div className="text-[var(--accent)] group-hover:scale-105 transition-transform">
            <svg width="28" height="32" viewBox="0 0 28 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 0L27.8564 8V24L14 32L0.143594 24V8L14 0Z" opacity="0.2"/>
              <path d="M14 3.2L24.8 9.6V22.4L14 28.8L3.2 22.4V9.6L14 3.2ZM14 0L0 8.33333V23.6667L14 32L28 23.6667V8.33333L14 0Z"/>
              <path d="M14 11L19.5 14V20L14 23L8.5 20V14L14 11Z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg leading-none tracking-wide text-[var(--sidebar-text)]">HONEY</span>
            <span className="font-sans text-[0.65rem] font-semibold tracking-[0.2em] text-[var(--sidebar-text)] opacity-70 mt-1">CHAIN</span>
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
            key={item.name}
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
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-5 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold shadow-sm">
            RK
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">Ravi Kumar</p>
            <p className="text-xs text-[var(--text-secondary)]">Beekeeper</p>
          </div>
        </div>
        
        <div className="bg-[var(--sidebar-hover-bg)] p-3 rounded-lg">
          <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Your Apiary</p>
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>
              <span className="block text-[var(--text-primary)] font-bold">24</span>
              <span className="text-xs text-[var(--text-secondary)]">Hives</span>
            </div>
            <div>
              <span className="block text-green-500 font-bold">21</span>
              <span className="text-xs text-[var(--text-secondary)]">Healthy</span>
            </div>
            <div className="col-span-2 mt-1">
              <span className="block text-[var(--accent)] font-bold">186.4 kg</span>
              <span className="text-xs text-[var(--text-secondary)]">Expected Yield</span>
            </div>
          </div>
          <Link 
            to="/smart-hives" 
            className="flex items-center gap-1 text-xs font-medium text-[var(--sidebar-active)] hover:opacity-80 transition-opacity"
          >
            View Apiary <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
