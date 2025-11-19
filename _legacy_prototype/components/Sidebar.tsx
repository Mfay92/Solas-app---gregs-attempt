



import React, { useState, useRef, useEffect } from 'react';
import { 
    PropertiesIcon, PeopleIcon, ComplianceIcon, 
    LegalIcon, UserCircleIcon, CogIcon, LogoutIcon, DevelopmentIcon, 
    VoidManagementIcon, MySpaceIcon, ApplicationsIcon, RepairsCenterIcon,
    ReportsCenterIcon, MarketingSuiteIcon, LibraryIcon, StakeholderHubIcon, ContactHubIcon,
    FileTextIcon, ClipboardIcon
} from './Icons';
import { ivolveGroupLogo } from '../services/generatedAssets';
import { IvolveStaff } from '../types';
import { getDepartmentStyles } from './ContactCard';
import { usePersona } from '../contexts/PersonaContext';
import DevHubButton from './DevHubButton';

type SidebarProps = {
  user: IvolveStaff | null;
  activeView: string;
  onNavigate: (view: string) => void;
  onDevHubClick: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ user, activeView, onNavigate, onDevHubClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = usePersona();
  
  const departmentStyles = user ? getDepartmentStyles(user.team) : null;

  const navItems = [
    { name: 'My Space', viewId: 'Dashboard', icon: <MySpaceIcon /> },
    { name: 'Growth Hub', viewId: 'GrowthHub', icon: <ClipboardIcon /> },
    { name: 'Growth and Development', viewId: 'Development', icon: <DevelopmentIcon /> },
    { name: 'Properties', icon: <PropertiesIcon /> },
    { name: t('people_plural_capitalized'), viewId: 'People', icon: <PeopleIcon /> },
    { name: 'Stakeholder Hub', icon: <StakeholderHubIcon /> },
    { name: 'Contact Hub', icon: <ContactHubIcon /> },
    { name: 'Applications & Referrals', viewId: 'Applications', icon: <ApplicationsIcon /> },
    { name: 'Void Management', icon: <VoidManagementIcon /> },
    { name: 'Compliance & PPM', icon: <ComplianceIcon /> },
    { name: 'Repairs Center', viewId: 'Maintenance', icon: <RepairsCenterIcon /> },
    { name: 'Legal Hub', viewId: 'LegalHub', icon: <LegalIcon /> },
    { name: 'Reports Center', viewId: 'Reports', icon: <ReportsCenterIcon /> },
    { name: 'Marketing Suite', viewId: 'Marketing', icon: <MarketingSuiteIcon />, disabled: true },
    { name: 'The Library', viewId: 'Library', icon: <LibraryIcon /> },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  if (!user) {
      return (
        <aside className="w-64 bg-app-sidebar text-app-sidebar-text flex flex-col h-screen fixed">
            <div className="p-4 border-b border-white/10 h-20 flex items-center">
                <div className="w-32 h-10 bg-white/20 rounded animate-pulse"></div>
            </div>
            <div className="flex-1 p-2 space-y-1 mt-4 animate-pulse">
                <div className="h-10 bg-white/10 rounded-md"></div>
                <div className="h-10 bg-white/10 rounded-md"></div>
                <div className="h-10 bg-white/10 rounded-md"></div>
            </div>
        </aside>
      );
  }

  return (
    <aside className="w-64 bg-app-sidebar text-app-sidebar-text flex flex-col h-screen fixed">
      <div className="p-4 border-b border-white/10 h-20 flex items-center">
        <img src={ivolveGroupLogo} alt="ivolve group logo" className="h-auto w-auto max-h-12" />
      </div>
      <nav className="sidebar-nav flex-1 p-2 space-y-1 mt-4 overflow-y-auto">
        {navItems.map((item) => {
          const viewName = item.viewId || item.name;
          const isActive = activeView === viewName;
          const isDisabled = 'disabled' in item && item.disabled;
          
          const itemClasses = `flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
            isDisabled
              ? 'text-gray-500 cursor-not-allowed'
              : isActive
              ? 'bg-app-sidebar-active text-white font-bold'
              : 'hover:bg-white/10 hover:text-app-sidebar-text-hover'
          }`;

          return (
            <a
              key={item.name}
              href="#"
              className={itemClasses}
              onClick={(e) => {
                e.preventDefault();
                if (!isDisabled) {
                  onNavigate(viewName);
                }
              }}
              aria-disabled={isDisabled}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </a>
          );
        })}
      </nav>
      <div className="p-2 border-t border-white/10 relative" ref={menuRef}>
        {menuOpen && (
             <div className="absolute bottom-full left-2 right-2 mb-2 bg-solas-dark rounded-md shadow-lg py-1 z-20">
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('Profile'); setMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                    <UserCircleIcon /> <span className="ml-2">My Profile</span>
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('Settings'); setMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                    <CogIcon /> <span className="ml-2">Settings</span>
                </a>
                 <div className="border-t border-gray-700 my-1"></div>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Signing out!"); setMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                    <LogoutIcon /> <span className="ml-2">Sign Out</span>
                </a>
            </div>
        )}
        <div className="relative">
            <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-full flex items-center p-2 rounded-md hover:bg-white/10 text-left"
            >
              <div className="relative w-10 h-10 flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full border-2 ${departmentStyles ? departmentStyles.border : 'border-ivolve-bright-green'} bg-gray-200 flex items-center justify-center text-gray-400`}>
                      <UserCircleIcon />
                  </div>
                  <DevHubButton onClick={onDevHubClick} />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-semibold text-sm text-white">{user.name}</p>
                <p className="text-xs text-gray-300">{user.role}</p>
                {departmentStyles && (
                     <span className={`mt-1 inline-block px-1.5 py-0.5 text-xs font-semibold rounded-md ${departmentStyles.bg} ${departmentStyles.text}`}>
                        {user.team}
                     </span>
                )}
              </div>
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;