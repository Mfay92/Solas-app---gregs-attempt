import React from 'react';
import { X, Battery, BarChart3, FileText, Activity } from 'lucide-react';
import { WidgetData } from './types';

interface WidgetCentreProps {
    isOpen: boolean;
    onClose: () => void;
    onAddWidget: (type: WidgetData['type']) => void;
}

export const WidgetCentre: React.FC<WidgetCentreProps> = ({ isOpen, onClose, onAddWidget }) => {
    if (!isOpen) return null;

    const widgetOptions = [
        {
            type: 'battery' as const,
            title: 'Battery',
            description: 'Track the status of your projects visually.',
            icon: <Battery size={24} className="text-white" />,
            category: 'Project Management'
        },
        {
            type: 'numbers' as const,
            title: 'Numbers',
            description: 'Display key metrics and trends.',
            icon: <Activity size={24} className="text-white" />,
            category: 'Dashboard'
        },
        {
            type: 'chart' as const,
            title: 'Chart',
            description: 'Visualize data with Bar, Line, or Pie charts.',
            icon: <BarChart3 size={24} className="text-white" />,
            category: 'Dashboard'
        },
        {
            type: 'files' as const,
            title: 'Files Gallery',
            description: 'Access and manage your recent documents.',
            icon: <FileText size={24} className="text-white" />,
            category: 'Content'
        },
    ];

    const categories = ['All Widgets', 'Dashboard', 'Project Management', 'Content', 'Motivation'];

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex overflow-hidden border border-slate-200">

                {/* Sidebar */}
                <div className="w-64 bg-ivolve-dark border-r border-white/10 p-6 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-8 font-rounded tracking-wide">Widget Centre</h2>
                    <nav className="space-y-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${cat === 'All Widgets'
                                    ? 'bg-ivolve-mid text-white shadow-md'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-slate-50">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
                        <div>
                            <h3 className="text-2xl font-bold text-ivolve-dark font-rounded">All Widgets</h3>
                            <p className="text-slate-500 mt-1">Choose a widget to add to your dashboard</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-ivolve-mid hover:bg-ivolve-dark text-white rounded-full transition-colors shadow-sm hover:shadow-md"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Widget Grid */}
                    <div className="p-8 overflow-y-auto flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {widgetOptions.map((widget) => (
                                <div
                                    key={widget.type}
                                    className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-ivolve-mid hover:shadow-lg transition-all cursor-pointer relative flex flex-col h-full hover:-translate-y-1 duration-300"
                                    onClick={() => {
                                        onAddWidget(widget.type);
                                        onClose();
                                    }}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-ivolve-mid rounded-full shadow-md group-hover:bg-ivolve-bright group-hover:scale-110 transition-all duration-300">
                                            {widget.icon}
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-ivolve-blue font-bold text-sm">
                                            Add +
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-ivolve-mid transition-colors">{widget.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">{widget.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
