import React from 'react';
import { Sparkles } from 'lucide-react';

export const Sidekick: React.FC = () => {
    return (
        <button
            onClick={() => console.log("Sidekick clicked")}
            className="fixed bottom-4 left-4 z-50 group flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-ivolve-dark to-ivolve-mid shadow-lg border border-white/10 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ivolve-mid focus:ring-offset-2"
            aria-label="Open Sidekick assistant"
        >
            <Sparkles className="w-6 h-6 text-white" />

            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-3 py-1.5 text-sm font-medium text-ivolve-dark bg-ivolve-paper rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-ivolve-dark/10">
                Need help? Ask Sidekick!
            </span>
        </button>
    );
};
