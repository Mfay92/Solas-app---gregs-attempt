import React, { useState, useEffect } from 'react';
import { Bell, Search, CheckSquare, Plus, Package } from 'lucide-react';

interface DashboardHeaderProps {
    onAddWidget: () => void;
    onToggleStorage: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onAddWidget, onToggleStorage }) => {
    const [greeting, setGreeting] = useState('');
    const [subGreeting, setSubGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        let timeGreeting = 'Good morning';
        if (hour >= 12) timeGreeting = 'Good afternoon';
        if (hour >= 17) timeGreeting = 'Good evening';

        setGreeting(`${timeGreeting}, Matt`);

        const wittyPhrases = [
            "He's back again!",
            "Ready to conquer the property market?",
            "Your portfolio is looking sharp today.",
            "Let's get things done.",
            "Coffee first, then contracts?",
            "The one, the only.",
            "Another day, another opportunity."
        ];
        setSubGreeting(wittyPhrases[Math.floor(Math.random() * wittyPhrases.length)]);
    }, []);

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200/60 sticky top-0 z-30 transition-all">
            {/* Greeting Section */}
            <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight font-rounded">
                    {greeting} <span className="text-xl animate-wave inline-block origin-bottom-right">👋</span>
                </h1>
                <p className="text-slate-500 text-xs mt-0.5 font-medium animate-fade-in">
                    {subGreeting}
                </p>
            </div>

            {/* Right Side Actions - Control Center */}
            <div className="flex items-center gap-3">

                {/* Tools Group */}
                <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
                    <button className="p-2 text-slate-400 hover:text-ivolve-mid hover:bg-white rounded-full transition-all" title="Search">
                        <Search size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-ivolve-mid hover:bg-white rounded-full transition-all relative" title="Notifications">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-ivolve-mid hover:bg-white rounded-full transition-all relative" title="My Tasks">
                        <CheckSquare size={18} />
                        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ivolve-mid opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ivolve-mid border-2 border-white"></span>
                        </span>
                    </button>
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                {/* Primary Actions */}
                <button
                    onClick={onToggleStorage}
                    className="flex items-center gap-2 text-slate-600 hover:text-ivolve-dark hover:bg-slate-100 px-3 py-2 rounded-lg font-medium transition-all text-sm"
                >
                    <Package size={18} />
                    <span>Storage</span>
                </button>

                <button
                    onClick={onAddWidget}
                    className="flex items-center gap-2 bg-ivolve-mid hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg active:scale-95 text-sm"
                >
                    <Plus size={18} strokeWidth={3} />
                    Add Widget
                </button>
            </div>
        </div>
    );
};
