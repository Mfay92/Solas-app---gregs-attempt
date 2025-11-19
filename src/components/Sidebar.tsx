import React from 'react';
import { Home, Building2, Users, FileText, Settings, PieChart, Hammer } from 'lucide-react';

interface SidebarProps {
    onNavigate: (view: string) => void;
    activeView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeView }) => {
    const navItems = [
        { icon: Home, label: 'Dashboard' },
        { icon: Building2, label: 'Properties' },
        { icon: Users, label: 'People' },
        { icon: Hammer, label: 'Maintenance' },
        { icon: FileText, label: 'Documents' },
        { icon: PieChart, label: 'Reports' },
        { icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-64 bg-ivolve-dark h-screen text-white flex flex-col shadow-xl">
            <div className="p-6 border-b border-ivolve-mid/30">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    Solas
                </h1>
                <p className="text-ivolve-bright text-xs mt-1 font-medium tracking-wide">PROPERTY INTELLIGENCE</p>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => onNavigate(item.label)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeView === item.label
                                ? 'bg-ivolve-mid text-white shadow-md border-l-4 border-ivolve-bright'
                                : 'text-gray-300 hover:bg-ivolve-mid/50 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} className={activeView === item.label ? 'text-ivolve-bright' : ''} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-ivolve-mid/30 bg-ivolve-dark/50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-ivolve-mid flex items-center justify-center font-bold text-ivolve-paper border-2 border-ivolve-bright">
                        MF
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Matt Fay</p>
                        <p className="text-xs text-ivolve-bright">Housing Partnerships</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
