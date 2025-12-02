import React from 'react';
import { Building2, Home, CheckCircle, ArrowRightLeft, Search, SlidersHorizontal } from 'lucide-react';

export const PropertyHubDashboard: React.FC = () => {
    return (
        <div className="w-full bg-gray-50 min-h-screen pb-12">
            {/* HERO SECTION */}
            <div className="bg-gradient-to-r from-ivolve-dark to-ivolve-mid rounded-b-2xl py-8 px-6 shadow-md">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-2">Property Hub</h1>
                    <p className="text-white/80 text-lg">Manage your property portfolio</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8 flex flex-col gap-8">
                {/* STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={<Building2 className="w-6 h-6 text-ivolve-mid" />}
                        number="47"
                        label="Total Properties"
                    />
                    <StatCard
                        icon={<Home className="w-6 h-6 text-ivolve-mid" />}
                        number="156"
                        label="Total Units"
                    />
                    <StatCard
                        icon={<CheckCircle className="w-6 h-6 text-ivolve-mid" />}
                        number="42"
                        label="In Management"
                    />
                    <StatCard
                        icon={<ArrowRightLeft className="w-6 h-6 text-ivolve-mid" />}
                        number="5"
                        label="Handed Back"
                    />
                </div>

                {/* SEARCH SECTION */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-grow w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search properties..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ivolve-mid focus:border-transparent transition-all"
                                onChange={(e) => console.log('Search:', e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
                                onClick={() => console.log('Advanced Search clicked')}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Advanced Search
                            </button>
                            <button
                                className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-ivolve-mid text-white font-medium hover:bg-ivolve-dark transition-colors shadow-sm whitespace-nowrap"
                                onClick={() => console.log('See All Properties clicked')}
                            >
                                See All Properties
                            </button>
                        </div>
                    </div>
                </div>

                {/* HIGHLIGHT CARDS */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-800 px-1">Highlights</h2>
                    <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        <HighlightCard
                            title="Newest Property"
                            subtitle="Added 2 days ago"
                            content="124 Maple Avenue, Springfield"
                            tag="New"
                        />
                        <HighlightCard
                            title="Opening Soon"
                            subtitle="Launch: Dec 15"
                            content="The Heights, Block B"
                            tag="Upcoming"
                        />
                        <HighlightCard
                            title="Major Works"
                            subtitle="Roof Repair"
                            content="Riverside Complex"
                            tag="Maintenance"
                        />
                        <HighlightCard
                            title="Handing Back"
                            subtitle="End of Lease"
                            content="78 Oak Lane"
                            tag="Action Required"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    number: string;
    label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, number, label }) => (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="p-3 bg-ivolve-paper rounded-lg shrink-0">
            {icon}
        </div>
        <div>
            <div className="text-2xl font-bold text-gray-900">{number}</div>
            <div className="text-sm text-gray-500 font-medium">{label}</div>
        </div>
    </div>
);

interface HighlightCardProps {
    title: string;
    subtitle: string;
    content: string;
    tag: string;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ title, subtitle, content, tag }) => (
    <div className="min-w-[280px] bg-ivolve-paper rounded-xl p-5 border border-ivolve-mid/10 flex flex-col gap-3 hover:border-ivolve-mid/30 transition-colors cursor-pointer">
        <div className="flex justify-between items-start">
            <span className="bg-white/80 text-ivolve-dark text-xs font-semibold px-2 py-1 rounded-md border border-ivolve-mid/10">
                {tag}
            </span>
        </div>
        <div>
            <h3 className="font-bold text-lg text-ivolve-dark">{title}</h3>
            <p className="text-sm text-ivolve-mid font-medium">{subtitle}</p>
        </div>
        <p className="text-gray-600 text-sm mt-1">{content}</p>
    </div>
);
