import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, PoundSterling, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useApp } from '../context/AppContext';

const Sidebar: React.FC = () => {
    const { sidebarCollapsed, setSidebarCollapsed } = useApp();
    const location = useLocation();

    const menuItems = [
        { path: '/', icon: Home, label: 'Dashboard' },
        { path: '/properties', icon: Building2, label: 'Property Hub' },
        { path: '/finance', icon: PoundSterling, label: 'Finance' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ] as const;

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

    // Auto-collapse when mouse leaves expanded sidebar
    const handleMouseLeave = () => {
        if (!sidebarCollapsed) {
            setSidebarCollapsed(true);
        }
    };

    return (
        <div
            onMouseLeave={handleMouseLeave}
            className={clsx(
                // Base styles with subtle gradient
                "fixed left-0 top-0 h-screen text-white flex flex-col z-20",
                "bg-gradient-to-b from-ivolve-dark via-ivolve-dark to-[#024535]",
                // Smooth width transition
                "transition-all duration-300 ease-out",
                // Shadow when expanded for overlay effect
                sidebarCollapsed
                    ? "w-20 shadow-md"
                    : "w-64 shadow-2xl shadow-black/30"
            )}
        >
            {/* Logo Area */}
            <div className="p-4 flex items-center justify-between border-b border-white/10 h-16 relative">
                <div className={clsx("flex items-center justify-center w-full", sidebarCollapsed ? "" : "pr-4")}>
                    {sidebarCollapsed ? (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ivolve-bright to-ivolve-mid flex items-center justify-center font-bold text-white shadow-lg">
                            S
                        </div>
                    ) : (
                        <h1 className="text-xl font-bold font-rounded tracking-wide">Solas</h1>
                    )}
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={toggleCollapse}
                    aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className={clsx(
                        "absolute top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all duration-200 z-30",
                        "bg-white text-ivolve-dark shadow-md border border-gray-200",
                        "hover:bg-gray-50 hover:scale-110 active:scale-95",
                        sidebarCollapsed ? "-right-3" : "right-2"
                    )}
                >
                    {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 space-y-1" role="navigation" aria-label="Main navigation">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            aria-current={active ? "page" : undefined}
                            className={clsx(
                                "w-full flex items-center rounded-lg transition-all duration-200 group relative",
                                sidebarCollapsed ? "justify-center p-2.5" : "px-3 py-2.5 space-x-3",
                                active
                                    ? "bg-gradient-to-r from-ivolve-mid to-ivolve-mid/80 text-white shadow-md"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <Icon
                                size={20}
                                className={clsx(
                                    "transition-transform duration-200",
                                    active ? "text-white" : "text-white/70 group-hover:text-white",
                                    "group-hover:scale-110"
                                )}
                            />

                            {!sidebarCollapsed && (
                                <span className="font-medium whitespace-nowrap text-sm">{item.label}</span>
                            )}

                            {/* Tooltip on hover (Collapsed Mode) */}
                            {sidebarCollapsed && (
                                <div className="absolute left-full ml-3 px-3 py-1.5 bg-ivolve-dark text-white text-sm font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap shadow-xl z-50 border border-white/10 group-hover:translate-x-0 -translate-x-1">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 space-y-2">
                {/* User Profile */}
                <div className={clsx(
                    "flex items-center rounded-lg bg-white/5 p-2 transition-all",
                    sidebarCollapsed ? "justify-center" : "space-x-3"
                )}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border border-white/20 overflow-hidden flex-shrink-0">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Matt" alt="User avatar for Matt" className="w-full h-full" />
                    </div>
                    {!sidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Matt</p>
                            <p className="text-xs text-white/50 truncate">Admin</p>
                        </div>
                    )}
                </div>

                <button
                    aria-label="Log out"
                    className={clsx(
                        "w-full flex items-center rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors",
                        sidebarCollapsed ? "justify-center p-2.5" : "px-3 py-2 space-x-3"
                    )}
                >
                    <LogOut size={18} />
                    {!sidebarCollapsed && <span className="font-medium text-sm">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
