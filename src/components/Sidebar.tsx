import React from 'react';
import { Home, Building2, PoundSterling, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useApp } from '../context/AppContext';

const Sidebar: React.FC = () => {
    const { activeView, setActiveView, sidebarCollapsed, setSidebarCollapsed } = useApp();

    const menuItems = [
        { id: 'Dashboard', icon: Home, label: 'Dashboard' },
        { id: 'Properties', icon: Building2, label: 'Property Hub' },
        { id: 'Finance', icon: PoundSterling, label: 'Finance' },
        { id: 'Settings', icon: Settings, label: 'Settings' },
    ] as const;

    const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

    return (
        <div
            className={clsx(
                "bg-ivolve-dark text-white flex flex-col transition-all duration-300 relative z-20",
                sidebarCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Area */}
            <div className="p-6 flex items-center justify-between border-b border-white/10 h-20 relative">
                <div className={clsx("flex items-center justify-center w-full", sidebarCollapsed ? "" : "pr-4")}>
                    {sidebarCollapsed ? (
                        <div className="w-8 h-8 rounded-full bg-ivolve-bright flex items-center justify-center font-bold text-ivolve-dark">
                            S
                        </div>
                    ) : (
                        <h1 className="text-2xl font-bold font-rounded tracking-wide">Solas</h1>
                    )}
                </div>

                {/* Collapse Toggle - Moved to header area */}
                <button
                    onClick={toggleCollapse}
                    aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-ivolve-dark p-1 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors z-30"
                >
                    {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-2" role="navigation" aria-label="Main navigation">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            aria-current={isActive ? "page" : undefined}
                            className={clsx(
                                "w-full flex items-center rounded-lg transition-all duration-200 group relative",
                                sidebarCollapsed ? "justify-center p-3" : "px-4 py-3 space-x-3",
                                isActive
                                    ? "bg-ivolve-mid text-white shadow-md"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <Icon size={20} className={clsx(isActive ? "text-white" : "text-white/70 group-hover:text-white")} />

                            {!sidebarCollapsed && (
                                <span className="font-medium whitespace-nowrap">{item.label}</span>
                            )}

                            {/* Tooltip / Expanded Label on Hover (Collapsed Mode) */}
                            {sidebarCollapsed && (
                                <div className="absolute left-full ml-2 px-3 py-1.5 bg-ivolve-dark text-white text-sm font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg z-50 border border-white/10">
                                    {item.label}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 space-y-2">
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
                        sidebarCollapsed ? "justify-center p-3" : "px-4 py-2 space-x-3"
                    )}
                >
                    <LogOut size={20} />
                    {!sidebarCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
