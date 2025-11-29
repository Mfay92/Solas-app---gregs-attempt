import React from 'react';
import { TrendingUp } from 'lucide-react';

export const NumbersWidget: React.FC<{ w?: number; h?: number }> = ({ h = 4 }) => {
    const isCompact = h < 3;

    return (
        <div className="h-full w-full relative overflow-hidden p-6 flex flex-col justify-between">
            {/* Background Sparkline (Simplified) */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
                    <path d="M0 20 L0 10 L10 12 L20 8 L30 15 L40 10 L50 18 L60 5 L70 12 L80 8 L90 15 L100 10 L100 20 Z" fill="currentColor" className="text-ivolve-mid" />
                </svg>
            </div>

            <div className="relative z-10">
                <h3 className="text-4xl font-bold tracking-tight text-gradient-solas">£124,500</h3>
            </div>

            {!isCompact && (
                <div className="relative z-10 flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp size={20} className="text-green-500" />
                            <span className="text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-full text-sm">
                                +12.5%
                            </span>
                            <span className="text-slate-500 text-sm font-medium">vs last month</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
