import React from 'react';

export const BatteryWidget: React.FC<{ w?: number; h?: number }> = () => {
    return (
        <div className="h-full flex flex-col justify-center items-center p-4">
            <div className="w-full h-12 bg-slate-100 rounded-lg overflow-hidden flex border border-slate-200">
                <div className="h-full bg-green-500 w-[60%]" title="Done (60%)" />
                <div className="h-full bg-orange-400 w-[25%]" title="Working on it (25%)" />
                <div className="h-full bg-red-500 w-[15%]" title="Stuck (15%)" />
            </div>
            <div className="flex gap-4 mt-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Done</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400" />
                    <span>Working</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Stuck</span>
                </div>
            </div>
        </div>
    );
};
